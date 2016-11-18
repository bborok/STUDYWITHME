// value = localStorage['selected_session']
// document.getElementById('session_info').textContent = value
// console.log(value)

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
	console.log("Session detail page")

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("user: " + user.uid + " isAnonymous: " + user.isAnonymous)
			let sessionID = localStorage['selected_session']
			fetchSessionInfo(sessionID)
		} else {
			console.log("signed out")
		}
	})
}

function fetchSessionInfo(sessionID) {
	let sessionRef = firebase.database().ref().child('sessions').child(sessionID).child('metadata')

	let sessionPromise = sessionRef.on('value', function(snapshot) {

		let sessionObj = snapshot.val()
		sessionObj['key'] = sessionID // we'll use this later

		// get the host info:
		let hostRef = firebase.database().ref().child('users').child(sessionObj.host_id).child('metadata')
		hostRef.once('value').then(function(snapshot) {
			if (snapshot.exists()) {
				let userObj = snapshot.val()
				document.getElementById('host_name').textContent = userObj.name
				document.getElementById('host_image').src = userObj.profile_image_url
			}
		})

		// console.log(snapshot.val())
		document.getElementById('course').textContent = sessionObj.course
		document.getElementById('campus').textContent = sessionObj.campus
		document.getElementById('description').textContent = sessionObj.description
		document.getElementById('max_guests').textContent = sessionObj.max_people
		document.getElementById('start_date').textContent = timestampToReadableDate(sessionObj.start_date)
		document.getElementById('exact_location').textContent = sessionObj.exact_location
		document.getElementById('start_time').textContent = timestampToReadableTime(sessionObj.start_date)
		document.getElementById('duration').textContent = hourlyDurationFromTimestamps(sessionObj.start_date, sessionObj.end_date)

		// setup the appropriate buttons
		setupActionButton(sessionObj)
	}, function(error) {
		console.log(error)
	})
}

function setupActionButton(sessionObj) {

	/*
	Depending on who the user is, show different buttons.
	i.e, 	if user == host, show an edit-session button,
			if user == alread-joined, show 'cancel-session' button,
			if user == unjoined, show 'join-session' button.
	*/

	// get all users that have joined this session
	let joinedSessionsRef = firebase.database().ref().child('sessions').child(sessionObj.key).child('guests')
	joinedSessionsRef.on('value', function(snapshot) {

		//display # of people currently joined
		document.getElementById('current_guests').textContent = "("+snapshot.numChildren()+" Joined)"

		// if the user is the session host, show 'edit-session' button, exit.
		let user = firebase.auth().currentUser
		if (user.uid == sessionObj.host_id) {
			// console.log("INFO: you're the host")
			let btnContainer = document.getElementById('action_btn')

			let btn = document.createElement('button')
			let txt = document.createTextNode("Edit Session")
			btn.appendChild(txt)
			btn.addEventListener('click', editSession, false)

			removeAllChildren(btnContainer)
			btnContainer.appendChild(btn)
			return
		}

		let joiners = snapshot.val()
		// console.log(joiners)

		// if the session is filled up
		if (snapshot.numChildren() == sessionObj.max_people) {
			// and this user is not one of the guests, show a 'session-filled' message, exit.
			if (joiners != null && !(user.uid in joiners)) {
				let btnContainer = document.getElementById('action_btn')
				let txt = document.createTextNode("Sorry, session is full")
				removeAllChildren(btnContainer)
				btnContainer.appendChild(txt)
				return
			}
		}

		// if the user has joined this session already
		if ( joiners != null && user.uid in joiners ) {
			// console.log("INFO: joined")
			let btnContainer = document.getElementById('action_btn')

			let btn = document.createElement('button')
			let txt = document.createTextNode("Decline Session")
			btn.appendChild(txt)
			btn.addEventListener('click', function() { declineSession(sessionObj) }, false)

			removeAllChildren(btnContainer)
			btnContainer.appendChild(btn)
		} else {
			// console.log("INFO: not joined")
			let btnContainer = document.getElementById('action_btn')

			let btn = document.createElement('button')
			let txt = document.createTextNode("Join Session")
			btn.appendChild(txt)
			btn.addEventListener('click', function() { joinSession(sessionObj) }, false)

			removeAllChildren(btnContainer)
			btnContainer.appendChild(btn)
		}
	}, function(error) {
		console.log(error)
	})
}

function joinSession(sessionObj) {
	// console.log(sessionObj)
	let user = firebase.auth().currentUser

	var updates = {}
	updates['/users/'+user.uid+'/joined_sessions/'+sessionObj.key] = true
	updates['/sessions/'+sessionObj.key+'/guests/'+user.uid] = true
	// console.log(updates)

	let updatePromise = firebase.database().ref().update(updates)
	updatePromise.then(function() {
		console.log("INFO: joined session successfully")
	}, function(error) {
		console.log(error)
	})
}

function declineSession(sessionObj) {
	// console.log(sessionObj)
	let user = firebase.auth().currentUser

	var updates = {}
	updates['/users/'+user.uid+'/joined_sessions/'+sessionObj.key] = null
	updates['/sessions/'+sessionObj.key+'/guests/'+user.uid] = null
	// console.log(updates)

	let updatePromise = firebase.database().ref().update(updates)
	updatePromise.then(function() {
		console.log("INFO: declined session successfully")
	}, function(error) {
		console.log(error)
	})
}

function editSession() {
	console.log("@todo: operations to edit session")
}

function timestampToReadableDate(timestamp) {
	let date = new Date()
	date.setTime(timestamp)
	return date.toDateString()
}

function removeAllChildren(parentNode) {
	while(parentNode.firstChild) {
		parentNode.removeChild(parentNode.firstChild)
	}
}

function timestampToReadableTime(timestamp) {
	let date = new Date()
	date.setTime(timestamp)

	let str = date.toLocaleTimeString() // like "9:42:00 PM"
	let arr1 = str.split(' ') // like ["9:42:00", "PM"]
	let arr2 = arr1[0].split(':') // like ["9", "42", "00"]
	// console.log(arr1, arr2)
	return arr2[0]+':'+arr2[1]+' '+arr1[1]
}

function hourlyDurationFromTimestamps(start_timestamp, end_timestamp) {
	let hours = (end_timestamp - start_timestamp) / 1000 / 3600
	return hours + ' ' + (hours > 1 ? 'hrs' : 'hr')
}

function joinOrDeclineSession() {
	console.log("@todo: join session")
}

window.addEventListener('load', function() {
    initApp()
});
