var chosenPlace;
// adding date and time
var today = moment().format("dddd • DD/MM/YYYY • h:mm a");
$("#myDate").text(today);

// local storage set outside the function to prevent it running the same for each button
var savedPlaces = JSON.parse(localStorage.getItem("chosenPlace")) || [];

// adding modal variable
var modal = $("#myModalError")

function showDetails(chosenPlace) {
    // clearing section with chosen place weather
    $("#weather").empty();
    $("#conditions").empty();

    var placeName = $("<p id='placeName'>").text(chosenPlace);
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
        var weatherStatus = response.weather[0].main;
        console.log(weatherStatus)
        // creating image and paragraph tags for weather conditions
        var icon = $("<img>").attr("src", iconUrl);
        var iconTag = $("<p id='tags'>").append("Set-up", icon);
        var tempTag = $("<p id='tags'>").text("Temp: " + tempC + " °C");
        var windTag = $("<p id='tags'>").text("Wind: " + wind + " KPH");
        var humidityTag = $("<p id='tags'>").text("Humidity: " + humidity + "%");

        // appending to the website
        $("#conditions").append(iconTag, tempTag, windTag, humidityTag);

        if (!chosenPlace) {

            // alert("Alert");
            $('#myModalError').modal('hide');
            return;

        } else {
            // if statements to show messages in modal box
            if (weatherStatus === "Clouds") {
                $(".modal-body").text("It's a cloudy day today, you might want to bring a jumper or a light jacket.");
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

        console.log('lat: ' + lat + 'lon: ' + lon);
        // change the map to new location
        theMap = new google.maps.Map(mapElement[0], {
            zoom: 13,
            center: { lat: lat, lng: lon },
            // need to make another API call - so key is needed or error returned 
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

    var firstPark;

    // lets call the places service for park results
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
                        firstPark = results[i].name;
                    } 

                }
            }
            $('#park-container').empty();
            // Print First park result name
            var thePark = $('<div id="park-container" class="text-center pt-5 pb-2">');
            thePark.text('The closest park to this location is ' + firstPark);
            $('#conditions').after(thePark);
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

function showPlace() {
    $('#location-search').on('click', function (event) {
        event.preventDefault();
        // pass the user Location on event listener
        var chosenPlace = $("#user-location").val().trim();
        chosenPlace = chosenPlace.charAt(0).toUpperCase() + chosenPlace.slice(1);

        // to show modal when no location provided
        if (chosenPlace === "") {
            // alert("Alert");
            $('#myModalError').modal('hide');
            return;
        } else {
            $('#myModalError').modal('show');
        }
        // end of modal


        // Need to add condition - if both results are valid then run - if not, return to empty input and error message - 'please enter a valid location'
        showDetails(chosenPlace);
        // upon click, run the function - pass the variable as an argument
        findLocation(chosenPlace);


        // clear input field
        $("#user-location").val("");

        localStorage.setItem("chosenPlace", JSON.stringify(chosenPlace));



    });
}

showPlace();

// local storage overrides each time, data should persist
$('#showModal').on('click', function (event) {
    modal.hide()
})