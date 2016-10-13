// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

function initialize() {
  var portland = { lat:40.879, lng: -100.987 };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: portland
  });

  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function(event) {
    console.log(event.latLng);

    // Adding bikes object
    $.get('https://bikeindex.org:443/api/v2/bikes_search/stolen?page=1&proximity='+event.latLng.lat() +'%2C'+ event.latLng.lng() +'&proximity_square=200').then(function(response){
      var address;
      var location;
      var image;
      var description;
      console.log(response);
      var geocoder = new google.maps.Geocoder();
      for(var i=0; i<25; i++) {
        address=response.bikes[i].stolen_location;
        image=response.bikes[i].large_img;
        description=response.bikes[i].frame_model;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            location = {
              lat:results[0].geometry.location.lat(),
              lng:results[0].geometry.location.lng()
            };
            addMarker(location, map, address, image, description);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
       });
      }
    });
  });
}

// Adds a marker to the map.
function addMarker(location, map, address, image, description) {
  //Add the marker at the clicked location, and add the next-available label
  //from the array of alphabetical characters.
  var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h2>'+ description +'</h2>'+
    '<div class="bodyContent">'+
    '<p><img src="'+ image +'"></p>'+
    '<p>'+ address +'</p>'
    '</div>'+
    '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  var marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map,
    title: address
  });
  
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
