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
	console.log("Joined sessions page")

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("user: " + user.uid + " isAnonymous: " + user.isAnonymous)
			setupView()
		} else {
			console.log("signed out")
			window.location= '../../login.html'
		}
	})
    
	document.getElementById('signout_btn').addEventListener('click', signOutUser, false);
	document.getElementById('back_to_profile_btn').addEventListener('click', gotoProfile, false);
	document.getElementById('discover_sessions_btn').addEventListener('click', gotoDiscoverSessionsPage, false);
	document.getElementById('create_session_btn').addEventListener('click', gotoCreateSessionPage, false);
	document.getElementById('pending_sessions_btn').addEventListener('click', gotoPendingSessionsPage, false);
	document.getElementById('joined_sessions_btn').addEventListener('click', gotoJoinedSessionsPage, false);
	document.getElementById('hosting_sessions_btn').addEventListener('click', gotoHostingSessionsPage, false);
}

function setupView() {
	let user = firebase.auth().currentUser
	var joinedSessionsRef = firebase.database().ref('users/'+user.uid+'/joined_sessions');

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
	}

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

function signOutUser() {
    console.log("[event] Did click on sign out btn")
    firebase.auth().signOut().then(function() {
	  	console.log('Signed Out');
	}, function(error) {
	  	console.error('Sign Out Error', error);
	});
}

function gotoDiscoverSessionsPage() {
	window.location = "../../viewSessions.html"
}

function gotoCreateSessionPage() {
	window.location = "../../createSession.html"
}

function gotoPendingSessionsPage() {
	alert("comming soon...")
	// window.location = "hostingSessions.html"
}

function gotoJoinedSessionsPage() {
	window.location = "../../joinedSessions.html"
}

function gotoHostingSessionsPage() {
	window.location = "../../hostingSessions.html"
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
		window.location = "../../sessionDetail.html"
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
	window.location = "../../main.html"
}

window.addEventListener('load', function() {
    initApp()
});
