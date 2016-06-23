angular.module('wpIonic.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('DataLoader', function( $http, $log ) {

  return {
    get: function(url) {
      // Simple index lookup
      return $http.get( url );
    }
  }

})

.factory('backcallFactory', ['$state','$ionicPlatform','$ionicHistory','$timeout',function($state,$ionicPlatform,$ionicHistory,$timeout){
 
var obj={}
    obj.backcallfun=function(){
  
       $ionicPlatform.registerBackButtonAction(function () {
          if ($state.current.name == "app.intro") {
            var action= confirm("Do you want to Exit?");
             if(action){
                navigator.app.exitApp();
              }//no else here just if
      
      }else{
            $ionicHistory.nextViewOptions({
                 disableBack: true
                });
        $state.go('app.intro');
        //go to home page
     }
        }, 100);//registerBackButton
}//backcallfun
return obj;
}])

.factory('Bookmark', function( CacheFactory ) {

  if ( ! CacheFactory.get('bookmarkCache') ) {
    CacheFactory.createCache('bookmarkCache');
  }

  var bookmarkCache = CacheFactory.get( 'bookmarkCache' );

  return {
    set: function(id) {
      bookmarkCache.put( id, 'bookmarked' );
    },
    get: function(id) {
      bookmarkCache.get( id );
      console.log( id );
    },
    check: function(id) {
      var keys = bookmarkCache.keys();
      var index = keys.indexOf(id);
      if(index >= 0) {
        return true;
      } else {
        return false;
      }
    },
    remove: function(id) {
      bookmarkCache.remove(id);
    }
  }

})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
