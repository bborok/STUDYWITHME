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
      filterSessions()
		} else {
			console.log("signed out")
      signInAnonymously()
		}
	})

  document.getElementById('filterBtn').addEventListener('click', filterSessions, false);

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
	// console.log(arr1, arr2)

  let dateStr = days[date.getDay()] + " " + arr2[0]+ ":" + arr2[1] + " " + arr1[1]

	return dateStr
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
