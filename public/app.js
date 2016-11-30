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

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("user: " + user.uid + " isAnonymous: " + user.isAnonymous)
            window.location = 'main.html'
		} else {
			console.log("signed out")

		}
	})

	document.getElementById('signin-btn').addEventListener('click', signInWithEmailPassword, false);
  document.getElementById('signout-btn').addEventListener('click', signOutUser, false);
  document.getElementById('createAcct-btn').addEventListener('click', createAccount, false);
	
}

// handles anonymous signin
function signInAnonymously() {
    console.log("[event] Did click on anonymous sign in")
    firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        alert(errorMessage);
    });
}

function signInWithEmailPassword() {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        alert(errorMessage);
    });
}

function signOutUser() {
    console.log("[event] Did click on sign out btn")
    firebase.auth().signOut().then(function() {
	  	console.log('Signed Out');
	}, function(error) {
	  	console.error('Sign Out Error', error);
	});
}

function createAccount(e) {
    window.location = "createAccount.html"
}

// window.addEventListener('load', function() {
//     initApp()
// });

document.addEventListener('DOMContentLoaded', function() {
    initApp()
})
