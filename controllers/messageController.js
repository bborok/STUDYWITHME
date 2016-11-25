const USER_ID = "Somebody";

angular.module("StudyWitMe")
    .controller("MessageController", function ($scope, $firebase, shareConversation, FB_URL) {

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
    });

function getMessagesByConversId(FB_URL, id) {
    var result;
    new Firebase(FB_URL + 'conversations/' + id).once('value', function (snap) {
        result = snap.val();
    });
    return result.messages;
}