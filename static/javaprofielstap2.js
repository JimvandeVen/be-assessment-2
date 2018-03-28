/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/



var boekToevoegenSection = document.querySelector(".boekToevoegenSection");
var boekToevoegen = document.querySelector(".boekToevoegen");
var boekToevoegenSluit= document.querySelector(".boekToevoegenSubmit");

function openToevoegen() {
    boekToevoegenSection.classList.remove("hidden");
}

boekToevoegen.addEventListener("click", openToevoegen);
boekToevoegenSubmit.addEventListener("click", closeToevoegen);

