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
	console.log("create account page")

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("user: " + user.uid + " isAnonymous: " + user.isAnonymous)
            // writeUserData()
		} else {
			console.log("signed out")
		}
	})

	document.getElementById('createAccount-btn').addEventListener('click', createUserAccount, false);
	document.getElementById('signIn-btn').addEventListener('click', backToSignin, false);
}

function saveUserData(uid, name, fileArray, major, year, email) {

	//try uploading profile image if provided.
	if (fileArray.length > 0) {
		var file = fileArray[0]
		var storageRef = firebase.storage().ref();
		var saveName = uid + "." + file.name.split('.').pop()

		var uploadTask = storageRef.child('images/' + saveName).put(file);

		uploadTask.then(function(snapshot){
			saveUserOtherData(uid, name, snapshot.downloadURL, major, year, email)
		}, function(error){
			console.log(error)
		})
	} else {
		saveUserOtherData(uid, name, "", major, year, email)
	}
}


function saveUserOtherData(uid, name, profile_image_url, major, year, email) {

	let setPromise = firebase.database().ref('users/' + uid + '/metadata').set({
		name: name,
		profile_image_url : profile_image_url,
		major: major,
		school_year: year,
		email: email,
	});

	setPromise.then(function() {
		console.log("saved user data")
		window.location = '../../main.html'
	}, function(error) {
		console.log(error)
	})
}

function createUserAccount() {

	let name = document.getElementById('name').value
	let fileArray = document.getElementById('profileImage').files
	let major = document.getElementById('major').value
	let year = document.getElementById('year').value
	let email = document.getElementById('email').value
	let password1 = document.getElementById('password1').value
	let password2 = document.getElementById('password2').value

	console.log(fileArray)

	if (isEmpty(name)) {
		alert("Please enter a valid name")
		return
	}

	if (isEmpty(major)) {
		alert("Please enter a valid major")
		return
	}

	if (isMatchingPasswords(password1, password2) == false) {
		alert("Please ensure the passwords match")
		return
	}

	console.log("name: " + name + " email: " + " password1: " + password1 + " password2: " + password2)

    console.log("[event] Did click on create account btn")

 	let createPromise = firebase.auth().createUserWithEmailAndPassword(email, password1)

 	createPromise.then(function(user) {
 		saveUserData(user.uid, name, fileArray, major, year, email)
 	}, function(error) {
 		console.log(error)
 		alert(error)
 	})
}

function isEmpty(str) {
	if (str == null || str == undefined || str == "") {
		return true
	} else {
		return str.trim().length > 0 ? false : true
	}
}

function isMatchingPasswords(password1, password2) {
	return (password1 == null || password2 == null || password1 != password2) ? false : true
}

function backToSignin() {
	window.location = "../../login.html"
}

window.addEventListener('load', function() {
    initApp()
});
