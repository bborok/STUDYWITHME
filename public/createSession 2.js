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
	console.log("create session page")

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("user: " + user.uid + " isAnonymous: " + user.isAnonymous)
            setupViews()
		} else {
			console.log("signed out")
		}
	})

	document.getElementById('create_session_btn').addEventListener('click', createSession, false);
	document.getElementById('view_profile_btn').addEventListener('click', gotoProfilePage, false);
}

function setupViews() {
	//todo: initialize fields to default values
}

function createSession() {

	let course = document.getElementById('course').value
	let campus = document.getElementById('campus').value
	let startDate = document.getElementById('start_date').value
	let startTime = document.getElementById('start_time').value

	let fullStartDate = function() {
		let dateStr = startDate + " " + startTime + ":00"
		let date = new Date(dateStr)
		return date
	}()

	let startTimestamp = fullStartDate.getTime()

	let duration = document.getElementById('duration').value

	let endTimestamp = startTimestamp + (duration * 3600 * 1000)

	let description = document.getElementById('description').value

	let exactLocation = document.getElementById('exact_location').value

	let maxGuests = document.getElementById('max_guests').value

	//@todo: input validation

	var user = firebase.auth().currentUser;

	if (user == null) {
		alert("could not create session: user not signed in")
		return
	}

	let sessionObj = {
		campus: campus,
		course: course,
		description: description,
		end_date: endTimestamp,
		exact_location: exactLocation,
		host_id: user.uid,
		max_people: maxGuests,
		start_date: startTimestamp
	}

	// console.log(sessionObj)

	let newSessionKey = firebase.database().ref().child('sessions').push().key;

	var fanoutObject = {}
	fanoutObject['/users/'+user.uid+'/hosting_sessions/'+newSessionKey] = true;
	fanoutObject['/sessions/'+newSessionKey+'/metadata'] = sessionObj;

	// console.log(fanoutObject)

 	let updatePromise = firebase.database().ref().update(fanoutObject)

	updatePromise.then(function() {
		console.log("session created!")
		window.location = 'main.html'
	}, function(error) {
		console.log(error)
	})
}

function gotoProfilePage() {
	window.location = "main.html"
}

window.addEventListener('load', function() {
    initApp()
});
