'use strict'

require('dotenv').config()

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

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

app.set('view engine', 'ejs')
app.set('views', 'view')
app.use(express.static('static'))
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(bodyParser.json())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}))
app.use('/image', express.static('static/upload'))
app.use(methodOverride('_method'))

app.listen(8000)

app.get('/', index)
app.get('/aanmelden', aanmeldenForm)
app.get('/ingelogd', ingelogd)
app.get('/eigenprofiel', eigenProfiel)
app.get('/berichten', berichten)
app.get('/berichtendetail', berichten)
app.get('/log-out', logout)
app.get('/aanpassenForm', aanpassenForm)
app.get('/:id', kandidaadProfiel)


app.post('/profielPost', upload.single('image'), aanmelden)
app.post('/log-in', login)
app.post('/boekToevoegen', boekToevoegen)
app.post('/aanpassen', profielAanpassen)

app.delete('/:ISBN', boekVerwijderen)

console.log('Server is Listening')


function index(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.render('index.ejs', Object.assign({}, result))
}

function aanmeldenForm(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.render('aanmelden.ejs', Object.assign({}, result))
}

async function ingelogd(req, res) {
    if (req.session.user) {
        var email = req.session.user.email
        var id = req.session.user.id
        try {
            var partnerGeslacht = await matching.zoekPartnerGeslacht(email)
            var gebruikersOpGeslacht = await matching.zoekGebruikersOpGeslacht(partnerGeslacht)
            var gebruikersMetBoeken = await matching.koppelBoekenAanGebruikers(gebruikersOpGeslacht)
            var eigenBoeken = await matching.zoekGelezenBoekenBijGebruiker(email)
            var gematchdeGebruikers = await matching.matchGebruikers(eigenBoeken, gebruikersMetBoeken)
            
            res.render('ingelogd.ejs', {data: gematchdeGebruikers})
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
        connection.query('SELECT * FROM gebruikers LEFT JOIN gelezenBoekenTabel ON gebruikers.email = gelezenBoekenTabel.email WHERE gebruikers.email = ?', email, done)

        function done(err, data) {
            console.log(data)
            res.render('eigenprofiel.ejs', {
                data: data
            })
        }

    } else {
        res.status(401).render('nietIngelogd.ejs')
    }
}

function aanpassenForm(req, res) {
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
        }, email], done)

    function done(err, data) {
        console.log(data)
        if (err) {
            console.error(err)
        } else {
            eigenProfiel(req, res)
        }
    }
}

function kandidaadProfiel(req, res) {
    var id = req.params.id
    var badRequest = isNaN(id)

    if (req.session.user) {
        connection.query('SELECT * FROM gebruikers LEFT JOIN gelezenBoekenTabel ON gebruikers.email = gelezenBoekenTabel.email WHERE id = ?', id, done)

        function done(err, data) {
            if (err) {
                console.error(err)

            } else if (badRequest) {
                var result = {
                    errors: [
                        {
                            id: 400,
                            title: 'Bad Request',
                            description: 'Bad Request',
                            detail: 'detail'
                }
        ]
                }
                res.render('error.ejs', Object.assign({}, result))
                return
            } else if (data.length === 0) {
                // 404 not found
                var result = {
                    errors: [
                        {
                            id: 404,
                            title: 'Page Not Found',
                            description: 'This animal does not exist',
                            detail: 'detail'
                }
        ]
                }
                res.format({
                    json: () => res.json(result),
                    html: () => res.render('error.ejs', Object.assign({}, result))
                })
                return
            } else {
                console.log(data)
                res.render('kandidaadprofiel.ejs', {
                    data: data
                })

            }
        }

    } else {
        res.status(401).render('nietIngelogd.ejs')
    }
}

function berichten(req, res) {
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

function berichtendetail(req, res) {
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

function boekToevoegen(req, res) {
    var titel = req.body.titel
    var auteur = req.body.auteur
    var ISBN = req.body.ISBN
    var email = req.session.user.email
    console.log(email)
    console.log(ISBN)

    var boekToevoegenPromise = new Promise(function (resolve, reject) {
            connection.query('SELECT * FROM boeken WHERE ISBN = ?', ISBN, done)

            function done(err, data) {
                console.log(data)
                if (err) {
                    reject(err)
                } else if (data.length == 0) {
                    console.log('this book does not exist')
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
                console.log(data)
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

function boekVerwijderen(req, res) {
    var ISBN = req.params.ISBN
    var email = req.session.user.email
    console.log(ISBN)
    console.log(email)

    connection.query('DELETE FROM gelezenBoekenTabel WHERE email = ? AND ISBN = ?', [email, ISBN], done)

    function done(err) {
        if (err) {
            console.error(err)
        } else {
            res.redirect('/eigenprofiel')
        }
    }
}



function aanmelden(req, res, next) {
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
    console.log(email)
    if (!email || !password) {
        res
            .status(400)
            .send('Username or password are missing')

        return
    }
    if (password.length < min || password.length > max) {
        res
            .status(400)
            .send(
                'Password must be between ' + min +
                ' and ' + max + ' characters'
            )
        return
    }
    if (password !== passwordVerify) {
        res
            .status(400)
            .send(
                'Password verification failed be sure to write the same password twice'
            )
        return
    }

    connection.query('SELECT * FROM gebruikers WHERE email = ?', email, done)

    function done(err, data) {
        console.log(req.file)
        if (err) {
            next(err)
        } else if (data.length !== 0) {
            res.status(409).send('email already in use')

        } else {
            argon2.hash(password).then(onhash, next)
        }
    }

    function onhash(hash) {
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
                if (req.file) {
                    console.log("There was a file: ", req.file)
                    fs.rename(req.file.path, 'static/upload/' + data.insertId + '.jpg', err => {
                        if (err) {
                            console.error(err)
                        }
                    })
                }
                req.session.user = {
                    email: email,
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
            .send('Username or password are missing')

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
                req.session.user = {
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

function logout(req, res, next) {
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