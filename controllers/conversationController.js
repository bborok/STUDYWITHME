angular.module("StudyWitMe")
    .controller("ConversationController", function ($scope, $firebase, shareConversation) {
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
            //Send conversation id of the picked session
            shareConversation.id = getSessionById(id).conversationId;
        };
    });

function getSessionById(id) {
    var result;
    new Firebase(ADDRESS + 'sessions/' + id).once('value', function (snap) {
        result = snap.val();
    });
    return result;
}
