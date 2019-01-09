
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var queries = queryString.split("&");

var lat = queries[0].split('=')[1];
// alert(lat);
var lng = queries[1].split('=')[1];

var latlng = new google.maps.LatLng(lat,lng);
var geocoder = new google.maps.Geocoder();
var loco = "";
geocoder.geocode({ 'latLng': latlng }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          // alert("getloco: " + results[1].formatted_address);
              loco = results[1].formatted_address;
        }else {
          // alert("1 2 3 "+ results);
        }
    }else {
      // alert("Yo yO Error aa gea\n");
    }
});

// alert("Loco: "+ loco);
