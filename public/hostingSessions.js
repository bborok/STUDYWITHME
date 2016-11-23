var config = {
	apiKey: "AIzaSyCCcJUaBLram1g9zoqTUVkK9K-iHyv4V-A",
	authDomain: "studywitme-f268e.firebaseapp.com",
	databaseURL: "https://studywitme-f268e.firebaseio.com",
	storageBucket: "studywitme-f268e.appspot.com",
	messagingSenderId: "1009156773779"
};
firebase.initializeApp(config);

function setupView() {

	var user = firebase.auth().currentUser;
	
	if (user != null) {
		var hostingSessionsRef = firebase.database().ref().child('users').child(user.uid).child('hosting_sessions');
		var joinedSessionsRef = firebase.database().ref().child('users').child(user.uid).child('joined_sessions');

		hostingSessionsRef.on('child_added', function(data) {
			//console.log(data.key)
			var hostSessionRef = firebase.database().ref('sessions').child(data.key).child('metadata');
			hostSessionRef.once('value', function(snapshot) {
				// console.log(snapshot.val())
				var dict = snapshot.val()
				// console.log(dict)
				var table = document.getElementById("hostedTable")
				var row = document.getElementById("hostedRow")
				addBox(row, dict['course'], dict['campus'], dict['host_id'])
			})
		});

		joinedSessionsRef.on('child_added', function(data)
		{
			var joinSessionRef = firebase.database().ref('sessions').child(data.key).child('metadata');
			joinSessionRef.once('value', function(snapshot)
			{
				var dict = snapshot.val()
				var table = document.getElementById("joinedTable")
				var row = document.getElementById("joinedRow")
				addBox(row, dict['course'], dict['campus'], dict['host_id'])
			})
		})
	}
}


function addBox(row, course, campus, desc)
{
	var divNew = document.createElement("div");
	divNew.className = "box";
	var buttonNew = document.createElement("input");
	buttonNew.type = "button";
	buttonNew.value = "View Session";
	buttonNew.className = "button";
	var box = document.createElement("a");
	var textNode = document.createElement("center");
	textNode.className = "text";
	textNode.innerHTML = "Course: " + course + "<br>" + "Campus: " + campus + "<br>" + "Host: " + desc;
	divNew.appendChild(box);
	divNew.appendChild(buttonNew);
	divNew.appendChild(textNode);
	row.appendChild(divNew);
}


function gotoProfile() {
	window.location = "main.html" 
}

window.addEventListener('load', function() {
    setupView();
}); 