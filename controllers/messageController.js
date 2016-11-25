angular.module("StudyWitMe")
    .controller("MessageController", function ($scope, $firebase, shareConversation) {

        //Get conversation id from user selection
        var conversationId = shareConversation.id;

        $scope.dbMessages = $firebase(new Firebase(ADDRESS + "conversations/" + conversationId + "/messages"));
        $scope.messagesExist = false;

        $scope.dbMessages.$on('value', function () {
            $scope.messages = getMessagesByConversId(conversationId);
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
    });

function getMessagesByConversId(id) {
    var result;
    new Firebase(ADDRESS + 'conversations/' + id).once('value', function (snap) {
        result = snap.val();
    });
    return result.messages;
}