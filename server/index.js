'use strict'

require('dotenv').config()
// requireing the middleware used in this server
var express = require('express')
var app = express()
var argon2 = require('argon2')
var bodyParser = require('body-parser')
var mysql = require('mysql')
var session = require('express-session')
var methodOverride = require('method-override')
var multer = require('multer')
var fs = require('fs')
var matching = require('./matching')

var upload = multer({
    dest: 'static/upload/'
})
// making the connection with the mysql database
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

app.set('view engine', 'ejs') // setting the view engine, and the location of the different ejs templates
app.set('views', 'view') // setting the view engine, and the location of the different ejs templates
app.use(express.static('static'))
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(bodyParser.json()) // Using body pareser to get the data from the forms
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
})) // Initialising sessions, so users can log in and out
app.use('/image', express.static('static/upload')) // Setting the location for the uploaded images 
app.use(methodOverride('_method')) //Used in lieu of a former method i used, with method override i didn't need to use the client side javascript to remove books

app.listen(8000) // The port to listen to

app.get('/', index)
app.get('/aanmelden', aanmeldenForm)
app.get('/ingelogd', ingelogd)
app.get('/eigenprofiel', eigenProfiel)
app.get('/berichten', berichten)
app.get('/berichtendetail', berichten)
app.get('/log-out', logout)
app.get('/aanpassenForm', aanpassenForm)
app.get('/:id', kandidaadProfiel)
// Above. All my get HTTP methods, for the different pages I Use
app.post('/profielPost', upload.single('image'), aanmelden)
app.post('/log-in', login)
app.post('/boekToevoegen', boekToevoegen)
app.post('/aanpassen', profielAanpassen)
// Above. All my post HTTP methods, for the different forms I use.
app.delete('/:ISBN', boekVerwijderen)
// Above. The delete HTTP Method for removing read books.
console.log('Server is Listening')


function index(req, res) { // This is the index, one of the two pages you can see without logging in or registering
    var result = {
        errors: [],
        data: undefined
    }
    res.render('index.ejs', Object.assign({}, result))
}

function aanmeldenForm(req, res) { // This is the register form, one of the two pages you can see without logging in or registering
    var result = {
        errors: [],
        data: undefined
    }
    res.render('aanmelden.ejs', Object.assign({}, result))
}

function aanmelden(req, res, next) { // Register 
    var email = req.body.email
    var password = req.body.password
    var passwordVerify = req.body.passwordVerify
    var naam = req.body.naam
    var gebruikerGeslacht = req.body.gebruikerGeslacht
    var partnerGeslacht = req.body.partnerGeslacht
    var woonplaats = req.body.woonplaats
    var geboortedatum = req.body.geboortedatum
    var min = 8
    var max = 160
    if (!email || !password) { // Checks if email or password is there
        res
            .status(400)
            .send('Email of wachtwoord mist.')

        return
    }
    if (password.length < min || password.length > max) { // Checks if password is correct length
        res
            .status(400)
            .send(
                'Wachtwoord moet tussen ' + min +
                ' en ' + max + ' characters zijn.'
            )
        return
    }
    if (password !== passwordVerify) { // Checks if password and verify password is the same
        res
            .status(400)
            .send(
                'Wachtwoord verificatie gefaald, zorg dat de wachtwoorden hetzelfde zijn.'
            )
        return
    }

    connection.query('SELECT * FROM gebruikers WHERE email = ?', email, done)

    function done(err, data) {
        if (err) {
            next(err)
        } else if (data.length !== 0) { // Checks if email is allready in use
            res.status(409).send('email al in gebruik')

        } else { // If email is good, hashes the password
            argon2.hash(password).then(onhash, next)
        }
    }

    function onhash(hash) { // Inserts the data into the database
        connection.query('INSERT INTO gebruikers SET ?', {
            email: email,
            hash: hash,
            naam: naam,
            gebruikerGeslacht: gebruikerGeslacht,
            partnerGeslacht: partnerGeslacht,
            woonplaats: woonplaats,
            geboortedatum: geboortedatum
        }, oninsert)

        function oninsert(err, data) {
            if (err) {
                next(err)
            } else {
                if (req.file) { // If there is a file in the form renames the file to new users Id, the uploads it to the correct folder.
                    fs.rename(req.file.path, 'static/upload/' + data.insertId + '.jpg', err => {
                        if (err) {
                            console.error(err)
                        }
                    })
                }
                req.session.user = { // Saves the current users email into sessions, for future reference.
                    email: email,
                    id: data.insertId
                }
                res.redirect('/ingelogd')
            }
        }

    }
}

function login(req, res, next) {
    var email = req.body.email
    var password = req.body.password

    if (!email || !password) {
        res
            .status(400)
            .send('email of wachtwoord mist')

        return
    }

    connection.query(
        'SELECT * FROM gebruikers WHERE email = ?',
        email,
        done
    )

    function done(err, data) {
        var user = data && data[0]

        if (err) {
            next(err)
        } else if (user) {
            argon2
                .verify(user.hash, password)
                .then(onverify, next)
        } else {
            res
                .status(401)
                .send('Email does not exist')
        }

        function onverify(match) {
            if (match) {
                req.session.user = { // Saves the id and email of the current user in sessions for future reference.
                    email: user.email,
                    id: user.id
                };
                res.redirect('/ingelogd')
            } else {
                res.status(401).send('Password incorrect')
            }
        }
    }
}

async function ingelogd(req, res) { // This function is the most complicated part of the server, it goes through several promisses. After which the current user gets to see the other users that have at least some books in common. I wrote this with the help of Jonah Meijers.
    if (req.session.user) { // Here The server checks if you are logged in. If not it loads a page promting the visitor to log in or register.
        var email = req.session.user.email
        var id = req.session.user.id
        try {
            var partnerGeslacht = await matching.zoekPartnerGeslacht(email) // Selects the current users wanted gender using email. 
            var gebruikersOpGeslacht = await matching.zoekGebruikersOpGeslacht(partnerGeslacht) // Selects all user with the wanted gender of the current user.
            var gebruikersMetBoeken = await matching.koppelBoekenAanGebruikers(gebruikersOpGeslacht) // Selects all the books read by the previously selected users, and stores them with the proper users.
            var eigenBoeken = await matching.zoekGelezenBoekenBijGebruiker(email) // Selects the current users read books.
            var gematchdeGebruikers = await matching.matchGebruikers(eigenBoeken, gebruikersMetBoeken) // For each read boek of the current user, the server checks if another user has also read it. Then with a filter and a sort function the server resolves the promise with an array of users to be shown in the feed of the current user. 

            res.render('ingelogd.ejs', {
                data: gematchdeGebruikers
            })
        } catch (err) {
            console.error(err)
        }
    } else {
        res.status(401).render('nietIngelogd.ejs')
    }
}

function eigenProfiel(req, res) {

    if (req.session.user) {
        var email = req.session.user.email
        connection.query('SELECT * FROM gebruikers LEFT JOIN gelezenBoekenTabel ON gebruikers.email = gelezenBoekenTabel.email WHERE gebruikers.email = ?', email, done) // Server selects the data of the current user from the database and joins it with the books read by the current user

        function done(err, data) {
            res.render('eigenprofiel.ejs', {
                data: data
            })
        }

    } else {
        res.status(401).render('nietIngelogd.ejs')
    }
}

function aanpassenForm(req, res) { // The form to change your profile
    var result = {
        errors: [],
        data: undefined
    }
    res.render('aanpassen.ejs', Object.assign({}, result))
}

function profielAanpassen(req, res) {
    var email = req.session.user.email
    var naam = req.body.naam
    var gebruikerGeslacht = req.body.gebruikerGeslacht
    var partnerGeslacht = req.body.partnerGeslacht
    var woonplaats = req.body.woonplaats
    var geboortedatum = req.body.geboortedatum

    connection.query('UPDATE gebruikers SET ? WHERE email = ?', [{
        naam: naam,
        gebruikerGeslacht: gebruikerGeslacht,
        partnerGeslacht: partnerGeslacht,
        woonplaats: woonplaats,
        geboortedatum: geboortedatum
        }, email], done) // Updates the database with the new data

    function done(err, data) {
        if (err) {
            console.error(err)
        } else {
            eigenProfiel(req, res)
        }
    }
}

function kandidaadProfiel(req, res) { // Shows the dtail page of the profiles
    var id = req.params.id
    var badRequest = isNaN(id) // Checks if the requested id is a number

    if (req.session.user) {
        connection.query('SELECT * FROM gebruikers LEFT JOIN gelezenBoekenTabel ON gebruikers.email = gelezenBoekenTabel.email WHERE id = ?', id, done) // Server selects the data of the requested user from the database and joins it with the books read by that user

        function done(err, data) {
            if (err) {
                console.error(err)

            } else if (badRequest) {
                var result = {
                    errors: [{
                            id: 400,
                            title: 'Bad Request',
                            detail: 'Bad Request'
                }
        ]
                }
                res.render('error.ejs', Object.assign({}, result)) // Used the page from the shelter assignment (I liked the cats)
                return
            } else if (data.length === 0) {
                var result = {
                    errors: [
                        {
                            id: 404,
                            title: 'Page Not Found',
                            detail: 'Deze gebruiker bestaat niet'
                }
        ]
                }
                res.format({
                    json: () => res.json(result),
                    html: () => res.render('error.ejs', Object.assign({}, result))
                })
                return
            } else {
                res.render('kandidaadprofiel.ejs', {
                    data: data
                })

            }
        }

    } else {
        res.status(401).render('nietIngelogd.ejs')
    }
}

function berichten(req, res) { // This is a static page
    var result = {
        errors: [],
        data: undefined
    }
    if (req.session.user) {
        res.render('berichten.ejs', Object.assign({}, result))
    } else {
        res.status(401).render('nietIngelogd.ejs')
    }
}

function berichtendetail(req, res) { // This is a static page
    var result = {
        errors: [],
        data: undefined
    }
    if (req.session.user) {
        res.render('berichtendetail.ejs', Object.assign({}, result))
    } else {
        res.status(401).render('nietIngelogd.ejs')
    }
}

function boekToevoegen(req, res) { // The adding of books
    var ISBN = req.body.ISBN
    var email = req.session.user.email

    var boekToevoegenPromise = new Promise(function (resolve, reject) { // Promise that first checks if the ISBN exists in the database, then inserts the read book together with the current user into a new table in the database.
            connection.query('SELECT * FROM boeken WHERE ISBN = ?', ISBN, done)

            function done(err, data) {
                if (err) {
                    reject(err)
                } else if (data.length == 0) {
                    reject(
                        res
                        .status(401)
                        .send('Dit boek bestaat niet. Ga terug en voeg het juiste boek toe.'))
                } else {
                    resolve(data)
                }
            }
        })
        .then(function (data) {
            connection.query('INSERT INTO gelezenBoekenTabel SET email = ?, ISBN =?', [email, ISBN], done)

            function done(err, data) {
                if (err) {
                    console.error(err)
                } else {
                    eigenProfiel(req, res)
                }
            }
        })
        .catch(function (reject) {
            console.error(reject)

        })
}

function boekVerwijderen(req, res) { // The removal of books
    var ISBN = req.params.ISBN
    var email = req.session.user.email

    connection.query('DELETE FROM gelezenBoekenTabel WHERE email = ? AND ISBN = ?', [email, ISBN], done)

    function done(err) {
        if (err) {
            console.error(err)
        } else {
            res.redirect('/eigenprofiel')
        }
    }
}

function logout(req, res, next) { // Logging out.
    req.session.destroy(function (err) {
        if (err) {
            next(err)
        } else {
            res.redirect('/')
        }
    })
}

module.exports = {
    connection: connection
}
