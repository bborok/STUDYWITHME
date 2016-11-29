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
    console.log("edit profile page");

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
    document.getElementById('edit_profile_btn').addEventListener('click', editProfile, false)

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

function gotoEditProfilePage() {
	window.location = "editProfile.html"
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

  var data = firebase.database().ref("users/"+user.uid+"/metadata/");
  data.once("value").then(function(snapshot){
    document.getElementById("nameEdit").value = snapshot.child("name").val();
    document.getElementById("major").value = snapshot.child("major").val();
    document.getElementById("email").value = snapshot.child("email").val();
    document.getElementById("year").value = snapshot.child("school_year").val();
    // document.getElementById("profileImageEdit").value = snapshot.child("profile_image_url").val();
  });

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
		window.location = 'main.html'
	}, function(error) {
		console.log(error)
	})
}

function editProfile() {

  var name = document.getElementById('nameEdit').value;
  var major = document.getElementById('major').value;
  var email = document.getElementById('email').value;
  var year = document.getElementById('year').value;
  // var profileImage = document.getElementById('profileImageEdit').value;
  let fileArray = document.getElementById('profileImageEdit').files

  var user = firebase.auth().currentUser;

  if (user == null) {
  alert("could not update user: user not signed in");
  return;
  }
  // let setPromise = firebase.database().ref('users/' + user.uid + '/metadata').set({
	// 	name: name,
	// 	profile_image_url : fileArray,
	// 	major: major,
	// 	school_year: year,
	// 	email: email,
	// });
  saveUserData(user.uid, name, fileArray, major, year, email)
  // window.location = 'main.html'
  // setPromise.then(function() {
	// 	console.log("saved user data")
  //   saveUserData(user.uid, name, fileArray, major, year, email)
	// 	window.location = 'main.html'
	// }, function(error) {
	// 	console.log(error)
	// })


}
