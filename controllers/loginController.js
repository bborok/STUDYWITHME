angular.module("StudyWitMe")
    .controller("loginCtrl", function ($scope, $firebase, FB_URL) {

        var ref = new Firebase(FB_URL);

        $scope.signUp = function () {

            alert("Clicked");

            ref.createUser({
                    email: self.email,
                    password: self.password
                },
                function (error, userData) {
                    if (error) {
                        console.log("Error creating a user: ", error);
                    } else {
                        console.log("Successfully created user account with uid: ", userData.uid);
                        console.log("User data: ", userData);
                    }
                });
        }
    });