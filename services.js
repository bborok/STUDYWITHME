angular.module("StudyWitMe")

    .factory('shareConversation', function () {
        return {id: 'DEFAULT'};
    })

    .factory("simpleLogin", ["$firebaseSimpleLogin", "$firebase", "FB_URL", function($firebaseSimpleLogin, $firebase, FB_URL){
        var ref = new Firebase(FB_URL);
        var authProvider = $firebaseSimpleLogin(ref);
        return authProvider;
    }]);

    // .factory("userPromise", ["simpleLogin", "$firebase", "$q", "FB_URL", function(simpleLogin, $firebase, $q, FB_URL) {
    //     //function returnPromise will generate a promise that will get the authenticated user, make a profile if it doesn't exist,
    //     //and then return both objects on resolution.
    //     var returnPromise = function(){
    //         var user, publicUser;
    //         var deferred = $q.defer();
    //
    //         //this function will take a user object and check for existing profile "publicUser" and create it if not
    //         var getPublicUser = function(auth_user){
    //             var ref = new Firebase(FB_URL);
    //             var remoteUser = $firebase(ref.child('users').child(auth_user.uid)).$asObject();
    //             remoteUser.$loaded().then(function(){
    //                 if (remoteUser.profile){
    //                     deferred.notify('Existing public profile');
    //                     publicUser = remoteUser;
    //                     deferred.resolve({user: user, publicUser: publicUser});
    //                 } else {
    //                     deferred.notify('New user - initializing profile');
    //                     remoteUser.displayName = auth_user.displayName;
    //                     remoteUser.provider = auth_user.provider;
    //                     remoteUser.provider_id = auth_user.id;
    //                     remoteUser.provider_username = auth_user.username;
    //                     remoteUser.profile_img_url = auth_user.thirdPartyUserData.profile_image_url;
    //                     remoteUser.profile = {};
    //                     remoteUser.$save(function(){console.log('successfully saved')});  //save to firebase
    //                     publicUser = remoteUser;
    //                     deferred.resolve({user: user, publicUser: publicUser});
    //                 }
    //             });
    //         };
    //
    //         //get the authenticated user
    //         simpleLogin.$getCurrentUser().then(function(userData){
    //             if(userData){
    //                 deferred.notify('User ' + userData.id + " successfully logged in through simpleLogin");
    //                 user = userData;
    //                 //if authenticated, get the public object
    //                 getPublicUser(userData);
    //             } else {
    //                 deferred.reject('Not authenticated')
    //             }
    //         });
    //
    //         //return promise
    //         return deferred.promise;
    //     };
    //     //return function to generate the promise. We return a function instead of
    //     //the promise directly so they can regenerate the promise if they fail authentication.
    //     return {getPromise: returnPromise};
    //
    // }]);
