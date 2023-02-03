var chosenPlace;
// adding date and time
var today = moment().format("dddd • DD/MM/YYYY • h:mm a");
$("#myDate").text(today);

//adding modal variable
var modal = $("#myModal")

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

function showDetails(chosenPlace) {
    // clearing section with chosen place weather
    $("#weather").empty();
    $("#conditions").empty();
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
            } else {
                $(".modal-body").text("Uh oh, we couldn't find weather details for your chosen location, sorry about that!");
                modal.show();
            }
    })
}

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
            zoom: 15,
            center: { lat: lat, lng: lon },

        })

    })
}

showPlace();

// local storage overrides each time, data should persist
$('#showModal').on('click', function (event) {
    modal.hide()
})