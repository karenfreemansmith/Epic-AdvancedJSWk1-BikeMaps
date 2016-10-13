// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

function initialize() {
  var portland = { lat:45.879, lng: -122.987 };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: portland
  });

  // Add a marker at the center of the map.
  addMarker(portland, map);

  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function(event) {
    console.log(event.latLng);
    addMarker(event.latLng, map);
    // Adding bikes object
    $.get('https://bikeindex.org:443/api/v2/bikes_search/stolen?page=1&proximity='+event.latLng.lat() +'%2C'+ event.latLng.lng() +'&proximity_square=200', function(response){
      var address;
      var location;
      var geocoder = new google.maps.Geocoder();
      for(var i=0; i<25; i++) {
        address=response.bikes[i].stolen_location;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            location = {
              lat:results[0].geometry.location.lat(),
              lng:results[0].geometry.location.lng()
            };
            addMarker(location, map);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
       });
      }
    });
  });
}

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
