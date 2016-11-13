const ADDRESS = 'https://cmpt106.firebaseio.com/';
const NEW_SESSION = "NEW_SESSION";
const SEARCH = "SEARCH";
const MANAGE_SESSIONS = "MANAGE_SESSIONS";
const WRITE_MESSAGE = "WRITE_MESSAGE";
const CHAT = "CHAT";

//TODO: Distinguish users
const USER_ID = "Somebody";

var movieFire = angular.module("StudyWitMe", ["firebase"]);

function MainController($scope, $firebase) {
    $scope.choice = SEARCH;
}

function MessageController($scope, $firebase) {
    $scope.db = $firebase(new Firebase(ADDRESS + "conversations"));
    $scope.messages = [];

    $scope.db.$on('value', function () {
        $scope.messages = [];
        var msg = $scope.db.$getIndex();
        for (var i = 0; i < msg.length; i++) {
            $scope.messages.push({
                key: msg[i],
                owner: $scope.db[msg[i]].owner,
                text: $scope.db[msg[i]].text,
                date: $scope.db[msg[i]].date
            });
        }
    });
    $scope.sendMessage = function (event) {

        var id = "-KWQqyPRSamgouFwsQNz";
        $scope.child(id).set(
            {"sessionID" : "Hello"}
        );

        if (event.which == 13 || event.keyCode == 13) {
            var text = $scope.message.trim();
            if (text.length > 0) {
                $scope.db.$add({
                    owner: USER_ID,
                    text: text,
                    date: new Date()
                });
                messageBox.value = '';
                $scope.message.clean;
            }
        }
    }
}

function CreateController($scope, $firebase) {
    $scope.db = $firebase(new Firebase(ADDRESS + "/sessions"));
    $scope.dbConvers = $firebase(new Firebase(ADDRESS + "/conversations"));

    $scope.createSession = function (event) {
        var code = $scope.code.trim();
        var loc = $scope.location.trim();
        var title = $scope.title.trim();
        var limit = $scope.limitNum.trim();
        var descr = $scope.description.trim();
        if (code.length > 0 && loc.length > 0
            && title.length > 0 && limit.length > 0
            && descr.length > 0 && descr.length > 0) {

            $scope.db.$add({
                owner: USER_ID,
                members: [USER_ID],
                courseCode: code,
                location: loc,
                title: title,
                limit: limit,
                description: descr
            });

            var meeting = $scope.db.$getIndex();
            var lastMeeting = meeting[meeting.length - 1];

            $scope.dbConvers.$add({
                sessionId: lastMeeting,
                messages: []
            });

            var conversation = $scope.dbConvers.$getIndex();
            var lastConversation = conversation[conversation.length - 1];

            $scope.db.$child(lastMeeting).$child("conversationId").$set(lastConversation);

            alert("Session was created Successfully");
        } else {
            alert("All of the boxes must be filled");
        }
    }
}

function Cntrl($scope, $location) {
    $scope.changeView = function (view) {
        $location.path(view);
    }
}

function ManageController($scope, $firebase) {

}
function SearchController($scope, $firebase) {

}
function ConversationController($scope, $firebase) {
    $scope.db = $firebase(new Firebase(ADDRESS + "/sessions"));
    $scope.dbConvers = $firebase(new Firebase(ADDRESS + "/conversations"));

    $scope.sessions = [];
    $scope.conversations = [];

    //Init Session and Conversation
    $scope.db.$on('value', function () {
        var meeting = $scope.db.$getIndex();
        for (var i = 0; i < meeting.length; i++) {
            $scope.sessions.push({
                key: meeting[i],
                owner: $scope.db[meeting[i].owner],
                members: $scope.db[meeting[i].members],
                courseCode: $scope.db[meeting[i]].courseCode,
                location: $scope.db[meeting[i]].location,
                title: $scope.db[meeting[i]].title,
                limit: $scope.db[meeting[i]].limitNum,
                description: $scope.db[meeting[i]].description
            });
        }

        var convers = $scope.dbConvers.$getIndex();
        for (var i = 0; i < convers.length; i++) {
            $scope.conversations.push({
                key: convers[i],
                sessionId: $scope.dbConvers[convers[i].sessionId],
                messages: $scope.dbConvers[convers[i].messages]
            });
        }
    });

    $scope.openChat = function (id) {
        var conversationId = getSessionById(id).conversationId;

        alert(conversationId);
    }
}

function getSessionById(id) {
    var result;
    new Firebase(ADDRESS + '/sessions/' + id).once('value', function(snap) {
        result = snap.val();
    });
    return result;
}
function JoinSession($scope, $firebase) {
    //Join Session
}
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}




//Toggling Navigation Bar
$(document).ready(function () {
    //stick in the fixed 100% height behind the navbar but don't wrap it
    $('#slide-nav.navbar .container').append($('<div id="navbar-height-col"></div>'));

    var toggler = '.navbar-toggle';
    var pagewrapper = '#page-content';
    var navigationwrapper = '.navbar-header';
    var menuwidth = '100%'; // the menu inside the slide menu itself
    var slidewidth = '80%';
    var menuneg = '-100%';
    var slideneg = '-80%';

    $("#slide-nav").on("click", toggler, function (e) {

        var selected = $(this).hasClass('slide-active');

        $('#slidemenu').stop().animate({
            left: selected ? menuneg : '0px'
        });

        $('#navbar-height-col').stop().animate({
            left: selected ? slideneg : '0px'
        });

        $(pagewrapper).stop().animate({
            left: selected ? '0px' : slidewidth
        });

        $(navigationwrapper).stop().animate({
            left: selected ? '0px' : slidewidth
        });


        $(this).toggleClass('slide-active', !selected);
        $('#slidemenu').toggleClass('slide-active');


        $('#page-content, .navbar, body, .navbar-header').toggleClass('slide-active');

    });


    var selected = '#slidemenu, #page-content, body, .navbar, .navbar-header';


    $(window).on("resize", function () {

        if ($(window).width() > 767 && $('.navbar-toggle').is(':hidden')) {
            $(selected).removeClass('slide-active');
        }


    });
});

/*
* Write to Firebase with a unique, known key:
 ref.child('users').child('123').set({ "first_name": "rob", "age": 28 })
 Append to lists with an auto-generated key that will automatically sort by time written:
 ref.child('users').push({ "first_name": "rob", "age": 28 })
 Listen for changes in data by its unique, known path:
 ref.child('users').child('123').on('value', function(snapshot) { ... })
 Filter or order data in a list by key or attribute value:
 // Get the last 10 users, ordered by key
 ref.child('users').orderByKey().limitToLast(10).on('child_added', ...)

 // Get all users whose age is >= 25
 ref.child('users').orderByChild('age').startAt(25).on('child_added', ...)
 With the addition of orderByChild(), you no longer need to create your own index for queries on child attributes! For example, to retrieve all users with the name "Alex":

 ref.child('users').orderByChild('name').equalTo('Alex').on('child_added',  ...)
* */