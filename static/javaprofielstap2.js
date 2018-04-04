/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/



var boekToevoegenSection = document.querySelector(".boekToevoegenSection");
var boekToevoegen = document.querySelector(".boekToevoegen");
var boekToevoegenSluit= document.querySelector(".boekToevoegenSluit");

function openToevoegen() {
    boekToevoegenSection.classList.remove("hidden");
}
function closeToevoegen() {
    boekToevoegenSection.classList.add("hidden");
}

boekToevoegen.addEventListener("click", openToevoegen);
boekToevoegenSluit.addEventListener("click", closeToevoegen);

var remove = document.querySelectorAll('.verwijderen')

if (remove.length) {
    remove.forEach(function(button) {
        button.addEventListener('click', verwijder)
    })
}

function verwijder(ev) {
    var button = ev.target
    var ISBN = button.dataset.isbn
    console.log(button)
    console.log(ISBN)

    fetch('/' + ISBN, {method: 'delete'})
        .then(onresponse)
        .then(onload, onfail)

    function onresponse(res) {
        return res.json()
    }

    function onload() {
        window.location = '/eigenprofiel'
    }

    function onfail() {
        throw new Error('Could not delete!')
    }
}

