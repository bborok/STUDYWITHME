var config = {
	apiKey: "AIzaSyCLVxc7phJ61ovL3IXkC48vIVEb5AkLDEI",
	authDomain: "test-41ee5.firebaseapp.com",
	databaseURL: "https://test-41ee5.firebaseio.com",
	storageBucket: "",
	messagingSenderId: "499883709672"
};
firebase.initializeApp(config);

function setupView() {

	let user = "user1";
	
	if (user != null) {
		var hostingSessionsRef = firebase.database().ref().child('users').child('user1').child('hosting_sessions');
		var joinedSessionsRef = firebase.database().ref().child('users').child('user1').child('joined_sessions');

		hostingSessionsRef.on('child_added', function(data) {
			//console.log(data.key)
			let hostSessionRef = firebase.database().ref('sessions').child(data.key).child('metadata');
			hostSessionRef.once('value', function(snapshot) {
				// console.log(snapshot.val())
				let dict = snapshot.val()
				// console.log(dict)
				let table = document.getElementById("hostedTable")
				let row = document.getElementById("hostedRow")
				//addRow(table, dict['course'], dict['campus'], dict['description'])
				addBox(row, dict['course'], dict['campus'], dict['description'], data.key)
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
				addBox(row, dict['course'], dict['campus'], dict['description'], data.key)
				//addRow(table, dict['course'], dict['campus'], dict['description'])
			})
		})
	}
}

function addRow(table, col1val, col2val, col3val)
{
	let row = document.createElement("tr");
	let cell1 = document.createElement("td");
	let cell2 = document.createElement("td");
	let cell3 = document.createElement("td");
	let textnode1 = document.createTextNode(col1val);
	let textnode2 = document.createTextNode(col2val);
	let textnode3 = document.createTextNode(col3val);
	cell1.appendChild(textnode1);
	cell2.appendChild(textnode2);
	cell3.appendChild(textnode3);
	row.appendChild(cell1);
	row.appendChild(cell2);
	row.appendChild(cell3);
	table.appendChild(row);
}

function addBox(row, course, campus, desc, sessionid)
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
	textNode.innerHTML = course + "<br>" + campus + "<br>" + desc + "<br>" + sessionid;
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