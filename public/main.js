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
	console.log("main page")

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("user: " + user.uid + " isAnonymous: " + user.isAnonymous)
            setupView()
		} else {
			console.log("signed out")
			window.location = 'index.html'
		}
	})

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

window.addEventListener('load', function() {
    initApp()
});