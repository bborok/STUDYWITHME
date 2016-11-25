angular.module("StudyWitMe", ['firebase', 'ngRoute'])

    .constant("FB_URL", 'https://cmpt106.firebaseio.com/')

    .config(['$routeProvider', function ($routeProvider) {
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
        }).when('/login', {
            templateUrl: 'assets/templates/login.html',
            // resolve: {
            //     "currentUser": ["userPromise", "$state", function (userPromise, $state) {
            //         return userPromise.getPromise().then(function (success) {
            //             return success;
            //         }, function (reason) {
            //             console.log("userPromise Failed: " + reason);
            //             $state.transitionTo('login');
            //         }, function (notification) {
            //             console.log("notification: " + notification);
            //         });
            //     }]
            // }
        }).otherwise({
            redirectTo: '/login'
        });
    }
    //More configs
    ]);