"use strict";
window.onload = init;
let id;
let typeList;
let counter = 0;
let filterCounter = 0;
let maxPokemon;
let currentTypeList;
let currentType;
let obj;

let searchField;
let maxField;
let filterField;
let key = "poke-";
let nameKey;
let maxKey;
let filterKey;

// grab the stored data, will return `null` if the user has never been to this page
let storedName;
let storedMax;
let storedFilter;


function init() {
    //sets up local storage
    nameKey = key + "name";
    maxKey = key + "max";
    filterKey = key + "filter";

    storedName = localStorage.getItem(nameKey);
    storedMax = localStorage.getItem(maxKey);
    storedFilter = localStorage.getItem(filterKey);

    searchField = document.querySelector("#searchterm").value;
    maxField = document.querySelector("#searchMax").value;
    filterField = document.querySelector("#filterStart").value;
//prints saved data if any
    if (storedName) {
        document.querySelector("#searchterm").value = storedName;
    }

    if (storedMax) {
        document.querySelector("#searchMax").value = storedMax;
    }

    if (storedFilter) {
        document.querySelector("#filterStart").value = storedFilter;
    }

    //sets up events on buttons
    document.querySelector("#search").onclick = getData;
    document.querySelector("#randomize").onclick = getDataRandom;
    document.querySelector("#filter").onclick = filterClick;

}

//gets data from api
function getData() {
    const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
    localStorage.setItem(nameKey, document.querySelector("#searchterm").value);
    storedName = localStorage.getItem(nameKey);
    localStorage.setItem(maxKey, document.querySelector("#searchMax").value);
    storedMax = localStorage.getItem(maxKey);
    localStorage.setItem(filterKey, document.querySelector("#filterStart").value);
    storedFilter = localStorage.getItem(filterKey);

    let url = POKEMON_URL;
    url += document.querySelector("#searchterm").value.toLowerCase();
    maxPokemon = document.querySelector("#searchMax").value;

    document.querySelector("#content").innerHTML = "";
    counter = 0;

    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

//randomizes id and gets from api
function getDataRandom() {
    const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";

    localStorage.setItem(nameKey, document.querySelector("#searchterm").value);
    storedName = localStorage.getItem(nameKey);
    localStorage.setItem(maxKey, document.querySelector("#searchMax").value);
    storedMax = localStorage.getItem(maxKey);
    localStorage.setItem(filterKey, document.querySelector("#filterStart").value);
    storedFilter = localStorage.getItem(filterKey);

    let url = POKEMON_URL;
    url += Math.floor(Math.random() * 898) + 1;
    maxPokemon = document.querySelector("#searchMax").value;

    document.querySelector("#content").innerHTML = "";
    counter = 0;

    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

//searches for first pokemon of type and calls different load method
function getDataFilterStart() {
    const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
    checkRadio;

    localStorage.setItem(nameKey, document.querySelector("#searchterm").value);
    storedName = localStorage.getItem(nameKey);
    localStorage.setItem(maxKey, document.querySelector("#searchMax").value);
    storedMax = localStorage.getItem(maxKey);
    localStorage.setItem(filterKey, document.querySelector("#filterStart").value);
    storedFilter = localStorage.getItem(filterKey);

    let url3 = POKEMON_URL;
    url3 += document.querySelector("#filterStart").value.toLowerCase();
    maxPokemon = document.querySelector("#searchMax").value;

    document.querySelector("#content").innerHTML = "";
    let xhr3 = new XMLHttpRequest();

    xhr3.onload = dataLoadedFilter;

    xhr3.onerror = dataError;

    xhr3.open("GET", url3);
    xhr3.send();
    counter = 0;
}

//gets next pokemon in line for filter
function getDataFilterNext(num) {
    const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";

    let url3 = POKEMON_URL;
    url3 += (num + 1);
    maxPokemon = document.querySelector("#searchMax").value;



    let xhr3 = new XMLHttpRequest();

    xhr3.onload = dataLoadedFilter;

    xhr3.onerror = dataError;

    xhr3.open("GET", url3);
    xhr3.send();
}

//gets next pokemon in line
function getDataNext() {
    const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";

    let url2 = POKEMON_URL;
    url2 += (id + 1);
    maxPokemon = document.querySelector("#searchMax").value;



    let xhr2 = new XMLHttpRequest();

    xhr2.onload = dataLoaded;

    xhr2.onerror = dataError;

    xhr2.open("GET", url2);
    xhr2.send();
}

function dataError(e) {

}

//loads and prints data
function dataLoaded(e) {
    let xhr = e.target;
    try {
        obj = JSON.parse(xhr.responseText);
        counter += 1;

        //data variables
        let name = obj.name;
        id = obj.id;
        let sprite = obj.sprites.front_default;
        let spriteShiny = obj.sprites.front_shiny;
        typeList = obj.types;
        let height = obj.height;
        let weight = obj.weight;
        let abilities = obj.abilities;
        let feet = Math.round((height / 3.048) * 100) / 100;
        let pounds = Math.round((weight / 4.536) * 100) / 100;


        let bigString = `<div id="name"><h2>#${id} ${capitalizeFirstLetter(name)} </h2>`;
        bigString += `<img src="${sprite}"></img>`;
        bigString += `<img src="${spriteShiny}"></img></div>`;
        bigString += `<div id="type"><h2>Type:</h2>`;
        for (let i = 0; i < typeList.length; i++) {
            bigString += `<img src="images/types/${typeList[i].type.name}.gif"}"></img> `;
        }
        bigString += `</div>`;
        bigString += `<div id="size"><h2>Height:</h2><p>${feet} feet</p> <p>${height / 10} meters</p>`;
        bigString += `<h2>Weight: </h2><p>${pounds} pounds</p><p>${weight / 10} kilograms</p></div>`;
        bigString += `<div id="ability"><h2>Abilities</h2>`;
        for (let i = 0; i < abilities.length; i++) {
            if (abilities[i].is_hidden == true) {
                bigString += `<p>${capitalizeFirstLetter(abilities[i].ability.name)} : Hidden Ability</p>`;
            }
            else {
                bigString += `<p>${capitalizeFirstLetter(abilities[i].ability.name)}</p>`;
            }
        }
        bigString += `</div>`;
        document.querySelector("#content").innerHTML += bigString;
        if (counter < maxPokemon && counter < 30) {
            getDataNext();
        }
    }
    catch (e) {

        document.querySelector("#content").innerHTML += `<img src="images/sad.png"></img><p>Invalid search, Try again!</p>`;
        id = 1;
    }
}


//filters for type and prints
function dataLoadedFilter(e) {
    let xhr = e.target;

    try {
        obj = JSON.parse(xhr.responseText);
        typeList = obj.types;
        id = obj.id;
        if (counter < maxPokemon && counter < 30) {
            for (let i = 0; i < typeList.length; i++) {
                if (typeList[i].type.name == currentType) {
                    let name = obj.name;
                    id = obj.id;
                    let sprite = obj.sprites.front_default;
                    let spriteShiny = obj.sprites.front_shiny;
                    let height = obj.height;
                    let weight = obj.weight;
                    let abilities = obj.abilities;
                    let feet = Math.round((height / 3.048) * 100) / 100;
                    let pounds = Math.round((weight / 4.536) * 100) / 100;

                    let bigString = `<div id="name"><h2>#${id} ${capitalizeFirstLetter(name)} </h2>`;
                    bigString += `<img src="${sprite}"></img>`;
                    bigString += `<img src="${spriteShiny}"></img></div>`;
                    bigString += `<div id="type"><h2>Type:</h2>`;
                    for (let i = 0; i < typeList.length; i++) {
                        bigString += `<img src="images/types/${typeList[i].type.name}.gif"}"></img> `;
                    }
                    bigString += `</div>`;
                    bigString += `<div id="size"><h2>Height:</h2><p>${feet} feet</p> <p>${height / 10} meters</p>`;
                    bigString += `<h2>Weight: </h2><p>${pounds} pounds</p><p>${weight / 10} kilograms</p></div>`;
                    bigString += `<div id="ability"><h2>Abilities</h2>`;
                    for (let i = 0; i < abilities.length; i++) {
                        if (abilities[i].is_hidden == true) {
                            bigString += `<p>${capitalizeFirstLetter(abilities[i].ability.name)} : Hidden Ability</p>`;
                        }
                        else {
                            bigString += `<p>${capitalizeFirstLetter(abilities[i].ability.name)}</p>`;
                        }
                    }
                    bigString += `</div>`;
                    document.querySelector("#content").innerHTML += bigString;
                    counter += 1;
                }
            }
            if (filterCounter < maxPokemon && filterCounter < 30) {
                getDataFilterNext(id);
            }
        }
    }
    catch (e) {

        document.querySelector("#content").innerHTML += `<img src="images/sad.png"></img><p>Invalid search, Try again!</p>`;
        id = 1;
    }

}

// program to convert first letter of a string to uppercase
function capitalizeFirstLetter(str) {

    // converting first letter to uppercase
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
}

//checks if filter button is clicked
function checkRadio() {
    currentTypeList = document.querySelectorAll('input[name="typeGroup"]');
    for (let i = 0; i < currentTypeList.length; i++) {
        if (currentTypeList[i].checked)
            currentType = currentTypeList[i].value;

    }
}

//multiple functions happen whenfilter is clicked
function filterClick() {
    checkRadio();
    getDataFilterStart();
}

