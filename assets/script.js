var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=e3fca67d9cc333a831026c5f07c8ba92";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {

    console.log(queryURL);
    console.log(response);

});

































// create on click event for search button
// save input from search field to local storage

// create function to call forecast for searched place from openweather
// display forecast to the page
