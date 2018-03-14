'use strict'

var express = require('express')
var app = express()

app.set('view engine', 'ejs')
app.set('views', 'view')
app.use(express.static('static'))
app.listen(8000)
app.get('/', index)
app.get('/aanmelden.ejs', aanmelden)
app.get('/profielmaken.ejs', profielAanmaken)
app.get('/profielstap1.ejs', profielStap1)
app.get('/profielstap2.ejs', profielStap2)
app.get('/ingelogd.ejs', ingelogd)
app.get('/eigenprofiel.ejs', eigenProfiel)
app.get('/kandidaadprofiel.ejs', kandidaadProfiel)
app.get('/berichten.ejs', berichten)
app.get('/berichtendetail.ejs', berichten)




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


