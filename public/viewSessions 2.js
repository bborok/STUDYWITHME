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
	var sessionsRef = firebase.database().ref('sessions');

	sessionsRef.on('child_added', function(data) {
		// console.log(data.val())
		let dict = data.val()
		let sessionObj = dict["metadata"]
		// console.log(sessionObj)
		displaySession(sessionObj, data.key)
	});

	sessionsRef.on('child_removed', function(data) {
		removeSession(data.key)
	})
}

function displaySession(sessionObj, sessionKey)
{
	let container = document.getElementById("main_container")

	let card = document.createElement("div")

	let courseName = document.createTextNode(sessionObj.course)
	card.appendChild(courseName)

	card.setAttribute('data-session-id', sessionKey)
	card.addEventListener('click', function() {
		localStorage['selected_session'] = sessionKey
		window.location = "sessionDetail.html"
	}, false)

	container.appendChild(card)
}

function removeSession(sessionKey) {
	let sessionCard = document.querySelector('[data-session-id='+sessionKey+']')
	// console.log(sessionCard)
	if (sessionCard == null || sessionCard == undefined) {
		console.log("ERROR: cannot find DOM element with data-session-id: " + sessionKey)
	} else {
		sessionCard.parentNode.removeChild(sessionCard)
		console.log("INFO: card with session-id: " + sessionKey + " deleted")
	}
}

function gotoProfile() {
	window.location = "main.html"
}

window.addEventListener('load', function() {
    initApp()
});
