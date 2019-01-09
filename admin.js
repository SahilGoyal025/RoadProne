// $('#loginCover').hide();
// *
// **  Firebase
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
      firebase.auth.EmailAuthProvider.PROVIDER_ID
      // The Provider you need for your app. We need the Phone Auth
      // {
      //   provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      //   recaptchaParameters: {
      //     type: 'image', // another option is 'audio'
      //     size: 'invisible', // other options are 'normal' or 'compact'
      //     badge: 'bottomleft' // 'bottomright' or 'inline' applies to invisible.
      //   }
      // }
    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com'
  };
}

// Initialize the FirebaseUI Widget using Firebase.
var firebaseUi = new firebaseui.auth.AuthUI(firebase.auth());
var counter = 0;
/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function(user) {
  $('#loginCover').hide();
  $('#reportForm').hide();
  $('#loading').show();
  var readReportRef = firebase.database().ref('reports');
  readReportRef.on('value', readReports, errorReadReports);

  function readReports(data){
    var reports = data.val();
    var keys = Object.keys(reports);
    // console.log(keys);
    for (var i = 0; i < keys.length; i++) {
      var index = keys[i];
      // alert(index);
      var readLat = reports[index].latitude;
      var readLng = reports[index].longitude;
      var markerIssue = reports[index].issue;
      var description = reports[index].description;
      var name = reports[index].name;
      var nearest = reports[index].nearest;
      var user = firebase.auth().currentUser;
      var currUr = user.displayName;
      if(nearest == currUr){
        // var e = document.createElement('#table_body');
        var htmldata = "<tr><td>" +readLat + "</td><td>" + readLng + "</td><td>" +markerIssue + "</td><td>" + description +'</td><td><a class = ".delete" href="#">Remove</button></td></tr>';
        $('#tableId tr:last').after(htmldata);
        // e.innerHTML = htmldata;
        //
        // while(e.firstChild) {
        //     element.appendChild(e.firstChild);
        // }
      }
    }
  }

  function errorReadReports(error){
    console.log('Error!!');
    console.log(error);
  }

  // getId('loading').style.display = "block";
  // getId('loginCover').style.display = "none";
};
$('table').on('click','tr a.remove',function(e){
  e.preventDefault();
  $(this).closest('tr').remove();
});

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


$('table').on('click','tr a',function(e){
   e.preventDefault();
   $(this).parents('tr').remove();
});

// function delete_row() {
//   var key = document.getElementById(row).row.childData;
//
//   firebase.database().ref().child('users/' + row + '/').remove();
//   alert('row was removed');
//   reload_page();
// // }
//
// function reload_page() {
//   window.location.reload();
// }
