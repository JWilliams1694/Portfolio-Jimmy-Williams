// 1
window.onload = (e) => { document.querySelector("#search").onclick = searchButtonClicked };

// 2
let displayTerm = "";

// 3
function searchButtonClicked() {
    console.log("searchButtonClicked() called");
    //1
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    //2 - public api key
    let GIPHY_KEY = "T1C26u2J8GzfjOlUzIm1n7xDyjjma9Hq";

    //3 - build up url string
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    //4 - parse user term
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    //5 - get rid of leading and trailing spaces
    term = term.trim();

    //6 - encode spaces
    term = encodeURIComponent(term);

    //7 - if no term then cancel
    if (term.length < 1) return;

    //8 - append search term to url
    url += "&q=" + term;

    //9 - grab the user chosen search
    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    //10 - update ui
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>"

    //11 - see what the url looks like
    console.log(url);

    // 12 Request data!
    getData(url);
}

function getData(url) {
    //1 - create new XHR object
    let xhr = new XMLHttpRequest();

    //2 - set the onload handler
    xhr.onload = dataLoaded;

    //3 - set the oneroor handler
    xhr.onerror = dataError;

    //4 - open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    //5 - event.target is the xhr object
    let xhr = e.target;

    //6 - xhr response text is the JSON file we just downloaded
    console.log(xhr.responseText);

    //7 - turn text into parsable javascript object
    let obj = JSON.parse(xhr.responseText);

    //8 - if no results, print error
    if (!obj.data || obj.data.length == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return;
    }

    //9 - start building an html string we display to user
    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "";

    //10 - loop through the array of results
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        //11 - get url to the gif
        let smallURL = result.images.fixed_width_downsampled.url;
        if (!smallURL) {
            smallURL = "../images/no-image-found.png";
        }

        //12 - get the url to giphy page
        let url = result.url;

        //13 build div to gold result
        var line = "<div class = 'result'>";
        line += "<img src='";
        line += smallURL;
        line += "'title= '"; i
        line += "' />";

        line += "<span><a target='_blank' href='" + url + "'>View on Giphy</a>";
        line += `<p>Rating: ${result.rating.toUpperCase()}</p></span>`;
        line += "</div>";


        //15 - add div to bigstring and loop
        bigString += line;

        //16 - all done building html show user
        document.querySelector("#content").innerHTML = bigString;

        //17 - update status
        document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
    }

}

function dataError(e) {
    console.log("An error occured");
}