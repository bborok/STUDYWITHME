// Initialize Firebase
var config = {
	apiKey: "AIzaSyCCcJUaBLram1g9zoqTUVkK9K-iHyv4V-A",
	authDomain: "studywitme-f268e.firebaseapp.com",
	databaseURL: "https://studywitme-f268e.firebaseio.com",
	storageBucket: "studywitme-f268e.appspot.com",
	messagingSenderId: "1009156773779"
};
firebase.initializeApp(config);

function initApp() {
	console.log("view sessions page")

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("user: " + user.uid + " isAnonymous: " + user.isAnonymous)
			setupView()
		} else {
			console.log("signed out")
		}
	})

	document.getElementById('back_to_profile_btn').addEventListener('click', gotoProfile, false);
}

function setupView() {

	let user = firebase.auth().currentUser;

	if (user != null) {
		var hostingSessionsRef = firebase.database().ref().child('users').child(user.uid).child('hosting_sessions');

		hostingSessionsRef.on('child_added', function(data) {
			// console.log(data.key)
			let sessionRef = firebase.database().ref('sessions').child(data.key).child('metadata');
			sessionRef.once('value', function(snapshot) {
				// console.log(snapshot.val())
				let dict = snapshot.val()
				// console.log(dict)
				let tableBody = document.getElementById("tableBody")
				addRow(tableBody, dict['course'], dict['campus'], "x")
			})
		});
	}
}

function addRow(tableBody, col1val, col2val, col3val)
{
	let row = document.createElement("tr");
	let cell1 = document.createElement("td");
	let cell2 = document.createElement("td");
	let cell3 = document.createElement("td");
	let textnode1 = document.createTextNode(col1val);
	let textnode2 = document.createTextNode(col2val);
	let textnode3 = document.createTextNode(col3val);
	cell1.appendChild(textnode1);
	cell2.appendChild(textnode2);
	cell3.appendChild(textnode3);
	row.appendChild(cell1);
	row.appendChild(cell2);
	row.appendChild(cell3);
	tableBody.appendChild(row);
}

function gotoProfile() {
	window.location = "main.html"
}

window.addEventListener('load', function() {
    initApp()
});
