var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=e3fca67d9cc333a831026c5f07c8ba92";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {

    console.log(queryURL);
    console.log(response);

});


// latitute and longitude variable declared outside, so they can change on page reload or when the findLocation is called

var lat = 51.507351;
var lon = -0.127758;

// map function
function showMap() {
    // identify where the map will be on doc
    var mapElement = $('#map');
    //create an instance of the map, passing the variable as a parameter, and then customisation objects
    var theMap = new google.maps.Map(mapElement[0], {
        zoom: 15,
        center: {lat: lat, lng: lon},
    })
}

// call Google API for location search and map display
// pass the argument in the function
function findLocation(userLocation) {
    var mapElement = $('#map');
    //geocode API url with address parameter
    var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var mapURL = baseURL + userLocation + '&key=' + mapKey
    console.log(userLocation);

    $.ajax({
        url: mapURL,
        method: 'GET'
    }).then(function(result){
        // reassign the new lat and lon values to pass through the new map and weather query
        lat = result.results[0].geometry.location.lat;
        lon = result.results[0].geometry.location.lon;

        console.log('lat: ' + lat + 'lon: ' + lon);
        // change the map to new location
        // theMap = new google.maps.Map(mapElement[0], {
        //     zoom: 15,
        //     center: {lat: lat, lng: lon},
        // })
        console.log(mapURL);
    })
}

$('#location-search').on('click', function (event){
    event.preventDefault();
    // pass the user Location on event listener
    var userLocation = $('#user-location').val();

    // upon click, run the function - pass the variable as an argument
    findLocation(userLocation);
})































// create on click event for search button
// save input from search field to local storage

// create function to call forecast for searched place from openweather
// display forecast to the page
