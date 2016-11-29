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
			window.location = 'login.html'
		}
	})

	document.getElementById('create_session_btn').addEventListener('click', createSession, false);
	document.getElementById('view_profile_btn').addEventListener('click', gotoProfilePage, false);
}

function setupViews() {
	//todo: initialize fields to default values
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

function createSession() {

    var course = document.getElementById('inputCourse').value.toLowerCase();

    //should be handled more elegantly
    if (course.length < 4){
	//break;
    }
    course += " " + document.getElementById('inputCourseNum').value;

    let campus = document.getElementById('inputCampus').value;
    let startDate = document.getElementById('inputStartDate').value;
    let startTime = document.getElementById('inputStartTime').value;
    let fullStartDate = function() {
		let dateStr = startDate + " " + startTime;
		let date = new Date(dateStr);
		return date;
	    }();
    let startTimestamp = fullStartDate.getTime();
    let duration = document.getElementById('inputDuration').value;
    let endTimestamp = startTimestamp + (duration * 3600 * 1000);
    let description = document.getElementById('inputDesc').value;
    let exactLocation = document.getElementById('inputExactLocation').value;
    let maxGuests = document.getElementById('inputMaxAttend').value;



    //@todo: input validation

    var user = firebase.auth().currentUser;

    if (user == null) {
	alert("could not create session: user not signed in");
	return;
    }

    let session = {
	    campus: campus,
	    course: course,
	    description: description,
	    end_date: endTimestamp,
	    exact_location: exactLocation,
	    host_id: user.uid,
	    max_people: maxGuests,
	    start_date: startTimestamp
    };

    let newSessionKey = firebase.database().ref().child('sessions').push().key;

    var fanoutObject = {}
    fanoutObject['/users/'+user.uid+'/hosting_sessions/'+newSessionKey] = true;
    fanoutObject['/sessions/'+newSessionKey+'/metadata'] = session;

    // console.log(fanoutObject)

    let updatePromise = firebase.database().ref().update(fanoutObject);

    updatePromise.then(function() {
	console.log("session created!");
	window.location = 'main.html';
    }, function(error) {
	console.log(error);
    })
}

function gotoProfilePage() {
	window.location = "main.html"
}

window.addEventListener('load', function() {
    initApp()
});
