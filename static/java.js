/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/

/* LOGIN */

var main = document.querySelector(".body");
var inlogPlek = document.querySelector(".inloggen");

function openInlog() {
    inlogPlek.classList.remove("hidden");
}

function closeInlog() {
    inlogPlek.classList.add("hidden");
}

main.addEventListener("click", openInlog);