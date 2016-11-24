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
}
