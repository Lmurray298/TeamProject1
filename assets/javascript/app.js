$(document).on('click', "#searchButton", function () {
    event.preventDefault();
    var zip = $('#searchInput').val().trim();
    console.log(zip);
    var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?&address=' + zip + '&key=AIzaSyAvM-cW9B1wJFyMwnNs_pThSi_n4vBQrQo';
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      var lat = response.results[0].geometry.location.lat;
      var lng = response.results[0].geometry.location.lng;
      setMap(lat,lng);
    });
  });

  function setMap(lat,lng){
    var loc = { lat: lat, lng: lng }
    map = new google.maps.Map(document.getElementById('map'), {
      center: loc,
      zoom: 8
    });
    var marker = new google.maps.Marker({ position: loc, map: map });
    console.log(map);
  }

  function initMap() {
    setMap(43.2081,-71.5376);
  }