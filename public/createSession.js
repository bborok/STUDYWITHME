// Initialize Firebase
var config = {
	/*apiKey: "AIzaSyCCcJUaBLram1g9zoqTUVkK9K-iHyv4V-A",
	authDomain: "studywitme-f268e.firebaseapp.com",
	databaseURL: "https://studywitme-f268e.firebaseio.com",
	storageBucket: "studywitme-f268e.appspot.com",
	messagingSenderId: "1009156773779"*/
    apiKey: "AIzaSyA_ZkwZnJvENuwgrzizLwnIVEUNJ9jHgX4",
    authDomain: "test-e0711.firebaseapp.com",
    databaseURL: "https://test-e0711.firebaseio.com",
    storageBucket: "test-e0711.appspot.com",
    messagingSenderId: "335642349875"
};
firebase.initializeApp(config);

function initApp() {
    console.log("create session page");

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
		    console.log("user: " + user.uid + " isAnonymous: " + user.isAnonymous);
		} else {
		    console.log("signed out");
		}
	});

    //document.getElementById('create_session_btn').addEventListener('click', createSession, false);
    //document.getElementById('view_profile_btn').addEventListener('click', gotoProfilePage, false);
}

function createSession() {

    var course = document.getElementById('inputCourse').value.toUpperCase();

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
    window.location = "main.html";
}

window.addEventListener('load', function() {
    initApp()
});

(function(){
    console.log("script is running");
}())
