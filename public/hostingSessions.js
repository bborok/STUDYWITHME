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
			window.location = 'login.html'

		}
	})

	document.getElementById('back_to_profile_btn').addEventListener('click', gotoProfile, false);
	document.getElementById('signout_btn').addEventListener('click', signOutUser, false);
	document.getElementById('discover_sessions_btn').addEventListener('click', gotoDiscoverSessionsPage, false);
	document.getElementById('create_session_btn').addEventListener('click', gotoCreateSessionPage, false);
	document.getElementById('pending_sessions_btn').addEventListener('click', gotoPendingSessionsPage, false);
	document.getElementById('joined_sessions_btn').addEventListener('click', gotoJoinedSessionsPage, false);
	document.getElementById('hosting_sessions_btn').addEventListener('click', gotoHostingSessionsPage, false);
}

function setupView() {

	let user = firebase.auth().currentUser;
	if (user != null) {

		var userRef = firebase.database().ref('users/' + user.uid + '/metadata');

		userRef.on('value', function(snapshot) {
			// console.log(snapshot.val())
			let dict = snapshot.val()

			let imageView = document.getElementById('image')
			let nameView = document.getElementById('name')
			let majorView = document.getElementById('major')
			let yearView = document.getElementById('year')
			let emailView = document.getElementById('email')
			let statusView = document.getElementById('status')

			imageView.src = (dict["profile_image_url"] == "") ? "DEFAULT_PROFILE_IMAGE.png" : dict["profile_image_url"]
			nameView.textContent = dict["name"]
			majorView.textContent = dict["major"]
			yearView.textContent = dict["school_year"]
			emailView.innerHTML = dict["email"]
			statusView.innerHTML = user.isAnonymous ? "Anonymous" : "Regular"
		});
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

function signOutUser() {
    console.log("[event] Did click on sign out btn")
    firebase.auth().signOut().then(function() {
	  	console.log('Signed Out');
	}, function(error) {
	  	console.error('Sign Out Error', error);
	});
}

function gotoDiscoverSessionsPage() {
	window.location = "viewSessions.html"
}

function gotoCreateSessionPage() {
	window.location = "createSession.html"
}

function gotoPendingSessionsPage() {
	alert("comming soon...")
	// window.location = "hostingSessions.html"
}

function gotoJoinedSessionsPage() {
	window.location = "joinedSessions.html"
}

function gotoHostingSessionsPage() {
	window.location = "hostingSessions.html"
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
