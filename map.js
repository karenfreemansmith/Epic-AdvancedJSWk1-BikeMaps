// triggered by Refresh button
$(document).ready(function() {
  $("#formbtn").click(function(){
    event.preventDefault();
    initialize(parseInt($("#zoom").val()),parseFloat($("#lat").val()),parseFloat($("#lng").val()));
  });
});

// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

function initialize(z,vlat,vlng) {
  var portland = { lat: vlat, lng: vlng };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: z,
    center: portland
  });

  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng, map);
  });

  // Add a marker at the center of the map.
  addMarker(portland, map);
}
// Adding bikes object
$.get('https://bikeindex.org:443/api/v2/bikes_search/stolen?page=1&proximity=45.521728%2C-122.67326&proximity_square=200', function(response){
    //addMarker(bikes[0].stolen_location, map);
    // var address;
    // var geocoder = new google.maps.Geocoder();
    // for(var i=0; i<25; i++) {
    //   address=response.bikes[i].stolen_location;
    //   geocoder.geocode({'address': address}, function(results, status) {
    //     if (status === 'OK') {
    //       addMarker(results[0].geometry.location, map);
    //     } else {
    //       alert('Geocode was not successful for the following reason: ' + status);
    //     }
    //  });
    // }
});

// Adds a marker to the map.
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
