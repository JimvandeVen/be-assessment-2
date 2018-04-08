// This was made together with Jonah Mijers 

var mysql = require('mysql')

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

function zoekPartnerGeslacht(email) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT gebruikers.partnerGeslacht FROM gebruikers WHERE email = ?', email, function (err, data) {
            if (err) {
                reject(new Error(err))
            } else {
                resolve(data[0].partnerGeslacht)
            }
        })
    })
}

function zoekGebruikersOpGeslacht(geslacht) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM gebruikers WHERE gebruikerGeslacht = ?', geslacht, function (err, data) {
            if (err) {
                reject(new Error(err))
            } else {
                resolve(data)
            }
        })
    })
}

function zoekGelezenBoekenBijGebruiker(email) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT ISBN FROM gelezenBoekenTabel WHERE email = ?', email, function (err, data) {
            if (err) {
                reject(new Error(err))
            } else {
                resolve(data)
            }
        })
    })
}

function koppelBoekenAanGebruikers(gebruikers) {
    return new Promise(async function (resolve, reject) {
        try {
            await new Promise(function (resolve, reject) {
                gebruikers.forEach(async function (gebruiker, i) {
                    gebruiker.gelezenBoeken = await zoekGelezenBoekenBijGebruiker(gebruiker.email)
                    if (i == gebruikers.length - 1) {
                        resolve()
                    }
                })
            })
            resolve(gebruikers)
        } catch (err) {
            reject(new Error(err))
        }
    })
}

function matchGebruikers(eigenBoeken, gebruikers) {
    return new Promise(function (resolve, reject) {

        gebruikers.forEach(gebruiker => { 
            gebruiker.gematchedeBoeken = []
            
            gebruiker.gelezenBoeken.forEach(boek => {
                eigenBoeken.forEach(mijnBoek => {
                    if (mijnBoek.ISBN == boek.ISBN) {
                        gebruiker.gematchedeBoeken.push(boek)
                    }
                })
            })
        })
        
        const matchArray = gebruikers
            .filter(gebruiker => gebruiker.gematchedeBoeken.length)
            .sort((a, b) => a.gematchedeBoeken.length - b.gematchedeBoeken.length);
        
        resolve(matchArray)
    })
}




module.exports = {
    zoekPartnerGeslacht: zoekPartnerGeslacht,
    zoekGebruikersOpGeslacht: zoekGebruikersOpGeslacht,
    zoekGelezenBoekenBijGebruiker: zoekGelezenBoekenBijGebruiker,
    koppelBoekenAanGebruikers: koppelBoekenAanGebruikers,
    matchGebruikers: matchGebruikers
}
