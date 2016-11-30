var pckry = new Packery('.grid', {
  columnWidth: '.grid-sizer',
  rowHeight: '.grid-sizer',
  gutter: '.gutter-sizer',
  itemSelector: '.grid-item',
  percentPosition: true
})

var config = {
	apiKey: "AIzaSyCCcJUaBLram1g9zoqTUVkK9K-iHyv4V-A",
	authDomain: "studywitme-f268e.firebaseapp.com",
	databaseURL: "https://studywitme-f268e.firebaseio.com",
	storageBucket: "studywitme-f268e.appspot.com",
	messagingSenderId: "1009156773779"
};

firebase.initializeApp(config);

var gQuery = firebase.database().ref()

function initApp() {
	console.log("view sessions page")

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("user: " + user.uid + " isAnonymous: " + user.isAnonymous)
			setupViews()
      filterSessions()
		} else {
			console.log("signed out")
      signInAnonymously()
			// window.location = "main.html" ?
		}
	})
	// document.getElementById('view_profile_btn').addEventListener('click', gotoProfilePage, false);
	document.getElementById('signout_btn').addEventListener('click', signOutUser, false);
	document.getElementById('discover_sessions_btn').addEventListener('click', gotoDiscoverSessionsPage, false);
	document.getElementById('create_session_btn').addEventListener('click', gotoCreateSessionPage, false);
	document.getElementById('joined_sessions_btn').addEventListener('click', gotoJoinedSessionsPage, false);
	document.getElementById('hosting_sessions_btn').addEventListener('click', gotoHostingSessionsPage, false);
  document.getElementById('filterBtn').addEventListener('click', filterSessions, false);

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

}

// handles anonymous signin
function signInAnonymously() {
	console.log("Did click on anonymous sign in")
	firebase.auth().signInAnonymously().catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(error);
		alert(errorMessage);
	});
}

function displaySession(sessionObj, sessionKey)
{
	let sessionGrid = document.getElementById("sessionGrid")

	let sessionCard = document.createElement("div")

  let courseName = document.createElement("h4")
  courseName.textContent = sessionObj.course.toUpperCase()
	sessionCard.appendChild(courseName)

  let subTitle = document.createElement("p")
  subTitle.textContent = sessionObj.campus.capitalizeFirstLetter() + " • " + getDateStringFromTimestamp(sessionObj.start_date)
  subTitle.setAttribute('class', 'sectionSubtitle')
  sessionCard.appendChild(subTitle)

	sessionCard.setAttribute('data-session-id', sessionKey)
  sessionCard.setAttribute('class', 'grid-item')
	sessionCard.addEventListener('click', function() {
		localStorage['selected_session'] = sessionKey
		window.location = "sessionDetail.html"
    // choices:
    // a) show modal window with session details
		// b) window.location = "sessionDetail.html"
	}, false)

	sessionGrid.appendChild(sessionCard);
  pckry.appended(sessionCard);
  pckry.layout()
}

window.addEventListener('load', function() {
    initApp()
});

function showLoader() {
  document.getElementById("loadingIndicator").style.display = "block"
}

function hideLoader() {
  document.getElementById("loadingIndicator").style.display = "none"
}

function filterSessions() {

  showLoader()

  clearSessionGrid()
  //remove previous listeners on the query (if any)
  gQuery.off()

  let campusFilter = document.getElementById("campusInput")
  let campusVal = campusFilter.options[campusFilter.selectedIndex].value

  filterByCampus(campusVal)
}

function filterByCampus(campus) {

  var query = firebase.database().ref('sessions').orderByChild('metadata/campus').equalTo(campus)
  gQuery = query // so we can clear listeners later

  if (campus == "all") {
    query = firebase.database().ref('sessions')
  }

  courseInput = document.getElementById("courseInput").value
  searchKeyword = courseInput.toLowerCase()
  var regex = new RegExp(searchKeyword)

  query.on('child_added', function(data) {
    hideLoader()
    let dict = data.val()
	  let sessionObj = dict["metadata"]
	  // console.log(sessionObj)

    if (regex.test(sessionObj.course)) {
      displaySession(sessionObj, data.key)
    }
  })

  query.on('child_removed', function(data) {
    let sessionCard = document.querySelector('[data-session-id='+data.key+']')
    pckry.remove(sessionCard)
    pckry.layout()
  })
}

function clearSessionGrid() {
  let sessions = pckry.getItemElements()
  pckry.remove(sessions)
}

// utility functions
function sleepFor( sleepDuration ){
  console.log("sleeping for "+ sleepDuration + "msec.")
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) {
      /* do nothing */
    }
  console.log("done sleeping.")
}

function getDateStringFromTimestamp(timestamp) {
  let date = new Date()
	date.setTime(timestamp)
  var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  let str = date.toLocaleTimeString() // like "9:42:00 PM"
	let arr1 = str.split(' ') // like ["9:42:00", "PM"]
	let arr2 = arr1[0].split(':') // like ["9", "42", "00"]
	console.log(str)

  var ampm = (date.getHours() >= 12) ? "PM" : "AM";

  let dateStr = days[date.getDay()] + " " + arr2[0]+ ":" + arr2[1] + " " + ampm

	return dateStr
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
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
