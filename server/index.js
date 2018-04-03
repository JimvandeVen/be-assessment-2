'use strict'

require('dotenv').config()

var express = require('express')
//var fetch = require('node-fetch')
var app = express()
var argon2 = require('argon2')
var bodyParser = require('body-parser')
var mysql = require('mysql')
var session = require('express-session')



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

app.listen(8000)

app.get('/', index)
app.get('/aanmelden', aanmeldenForm)
app.get('/profielstap2', profielStap2)
app.get('/ingelogd', ingelogd)
app.get('/eigenprofiel', eigenProfiel)
app.get('/kandidaadprofiel', kandidaadProfiel)
app.get('/berichten', berichten)
app.get('/berichtendetail', berichten)
app.get('/log-out', logout)
app.get('/aanpassenForm', aanpassenForm)


app.post('/profielPost', aanmelden)
app.post('/log-in', login)
app.post('/boekToevoegen', boekToevoegen)
app.post('/aanpassen', profielAanpassen)

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

function profielStap2(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        json: () => res.json(result),
        html: () => res.render('profielstap2.ejs', Object.assign({}, result))
    })
}

function ingelogd(req, res) {
    var email = req.session.user.email

    if (req.session.user) {
        connection.query('SELECT partnerGeslacht FROM gebruikers WHERE email = ?', email, done)

        function done(err, data) {
            console.log(data)
            if (err) {
                console.error(err)
            } else {
                var gebruikerGeslacht = data[0].partnerGeslacht
                console.log(data)
                connection.query('SELECT * FROM gebruikers WHERE gebruikerGeslacht = ?', gebruikerGeslacht, done)

                function done(err, data) {
                    console.log(data)
                    if (err) {
                        console.error(err)
                    } else {
                        res.render('ingelogd.ejs', {
                            data: data
                        })
                    }
                }
            }
        }

    } else {
        res.status(401).send('Credentials required')
    }
}

function eigenProfiel(req, res) {
    var email = req.session.user.email

    if (req.session.user) {
        connection.query('SELECT * FROM gebruikers LEFT JOIN gelezenBoekenTabel ON gebruikers.email = gelezenBoekenTabel.email WHERE gebruikers.email = ?', email, done)

        function done(err, data) {
            console.log(data)
            res.render('eigenprofiel.ejs', {
                data: data
            })
        }

    } else {
        res.status(401).send('Credentials required')
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
        }, email] , done)
    
    function done(err, data) {
                console.log(data)
                if (err) {
                    console.error(err)
                } else {
                    eigenProfiel(req, res)
                }
            }
}

//connection.query('SELECT * FROM gebruikers LEFT JOIN gelezenBoekenTabel ON gebruikers.gelezenBoeken = gelezenBoekenTabel.ISBN WHERE gebruikers.email = ?', email, done)

//connection.query('SELECT * FROM gebruikers WHERE email = ?', email, done)
//
//        function done(err, data) {
//            res.render('eigenprofiel.ejs', {
//                data: data[0]
//            })
//        }
//    } else {
//        res.status(401).send('Credentials required')
//    }


function kandidaadProfiel(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    if (req.session.user) {
        res.render('kandidaadprofiel.ejs', Object.assign({}, result))
    } else {
        res.status(401).send('Credentials required')
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
        res.status(401).send('Credentials required')
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
        res.status(401).send('Credentials required')
    }
}

//connection.query('UPDATE gebruikers SET gelezenBoeken WHERE email = ? VALUE = ?', email, ISBN, done)


function boekToevoegen(req, res) {
    var titel = req.body.titel
    var auteur = req.body.auteur
    var ISBN = req.body.ISBN
    var email = req.session.user.email
    console.log(email)
    console.log(ISBN)


    //    var promise1 = new Promise(function (resolve, reject) {
    //        resolve('Success!');
    //    });
    //
    //    promise1.then(function (value) {
    //        console.log(value);
    //        // expected output: "Success!"
    //    });
    //
    //    router.post('/Registration', function (req, res) {
    //        return User
    //            .findOne({
    //                username: req.body.username
    //            })
    //            .then((user) => {
    //                if (user) {
    //                    return console.log({
    //                        msg: "Username already been taken"
    //                    });
    //                }
    //                return console.log({
    //                    msg: "Username available."
    //                });
    //            })
    //            .catch((err) => {
    //                return console.error(err);
    //            });
    //    });

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

        function oninsert(err) {
            if (err) {
                next(err)
            } else {
                req.session.user = {
                    email: email
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
                    email: user.email
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
