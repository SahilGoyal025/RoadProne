// *
// *  31.3877   75.5347
// *




document.getElementById('latlng').innerHTML="Latitude : " + parseFloat(lat).toFixed(4) + "      Longitude : "+ parseFloat(lng).toFixed(4);
// Save message to firebase
var messagesRef = firebase.database().ref('reports');

function saveMessage(name,email,issue,desc,severity){
  var newMessageRef = messagesRef.push();
  // alert('Submitting!')
  newMessageRef.set({
  name: name,
  email: email,
  latitude: lat,
  longitude: lng,
  issue : issue,
  severity: severity,
  description: desc,
  nearest: nearest
  });
  // alert("Response Recorded!");
}
// *
// **  Auth Add Data
// *
// var authth = firebase.database().ref('authorities');
//
//   var neauuthh = authth.push();
//   // alert('Submitting!')
//   neauuthh.set({
//   name: "Police Station Division No. 8-Focal Point",
//   phone: "8872811501"
//   });

var nearest = "";
window.onload = function() {
  var nearBy = "https://places.cit.api.here.com/places/v1/discover/search?at=" + lat + "%2C" + lng + "&q=police&Accept-Language=en-GB%2Cen-US%3Bq%3D0.9%2Cen%3Bq%3D0.8&app_id=cEbTFDvw5rCPzhL11Ae6&app_code=FGyb0W3eIrRfoQ3j21Taew";
  // var nearBy = "https://places.cit.api.here.com/places/v1/discover/search?at=31.391%2C75.5347&q=police&Accept-Language=en-GB%2Cen-US%3Bq%3D0.9%2Cen%3Bq%3D0.8&app_id=cEbTFDvw5rCPzhL11Ae6&app_code=FGyb0W3eIrRfoQ3j21Taew";
  // var nearBy = "https://places.cit.api.here.com/places/v1/autosuggest?at=31.391%2C75.5347&q=police&Accept-Language=en-GB%2Cen-US%3Bq%3D0.9%2Cen%3Bq%3D0.8&app_id=cEbTFDvw5rCPzhL11Ae6&app_code=FGyb0W3eIrRfoQ3j21Taew";
  // alert(nearBy);
  $.ajax({
    url: nearBy,
    type: 'GET',
    async: false,
    cache: false,
    timeout: 30000,
    error: function(){
      return true;
    },
    success: function(msg){
      //msg=JSON.parse(msg);
      // console.log(msg['results']['items'][0]['title']);
      // alert("msg");
      nearest = msg['results']['items'][0]['title'];
    }
  });
  // alert(nearest);
}

//sendTextAuth
var counter = 0;
function sendAuthText(tel,issue,desc){
  var location = loco;
  // alert("location" + location);
  var mes = "At Latitude: " + lat + " and Longitude: "+  lng + " Location: " + location + " Issue: " + issue + " Description: " + desc;
  // alert(mes);

  // *  8968062680
  // *  Katyal.
  // *  rahul5rtT8idjBNPAlkcqbgv
  //
  // var url = "https://smsapi.engineeringtgr.com/send/?Mobile=8968062680&Password=Katyal.&Message=" + mes + String(counter) + "&To="+ tel + "&Key=rahul5rtT8idjBNPAlkcqbgv";
  // var url ="https://smsapi.engineeringtgr.com/send/?Mobile=8872811501&Password=sahil025&Message=" + mes + String(counter) + "&To="+ tel + "&Key=sahil6Hq825B7XRfv9yOjEp";
  var url ="https://smsapi.engineeringtgr.com/send/?Mobile=9876126242&Password=gaurav123&Message=" + mes + "&To="+ tel + "&Key=gauraM15HlAE9g4vcozRNdbrPOIkS";
  counter = counter + 1;
  // alert(url);
  // // alert(url);
  // var url = https://smsapi.engineeringtgr.com/send/?Mobile=9876126242&Password=gaurav123&Message=siudhf%20weiufhwiue&To=8872811501&Key=gauraM15HlAE9g4vcozRNdbrPOIkS
  fetch(url)
  .then(function(response){
    console.log(response.json());
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
  });
  // alert("Authority Alerted");
}

var alertedAuth = [];
// Alert Authority

function alertAuthority(issue,desc,severity) {
  var readReportRef = firebase.database().ref('authorities');
  readReportRef.on('value', readReports, errorReadReports);
  function readReports(data){
    var reports = data.val();
    var keys = Object.keys(reports);
    // alert("reading reports");
    // alert("keys" + keys);
    for (var i = 0; i < keys.length; i++) {
      var index = keys[i];
      // alert("index" + index);
      var authIssue = reports[index].issue;
      // alert("authissue: "+ authIssue);
      var name = reports[index].name;
      var tel = reports[index].phone;
      if(name == nearest){
        if(severity > 5) sendAuthText(tel,issue,desc);
      }
      // for(var j = 0; j < authIssue.length; j++){
      //   if(String(authIssue[j]) == String(issue)){
      //     // alert(authIssue[j]);
      //     // alertedAuth.append(name);
      //     console.log(alertedAuth);
      //     if(severity > 5) sendAuthText(tel,issue,desc);
      //   }
      // }
    }
    document.getElementById('confirm').style.display = "block";

    document.getElementById('loading').style.display = "none";
    var dialog = document.querySelector('dialog');
    dialog.show();

    var confirmMessage = "Your Complaint for " + issue  + " has been registerd." +  nearest + " have been reported.";
    // for(var  k = 0; k < alertedAuth.length -1 ; k++){
    //   confirmMessage += alertedAuth[k] + ", ";
    // }"and " + alertedAuth[alertedAuth.length -1] + "
    // confirmMessage +=  "has been reported";
    document.getElementById('reportConfirm').innerHTML = confirmMessage;
  }
  function errorReadReports(error){
    console.log('Error!!');
    console.log(error);
  }


}


// Submit form
function submitForm(e){
  e.preventDefault();

  // Get values
  var name = getInputVal('name');
  var email = getInputVal('email');
  var issue = getInputVal('issue');
  var desc = getInputVal('desc');
  var severity = getInputVal('sliderVal');
  saveMessage(name,email,issue,desc,severity);
  alertAuthority(issue,desc,severity);
  console.log("backtosubmit");
  // confimReport();

}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

document.getElementById('confirm').style.display = "none";
document.getElementById('contact').addEventListener('submit', submitForm);
document.getElementById('confirmBtn').addEventListener('click', function(){
  firebase.auth().signOut();
  window.location = "index.html";
});
