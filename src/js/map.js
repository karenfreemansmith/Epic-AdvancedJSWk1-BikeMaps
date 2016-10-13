// triggered by Refresh button
$(document).ready(function() {
  $("#formbtn").click(function(){
    event.preventDefault();
    initialize();
  });
});

function initialize() {
  var portland = { lat: parseFloat($("#lat").val()), lng: parseFloat($("#lng").val()) };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: parseInt($("#zoom").val()),
    center: portland
  });

  // Add a marker at the center of the map.
  addMarker(portland, map);
}

// Adds a marker to the map.
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: 'X',
    map: map
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
