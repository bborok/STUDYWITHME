angular.module("StudyWitMe")
    .controller("CreateController", function ($scope, $firebase, FB_URL) {
        $scope.db = $firebase(new Firebase(FB_URL + "/sessions"));
        $scope.dbConvers = $firebase(new Firebase(FB_URL + "/conversations"));

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
    });