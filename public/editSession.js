var config = {
	apiKey: "AIzaSyCCcJUaBLram1g9zoqTUVkK9K-iHyv4V-A",
	authDomain: "studywitme-f268e.firebaseapp.com",
	databaseURL: "https://studywitme-f268e.firebaseio.com",
	storageBucket: "studywitme-f268e.appspot.com",
	messagingSenderId: "1009156773779"
};
firebase.initializeApp(config);
var sessionID;

function initApp() {
    console.log("edit session page");

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
		    console.log("user: " + user.uid + " isAnonymous: " + user.isAnonymous);
		    setupViews();
		} else {
		    console.log("signed out");
		}
	});

    //document.getElementById('create_session_btn').addEventListener('click', editSession, false);
    document.getElementById('view_profile_btn').addEventListener('click', gotoProfilePage, false);
    document.getElementById('signout_btn').addEventListener('click', signOutUser, false);
    document.getElementById('discover_sessions_btn').addEventListener('click', gotoDiscoverSessionsPage, false);
    document.getElementById('create_session_btn').addEventListener('click', gotoCreateSessionPage, false);
    document.getElementById('pending_sessions_btn').addEventListener('click', gotoPendingSessionsPage, false);
    document.getElementById('joined_sessions_btn').addEventListener('click', gotoJoinedSessionsPage, false);
    document.getElementById('hosting_sessions_btn').addEventListener('click', gotoHostingSessionsPage, false);
}

//populates the form with the session's values
function setupViews() {
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
    var data = firebase.database().ref("sessions/"+sessionID+"/metadata/");
    data.once("value").then(function(snapshot){
	document.getElementById("inputCourse").value = snapshot.child("course").val().substring(0,4).toUpperCase();
	document.getElementById("inputCourseNum").value = snapshot.child("course").val().substring(5);

	let startTimeStamp = snapshot.child("start_date").val();
	let startDate = new Date(Number(startTimeStamp));
	let startDateUsable = startDate.toJSON().substring(0,10);
	startDateUsable = startDateUsable.split('-');
	let startTime = new Date(Number(startTimeStamp));
	let startTimeUsable = startDate.toLocaleTimeString().split(' ');
	document.getElementById("inputStartDate").value = startDateUsable[1]+'/'+startDateUsable[2]+'/'+startDateUsable[0];
	document.getElementById("inputStartTime").value = startTimeUsable[0];

	document.getElementById("inputDuration").value = (snapshot.child("end_date").val() - startTimeStamp) / 1000 / 3600;
	document.getElementById("inputDesc").value = snapshot.child("description").val();

	let select = document.getElementById("inputLoc");
	let locOld = snapshot.child("campus").val();
	if (locOld == "Surrey"){
	    select.selectedIndex = 0;
	} else if (locOld == "Burnaby"){
	    select.selectedIndex = 1;
	} else {
	    select.selectedIndex = 2;
	}

	document.getElementById("inputExactLocation").value = snapshot.child("exact_location").val();
	document.getElementById("inputMaxAttend").value = snapshot.child("max_people").val();
    });
}

function editSession() {

    var course = document.getElementById('inputCourse').value;

    //should be handled more elegantly
    if (course.length < 4){
	console.log("invalid course code");
    }
    course += " " + document.getElementById('inputCourseNum').value;

    let campus = document.getElementById('inputLoc').value;
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

    firebase.database().ref("/sessions/"+sessionID+"/metadata/").set(session);

    window.location = "joinedSessions.html";
}

function gotoProfilePage() {
    window.location = "main.html";
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


(function(){
    //console.log("script is running");
    //sessionID = 'sessionid1';
    sessionID = localStorage['selected_session'];
    setupViews();
}())
