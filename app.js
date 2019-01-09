var lat;
var lng;
// var lats=[];
// var lngs=[];
var marker;
// if(marker==undefined)
//   alert('Error');


var mymap = L.map('map').setView([31.3962, 75.5354], 13);
$('loginCover').hide();
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiZ3J2c29vZCIsImEiOiJjam55eng3NngwaTNkM3Bxb2dmM2I4MHo3In0._axjlHT7BRP9ZTjwHl4ncA'
}).addTo(mymap);

//var marker = L.marker([31.3962, 75.5354]).addTo(mymap);
var popup = L.popup();
function onMyClick(e){
  popup
       .setLatLng(e.latlng)
       .setContent("You clicked the map at " + e.latlng.toString())
       .openOn(mymap);
   lat=e.latlng.lat;
   lng=e.latlng.lng;
   // lats.push(lat);
   // lngs.push(lng);
   if(marker!=undefined){
     //var maker1=new L.marker([lats[0],lngs[0]]);
     mymap.removeLayer(marker);
   }
  // //marker.push({"lat":lat , "lng":lng});
	 marker = L.marker([lat, lng]).addTo(mymap);
   marker.bindPopup("Report Location at " + e.latlng.toString()).openPopup();
   //alert("You clicked the map at " + lat + lng);
}

mymap.on('click',onMyClick);

var getId = function(id){
  return document.getElementById(id);
};
function addExistingMarkers(readLat , readLng,issue){
  var circle = L.circle([readLat, readLng], {
    color: 'black',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius:100
}).addTo(mymap);
  circle.bindPopup('Issue :'+ issue);
    //var existMarker = L.marker([readLat, readLng]).addTo(mymap);
}

//-------------- Read DATABASE -----------------z
//firebase.initializeApp(config);
var readReportRef = firebase.database().ref('reports');
readReportRef.on('value', readReports, errorReadReports);

function readReports(data){
  var reports = data.val();
  var keys = Object.keys(reports);
  // console.log(keys);
  for (var i = 0; i < keys.length; i++) {
    var index = keys[i];
    var readLat = reports[index].latitude;
    var readLng = reports[index].longitude;
    var markerIssue = reports[index].issue;
    addExistingMarkers(readLat,readLng,markerIssue);
  }
}
function errorReadReports(error){
  console.log('Error!!');
  console.log(error);
}


// function addExistingMarkers(readLat , readLng){
//   var circle = L.circle([readLat, readLng], {
//     color: 'cyan',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(mymap);
// }
//
//

// ******************Report Button Action Function*********************8
function nextPage()
{
  if(marker==undefined)
  {
    alert("Please! Select a Location To Report Issue. ");
    return;
  }
	var value1=lat;
  var value2=lng;
  var queryString = "?para1=" + value1 + "&para2=" + value2;
  lati  = lat;
  longi = lng;
  window.location.href = "login.html" + queryString;
}



// *
// *
// *  Firebase
// *
function getUiConfig() {
  return {
    'callbacks': {
      // Called when the user has been successf ully signed in.
      'signInSuccess': function(user, credential, redirectUrl) {
        handleSignedInUser(user);
        // Do not redirect.
        return false;
      }
    },
    // Opens IDP Providers sign-in flow in a popup.
    'signInFlow': 'popup',
    'signInOptions': [
      // The Provider you need for your app. We need the Phone Auth
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: 'image', // another option is 'audio'
          size: 'invisible', // other options are 'normal' or 'compact'
          badge: 'bottomleft' // 'bottomright' or 'inline' applies to invisible.
        }
      }
    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com'
  };
}

// Initialize the FirebaseUI Widget using Firebase.
var firebaseUi = new firebaseui.auth.AuthUI(firebase.auth());

/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function(user) {
  $('#loginCover').hide();
  $('#reportForm').hide();
  $('#loading').show();
  // getId('loading').style.display = "block";
  // getId('loginCover').style.display = "none";
};


/**
 * Displays the UI for a signed out user.
 */
var handleSignedOutUser = function() {
  $('#loading').hide();
  $('#loginCover').show();
  $('#reportForm').hide();
  firebaseUi.start('#firebaseui-container', getUiConfig());
};

// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function(user) {
  user ? handleSignedInUser(user) : handleSignedOutUser();
});

$('#signOutBtn').click(function(){
  firebase.auth().signOut();
});

// $('#reportBtn').click(function(){
//   if(marker==undefined)
//   {
//     alert("Please! Select a Loaction To Report Issue ! ");
//     return;
//   }
// 	$('#bodyContainer').hide();
// 	 $('#loginCover').hide();
// 	$('#reportForm').show();
//
// });


$('#complaint').click(function(){
  $('#loginOpt').hide();
  $('#loginCover').show();
});
$('#adminLogin').click(function(){
  window.location.href = "admin.html"
});
window.onload = function() {
    $('#loginCover').hide();
}
