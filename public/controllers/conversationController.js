const USER_ID = "Somebody";

angular.module("StudyWitMe", ['firebase', 'ngRoute'])
    .constant("FB_URL", 'https://cmpt106.firebaseio.com/')
    .factory('shareConversation', function () {
        return {id: 'DEFAULT'};
    })
    // .config(['$routeProvider', function ($routeProvider) {
    //     $routeProvider.when('/conversation', {
    //         templateUrl: '/public/assets/templates/conversations.html'
    //     }).when('/chat', {
    //         templateUrl: '/public/assets/templates/chat.html'
    //     })
    //     .otherwise({
    //          redirectTo: '/conversations'
    //     });
    // }
    // ])
    .controller("ConversationController", function ($scope, $firebase, shareConversation, FB_URL) {
        $scope.displayChat = false;
        $scope.dbSession = $firebase(new Firebase(FB_URL + "sessions"));
        $scope.dbConvers = $firebase(new Firebase(FB_URL + "conversations"));

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
            //Send conversation id of the picked session
            shareConversation.id = getSessionById(FB_URL, id).conversationId;
            $scope.displayChat = true;

            // })
            // .controller("MessageController", function ($scope, $firebase, shareConversation, FB_URL) {

            //Get conversation id from user selection
            var conversationId = shareConversation.id;

            $scope.dbMessages = $firebase(new Firebase(FB_URL + "conversations/" + conversationId + "/messages"));
            $scope.messagesExist = false;

            $scope.dbMessages.$on('value', function () {
                $scope.messages = getMessagesByConversId(FB_URL, conversationId);
                $scope.messagesExist = $scope.messages.length != 0;
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
                        $scope.message = "";
                        $scope.messageBox.value = '';
                    }
                }
            }

        };
    });

function getMessagesByConversId(FB_URL, id) {
    var result;
    new Firebase(FB_URL + 'conversations/' + id).once('value', function (snap) {
        result = snap.val();
    });
    return result.messages;
}

function getSessionById(FB_URL, id) {
    var result;
    new Firebase(FB_URL + 'sessions/' + id).once('value', function (snap) {
        result = snap.val();
    });
    return result;
}



