date = Date.now();
console.log(date);
console.log(Unix_timestamp(date));

var config = {
  apiKey: "AIzaSyDtsTQcdT7ZtcZnbW0MeEP7StRujven73A",
  authDomain: "weatherzip-3e2ba.firebaseapp.com",
  databaseURL: "https://weatherzip-3e2ba.firebaseio.com",
  projectId: "weatherzip-3e2ba",
  storageBucket: "weatherzip-3e2ba.appspot.com",
  messagingSenderId: "428960672799"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).on('click', "#searchButton", function () {
  event.preventDefault();
  var zip = $('#searchInput').val().trim();
//---------------------

// Code for handling the push
database.ref().push({
  zip: zip,
  dateAdded: firebase.database.ServerValue.TIMESTAMP
 
});

//-----------------

  console.log(zip);
  var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?&address=' + zip + '&key=AIzaSyAvM-cW9B1wJFyMwnNs_pThSi_n4vBQrQo';
  var weatherURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&APPID=c1430d8dc77fc1ff6d9ecd8f0b819cd6&units=imperial";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    //get latitude and longitude from the geocoding api after converting the zip.
    var lat = response.results[0].geometry.location.lat;
    var lng = response.results[0].geometry.location.lng;
    setMap(lat, lng);
    //----------------------------
    //for getting the weather inside the return from the google maps
    //----------------------------
    var settings = {
      'cache': false,
      'dataType': "jsonp",
      "async": true,
      "crossDomain": true,
      "url": weatherURL,
      "method": "GET",
      "headers": {
        "accept": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
    //weather response
    $.ajax(settings).done(function (response) {
      console.log(response);
      var weather = response.weather[0];
      
      //variables created to hold associated pieces of weather information
      var weatherPic = weather.icon
      var icon = '<img src = "http://openweathermap.org/img/w/' + weatherPic + '.png"></img>';
      var name = response.name + "," + response.sys.country;
      var currentTemp = "The temperature is: " + response.main.temp + " F";
      var high = "High: " + response.main.temp_max  + " F";
      var low = "Low: " + response.main.temp_min + " F";
      var windSpeed = "Wind Speed: " + response.wind.speed + " MPH";
      var sun = "sunrise: " + Unix_timestamp(response.sys.sunrise) + "<br>" + "sunset: " + Unix_timestamp(response.sys.sunset) + "<br>";
      
      $("#weather").html(name + '<br>' + icon + '<br>' + currentTemp + '<br>' + high + '<br>' + low + '<br>' + windSpeed  + '<br>' + sun);
      
    });

  });
});
// takes the lat and lng pulled from the geocode based on zipcode and calls out to google maps with that info to set up the map.
function setMap(lat, lng) {
  var loc = { lat: lat, lng: lng }
  map = new google.maps.Map(document.getElementById('map'), {
    center: loc,
    zoom: 8
  });
  var marker = new google.maps.Marker({ position: loc, map: map });
  console.log(map);
}
//because the callback is to initMap, just set that up as generic holder map, and have it call setMap to do the work with the lat and lng variables.
function initMap() {
  setMap(43.2081, -71.5376);
}

database.ref().on("child_added", function(snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();
  console.log(sv);
  console.log(sv.dateAdded);
      console.log(sv.zip);
  $("#firebase").text('Last zip added from firebase: ' + sv.zip);
  

});
//function to convert the sunrise and sun set from unix time to military
function Unix_timestamp(t) {
  var dt = new Date(t * 1000);
  var hr = dt.getHours();
  var m = "0" + dt.getMinutes();
  var s = "0" + dt.getSeconds();
  return hr + ':' + m.substr(-2) + ':' + s.substr(-2);
}

