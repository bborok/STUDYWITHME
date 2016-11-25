const ADDRESS = 'https://cmpt106.firebaseio.com/';

//TODO: Distinguish users
const USER_ID = "Somebody";

angular.module("StudyWitMe", ['firebase', 'ngRoute'])

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
        }).otherwise({
            redirectTo: '/searchSession'
        });
    }])

    .factory('shareConversation', function () {
        return {id: 'DEFAULT'};
    });
