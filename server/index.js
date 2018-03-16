'use strict'

var express = require('express')
var app = express()

app.set('view engine', 'ejs')
app.set('views', 'view')
app.use(express.static('static'))
app.listen(8000)
app.get('/', index)
app.get('/aanmelden', aanmelden)
app.get('/profielmaken', profielAanmaken)
app.get('/profielstap1', profielStap1)
app.get('/profielstap2', profielStap2)
app.get('/ingelogd', ingelogd)
app.get('/eigenprofiel', eigenProfiel)
app.get('/kandidaadprofiel', kandidaadProfiel)
app.get('/berichten', berichten)
app.get('/berichtendetail', berichten)

console.log('Server is Listening' )




function index(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        json: () => res.json(result),
        html: () => res.render('index.ejs', Object.assign({}, result))
    })
}

function aanmelden(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        json: () => res.json(result),
        html: () => res.render('aanmelden.ejs', Object.assign({}, result))
    })
}

function profielAanmaken(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        json: () => res.json(result),
        html: () => res.render('profielmaken.ejs', Object.assign({}, result))
    })
}

function profielStap1(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        json: () => res.json(result),
        html: () => res.render('profielstap1.ejs', Object.assign({}, result))
    })
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
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        json: () => res.json(result),
        html: () => res.render('ingelogd.ejs', Object.assign({}, result))
    })
}

function eigenProfiel(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        json: () => res.json(result),
        html: () => res.render('eigenprofiel.ejs', Object.assign({}, result))
    })
}

function kandidaadProfiel(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        json: () => res.json(result),
        html: () => res.render('kandidaadprofiel.ejs', Object.assign({}, result))
    })
}

function berichten(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        json: () => res.json(result),
        html: () => res.render('berichten.ejs', Object.assign({}, result))
    })
}

function berichtendetail(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        json: () => res.json(result),
        html: () => res.render('berichtendetail.ejs', Object.assign({}, result))
    })
}


