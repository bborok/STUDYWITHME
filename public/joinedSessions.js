// Initialize Firebase
var config = { 
	apiKey: "AIzaSyDOTyoj9m1nnT9bkG30WXMPuzFjT39Yb9I", 
	authDomain: "test-e758d.firebaseapp.com", 
	databaseURL: "https://test-e758d.firebaseio.com", 
	storageBucket: "test-e758d.appspot.com", 
	messagingSenderId: "918779841724" 
}; 
firebase.initializeApp(config);

function initApp() {
	console.log("Joined sessions page")

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
	let user = firebase.auth().currentUser
	var joinedSessionsRef = firebase.database().ref('users/'+user.uid+'/joined_sessions');

	joinedSessionsRef.on('child_added', function(data) {
		// console.log(data.val())
		if (data.exists()) {
			let sessionRef = firebase.database().ref('sessions/'+data.key+'/metadata')
			sessionRef.once('value', function(snapshot) {
				let sessionObj = snapshot.val()
				displaySession(sessionObj, data.key)
			})
		}
	});

	joinedSessionsRef.on('child_removed', function(data) {
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