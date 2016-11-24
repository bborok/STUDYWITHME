const ADDRESS = 'https://cmpt106.firebaseio.com/';

//TODO: Distinguish users
const USER_ID = "Somebody";

var studyWitMe = angular.module("StudyWitMe", ['firebase', 'ngRoute']);

studyWitMe.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/searchSession', {
        templateUrl: 'assets/templates/searchSession.html'
    }).when('/newSession', {
        templateUrl: 'assets/templates/newSession.html'
    }).when('/manageSession', {
        templateUrl: 'assets/templates/manageSession.html'
    }).when('/conversations', {
        templateUrl: 'assets/templates/conversations.html'
    }).when('/chat', {
        templateUrl: 'assets/templates/chat.html'
    }).otherwise({
        redirectTo: '/searchSession'
    });
}]);

studyWitMe.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var ref = new Firebase(ADDRESS);
        return $firebaseAuth(ref);
    }
]);

studyWitMe.controller('loginCtrl', ['$scope', '$state', '$http', 'Auth',
    function($scope, $state, $http, Auth) {
        $scope.auth = Auth;
        $scope.auth.$onAuth(function(authData) {
            $scope.authData = authData;
        });
        $scope.login = function() {
            Auth.$authWithPassword({
                email: $scope.email,
                password: $scope.password
            })
                .then(function(authData) {
                    console.log('Logged in as:', authData.uid);
                    //$state.go('profile');
                })
                .catch(function(err) {
                    console.log('error:',err);
                    //$state.go('login');
                });
        };
    }
]);


studyWitMe.factory('shareConversation', function(){
    return { id: 'DEFAULT' };
});
function MessageController($scope, $firebase, shareConversation) {


    alert(shareConversation.id);

    var conversationId = shareConversation.id;


    $scope.dbMessages = $firebase(new Firebase(ADDRESS + "conversations/" + conversationId + "/messages"));

    $scope.dbMessages.$on('value', function () {
        $scope.messages = getMessagesByConversId(conversationId);
    });

    $scope.sendMessage = function (event) {
        if (event.which == 13 || event.keyCode == 13) {
            var textEntered = $scope.message.trim();
            if (textEntered.length > 0) {
                $scope.dbMessages.$add({
                    owner: USER_ID,
                    text: textEntered,
                    date: new Date()
                });
                $scope.messageBox.value = '';
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
function ConversationController($scope, $firebase, shareConversation) {
    $scope.dbSession = $firebase(new Firebase(ADDRESS + "sessions"));
    $scope.dbConvers = $firebase(new Firebase(ADDRESS + "conversations"));

    $scope.sessions = [];
    $scope.conversations = [];
    $scope.messages = [];
    $scope.displayChat = false;

    //Init Session and Conversation
    $scope.dbSession.$on('value', function () {
        var meeting = $scope.dbSession.$getIndex();
        for (var i = 0; i < meeting.length; i++) {
            $scope.sessions.push({
                key: meeting[i],
                owner: $scope.dbSession[meeting[i].owner],
                members: $scope.dbSession[meeting[i].members],
                courseCode: $scope.dbSession[meeting[i]].courseCode,
                location: $scope.dbSession[meeting[i]].location,
                title: $scope.dbSession[meeting[i]].title,
                limit: $scope.dbSession[meeting[i]].limitNum,
                description: $scope.dbSession[meeting[i]].description
            });
        }

        var convers = $scope.dbConvers.$getIndex();
        for (var i = 0; i < convers.length; i++) {
            $scope.conversations.push({
                key: convers[i],
                sessionId: $scope.dbConvers[convers[i].sessionId],
            });
        }
    });

    $scope.openChat = function (id) {
        shareConversation.id = getSessionById(id).conversationId;
        alert(shareConversation.id);
    };
}

//Help Functiones
function getSessionById(id) {
    var result;
    new Firebase(ADDRESS + 'sessions/' + id).once('value', function (snap) {
        result = snap.val();
    });
    return result;
}
function getMessagesByConversId(id) {
    var result;
    new Firebase(ADDRESS + 'conversations/' + id).once('value', function (snap) {
        result = snap.val();
    });
    return result.messages;
}
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

//TODO
function ManageController($scope, $firebase) {

}
function SearchController($scope, $firebase) {

}
function JoinSession($scope, $firebase) {
    //Join Session
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