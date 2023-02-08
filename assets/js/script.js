// var chosenPlace;
// adding date and time
var today = moment().format("dddd • DD/MM/YYYY • h:mm a");
$("#myDate").text(today);
var theYear = moment().format('YYYY');
$('.footer-content').append(theYear);
// Saved History Buttons
var buttonContainer = $('<div class="d-flex flex-wrap justify-content-around align-items-stretch mt-4">');
$('#todays-date').after(buttonContainer);

var savedLocations = JSON.parse(localStorage.getItem("Saved-Locations")) || [];

// adding modal variable
var modal = $("#myModal");

var clearButton = $("#clear-button");
if (savedLocations.length == 0) {
    clearButton.hide();
}

function showDetails(chosenPlace) {
    // clearing section with chosen place weather
    $("#weather").empty();
    $("#conditions").empty();

    var placeName = $("<p id='placeName'>").text(chosenPlace);
    $("#weather").append(placeName);
    // openweather API url 
    // var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + chosenPlace + "&appid=e3fca67d9cc333a831026c5f07c8ba92";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + '&lon=' + lon + "&appid=e3fca67d9cc333a831026c5f07c8ba92";

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
        var weatherStatus = response.weather[0].main;
        console.log(weatherStatus)
        // creating image and paragraph tags for weather conditions
        var icon = $("<img>").attr("src", iconUrl);
        var iconTag = $("<p id='tags'>").append("Status", icon);
        var tempTag = $("<p id='tags'>").text("Temp: " + tempC + " °C");
        var windTag = $("<p id='tags'>").text("Wind: " + wind + " KPH");
        var humidityTag = $("<p id='tags'>").text("Humidity: " + humidity + "%");

        // appending to the website
        $("#conditions").append(iconTag, tempTag, windTag, humidityTag);

        addGif(weatherStatus);

        // gif creator
        function addGif(weatherStatus) {
            // use the weatherQuery from openweather map for giphy endpoint
            var searchQuery = weatherStatus;
            var getGifURL = "https://api.giphy.com/v1/gifs/search?api_key=BPd0QG7nbi7fxVY0KXbCN3Lg4OEQ0YNZ&q=weather+" + searchQuery + "&limit=1&offset=0&rating=g&lang=en";

            $.ajax({
                url: getGifURL,
                method: 'GET'
            }).then(function (result) {
                var gifUrl = result.data[0].images.original.url;
                var gifImage = $('<img class="gif-image">').attr('src', gifUrl);
                $(".modal-body").prepend(gifImage);
                // $(".modal-body").text(message);
            })
        }
        // if statements to show messages in modal box
        if (weatherStatus === "Clouds") {
            $(".modal-body").text("It's a cloudy day today, you might want to bring a jumper or a light jacket.");
            // addGif(weatherStatus, "It's a cloudy day today, you might want to bring a jumper or a light jacket.");
            modal.show();
        } else if (weatherStatus === "Fog") {
            $(".modal-body").text("It's a foggy day today, it's best to stay indoors.");
            modal.show();
        } else if (weatherStatus === "Clear") {
            $(".modal-body").text("The sky is clear today, it's the perfect weather to go to the park.");
            modal.show();
        } else if (weatherStatus === "Rain") {
            $(".modal-body").text("Uh oh, it looks like rain, grab a raincoat and wellies, or stay indoors with a cuppa.");
            modal.show();
        } else if (weatherStatus === "Thunderstorm") {
            $(".modal-body").text("There's a thunderstorm coming, stay home and stay safe.");
            modal.show();
        } else if (weatherStatus === "Drizzle") {
            $(".modal-body").text("It's drizzling today, grab a light jacket and an umbrella.");
            modal.show();
        } else if (weatherStatus === "Snow") {
            $(".modal-body").text("It's snowing, wrap up warm and go make some snow angels!");
            modal.show();
        } else if (weatherStatus === "") {
            $(".modal-body").text("Uh oh, this field is blank, please enter your chosen location");
            modal.show();
        } else {
            $(".modal-body").text("Uh oh, we couldn't find weather details for your chosen location, sorry about that!");
            modal.show();
        }

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
        icons: null
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
    // if chosen place is not valid - return the data

    $.ajax({
        url: mapURL,
        method: 'GET'
    }).then(function (result) {
        // reassign the new lat and lon values to pass through the new map and weather query
        lat = result.results[0].geometry.location.lat;
        lon = result.results[0].geometry.location.lng;

        showDetails(chosenPlace, lat, lon);

        console.log('lat: ' + lat + 'lon: ' + lon);
        // change the map to new location
        theMap = new google.maps.Map(mapElement[0], {
            zoom: 13,
            center: { lat: lat, lng: lon },
            // need to make another API call - so key is needed or error returned 
            key: mapKey

        });

        // using the location, pass the type to the callback function
        var request = {
            // the location passes both lat and lon values
            location: result.results[0].geometry.location,
            // in meters
            radius: '4000',
            type: 'park',
        };

        // make a call to the placesService, passing through the our map
        service = new google.maps.places.PlacesService(theMap);
        // performs a nearby search from users query - https://developers.google.com/maps/documentation/javascript/places#place_search_requests -
        service.nearbySearch(request, callback);

    })

    var firstPark;

    // call the places service for park results
    function callback(results, status) {
        // This checks the status of the places API rquest
        if (status == google.maps.places.PlacesServiceStatus.OK) {

            // return the results of each park that includes a tourist attraction value from the types object
            for (var i = 0; i < results.length; i++) {
                if (results[i].types.includes('tourist_attraction')) {
                    // call createMarker function and locations and results to the function
                    createMarker(results[i].geometry.location, results[i]);

                    // name of the first park returned, which we take out and use outside the loop - declare variable outside or not defined
                    if (!firstPark) {
                        var firstPark = results[i].name;
                    }
                }
            }
            if (typeof firstPark === 'undefined') {
                $('#park-container').remove();
                var thePark = $('<div id="park-container">');
                thePark.text('No parks found');
                $('#conditions').after(thePark);
            } else {
                $('#park-container').remove();
                var thePark = $('<div id="park-container">');
                thePark.text('The closest park to this location is ' + firstPark);
                $('#conditions').after(thePark);
            }
        }
    }

    function createMarker(position, results) {
        // custom icon
        var iconImage = './images/park-time-logo-scaled.png';
        // creates a new marker object for the map
        var marker = new google.maps.Marker({
            // position of the marker comes from the park lat and lon values in the callback
            position: position,
            map: theMap,
            icon: iconImage,
        });

        // call the constructor
        var infoWindow = new google.maps.InfoWindow({
            content: results.name
        });

        // use addListener method for the marker
        marker.addListener('click', function () {
            infoWindow.open(theMap, marker);
        })

    }

}

$('#location-search').on('click', function (event) {
    event.preventDefault();
    // pass the user Location on event listener
    var chosenPlace = $("#user-location").val().trim();
    chosenPlace = chosenPlace.charAt(0).toUpperCase() + chosenPlace.slice(1);

    if (chosenPlace === "") {
        $('.error-text').empty();
        var error = $('<p class="error-text text-danger m-0">');
        error.text('Please enter a valid location');
        $('#user-location').after(error);
        return;
    } else if (savedLocations.includes(chosenPlace)) {
        // error for already saved location
        $('.error-text').empty();
        var error = $('<p class="error-text text-danger m-0">');
        error.text('You have already entered this location');
        $('#user-location').after(error);
        return;
    } else {
        // push the input to the local storage array
        savedLocations.push(chosenPlace);
        // run history button function
        addToButtons(chosenPlace);
        clearButton.show();
    }

    // Need to add condition - if both results are valid then run - if not, return to empty input and error message - 'please enter a valid location'
    // showDetails(chosenPlace);
    // upon click, run the function - pass the variable as an argument
    findLocation(chosenPlace);



    // clear input field
    $("#user-location").val("");
    $('.error-text').empty();

});


function addToButtons(chosenPlace) {

    // limit buttons to 3
    while (savedLocations.length > 3) {
        // remove the oldest button
        var removeLocation = savedLocations.shift();
        // remove from the storage array
        localStorage.removeItem(removeLocation);
    }

    localStorage.setItem("Saved-Locations", JSON.stringify(savedLocations));

    buttonContainer.empty();

    for (var i = 0; i < savedLocations.length; i++) {

        var theLocation = savedLocations[i];
        var newBtn = $('<button class="border-0 rounded py-2 px-3 m-1 newBtn">' + theLocation + '</button>');
        $(newBtn).on('click', function (event) {
            event.preventDefault();
            chosenPlace = $(this).text();
            showDetails(chosenPlace);
            findLocation(chosenPlace);
        });

        buttonContainer.append(newBtn);
    }

}

// make sure the buttons remain on the page
addToButtons(savedLocations);
$("#user-location").val("");

// local storage overrides each time, data should persist
$('#showModal').on('click', function (event) {
    modal.hide()
})

//clicking this button clears search history and clears local storage
$("#clear-button").on("click", function() {
    window.localStorage.clear();
    $(".city-history").hide();
     });