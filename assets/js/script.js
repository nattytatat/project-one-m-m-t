var chosenPlace;
// adding date and time
var today = moment().format("dddd • DD/MM/YYYY • h:mm a");
$("#myDate").text(today);

function showDetails(chosenPlace) {
    // clearing section with chosen place weather
    $("#weather").empty();
    $("#conditions").empty();

    // to show modal when no location provided
    if (chosenPlace === "") {
        // alert("Alert");
        $('#myModal').modal('hide');
        return;
    } else {
        $('#myModal').modal('show');
    }
    // end of modal

    localStorage.setItem("chosenPlace", chosenPlace);
    var place = localStorage.getItem("chosenPlace");
    var placeName = $("<p id='placeName'>").text(place);
    $("#weather").append(placeName);
    // openweather API url 
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + chosenPlace + "&appid=e3fca67d9cc333a831026c5f07c8ba92";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);

        var tempK = response.main.temp;
        var tempC = parseFloat(tempK - 273.15).toFixed(1);
        var wind = response.wind.speed;
        var humidity = response.main.humidity;
        var iconPath = response.weather[0].icon;
        var iconUrl = "https://openweathermap.org/img/wn/" + iconPath + ".png";
        // creating image and paragraph tags for weather conditions
        var icon = $("<img>").attr("src", iconUrl);
        var iconTag = $("<p id='tags'>").append("Set-up", icon);
        var tempTag = $("<p id='tags'>").text("Temp: " + tempC + " °C");
        var windTag = $("<p id='tags'>").text("Wind: " + wind + " KPH");
        var humidityTag = $("<p id='tags'>").text("Humidity: " + humidity + "%");

        // appending to the website
        $("#conditions").append(iconTag, tempTag, windTag, humidityTag);
    })
}


// latitute and longitude variable declared outside, so they can change on page reload or when the findLocation is called
var lat = 51.507351;
var lon = -0.127758;
// to pass the google places service later - or is undefined
var service;

// map function
function showMap() {
    // identify where the map will be on doc
    var mapElement = $('#map');
    //create an instance of the map, passing the variable as a parameter, and then customisation objects
    var theMap = new google.maps.Map(mapElement[0], {
        zoom: 11,
        center: { lat: lat, lng: lon },
    })
}

// call Google API for location search and map display
// pass the argument in the function
function findLocation(chosenPlace) {
    var mapElement = $('#map');
    // geocode API url with address parameter
    var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var mapURL = baseURL + chosenPlace + '&key=' + mapKey
    console.log(chosenPlace);

    $.ajax({
        url: mapURL,
        method: 'GET'
    }).then(function (result) {
        // reassign the new lat and lon values to pass through the new map and weather query
        lat = result.results[0].geometry.location.lat;
        lon = result.results[0].geometry.location.lng;

        console.log('lat: ' + lat + 'lon: ' + lon);
        // change the map to new location
        theMap = new google.maps.Map(mapElement[0], {
            zoom: 13,
            center: { lat: lat, lng: lon },
            key: mapKey

        });

        // enter places request for the newly created map
        var request = {
            //this passes both the lat and lon values - could be used for the above center object
            location: result.results[0].geometry.location,
            // in meters
            radius: '4000',
            type: 'park',
        };

        // make a call to the placesService, passing through the displayed map
        service = new google.maps.places.PlacesService(theMap);
        // performs a nearby search from users query - https://developers.google.com/maps/documentation/javascript/places#place_search_requests -
        service.nearbySearch(request, callback);

    })

    // lets call the places service for park results
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                if (results[i].types.includes('tourist_attraction')) {
                    createMarker(results[i].geometry.location);
                }
            }
        }
    }

    function createMarker(position) {
        // custom icon
        var iconImage = './images/park-time-logo-scaled.png';

        new google.maps.Marker({
            position: position,
            map: theMap,
            icon: iconImage,
        });

    }
}

function showPlace() {
    $('#location-search').on('click', function (event) {
        event.preventDefault();
        // pass the user Location on event listener
        var chosenPlace = $("#user-location").val().trim();
        chosenPlace = chosenPlace.charAt(0).toUpperCase() + chosenPlace.slice(1);
        // clear input field
        $("#user-location").val("");
        showDetails(chosenPlace);
        // upon click, run the function - pass the variable as an argument
        findLocation(chosenPlace);
    });
}

showPlace();