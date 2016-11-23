var config = {
	apiKey: "AIzaSyCCcJUaBLram1g9zoqTUVkK9K-iHyv4V-A",
	authDomain: "studywitme-f268e.firebaseapp.com",
	databaseURL: "https://studywitme-f268e.firebaseio.com",
	storageBucket: "studywitme-f268e.appspot.com",
	messagingSenderId: "1009156773779"
};
firebase.initializeApp(config);

function setupView() {

	let user = firebase.auth().currentUser;
	
	if (user != null) {
		var hostingSessionsRef = firebase.database().ref().child('users').child(user.uid).child('hosting_sessions');
		var joinedSessionsRef = firebase.database().ref().child('users').child(user.uid).child('joined_sessions');

		hostingSessionsRef.on('child_added', function(data) {
			let hostSessionRef = firebase.database().ref('sessions').child(data.key).child('metadata');
			hostSessionRef.once('value', function(snapshot) {
				let dict = snapshot.val()
				let table = document.getElementById("hostedTable")
				let row = document.getElementById("hostedRow")
				addBox(row, dict['course'], dict['campus'], dict['host_id'], data.key)
			})
		});

		joinedSessionsRef.on('child_added', function(data)
		{
			let joinSessionRef = firebase.database().ref('sessions').child(data.key).child('metadata');
			joinSessionRef.once('value', function(snapshot)
			{
				let dict = snapshot.val()
				let table = document.getElementById("joinedTable")
				let row = document.getElementById("joinedRow")
				addBox(row, dict['course'], dict['campus'], dict['host_id'], data.key)
			})
		})
	}
}

function addBox(row, course, campus, host, sessionid)
{
	var divNew = document.createElement("div");
	divNew.className = "box";
	var buttonNew = document.createElement("input");
	buttonNew.type = "button";
	buttonNew.value = "View Session";
	buttonNew.className = "button";
	buttonNew.onclick = function() {
		localStorage['selected_session'] = sessionid;
		window.location = "sessionDetail.html";
	}
	var box = document.createElement("a");
	var textNode = document.createElement("center");
	textNode.className = "text";
	textNode.innerHTML = "Course: " + course + "<br>" + "Campus: " + campus + "<br>" + "Host: " + host;
	divNew.appendChild(box);
	divNew.appendChild(buttonNew);
	divNew.appendChild(textNode);
	row.appendChild(divNew);
}

window.addEventListener('load', function() {
    setupView();
}); 