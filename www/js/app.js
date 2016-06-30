// Ionic wpIonic App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'wpIonic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'wpIonic.controllers' is found in controllers.js, wpIoinc.services is in services.js
angular.module('wpIonic', ['ionic','ionic.service.core', 'wpIonic.controllers', 'wpIonic.services', 'wpIonic.filters', 'ngCordova', 'angular-cache'])

.run(function($ionicPlatform, $state, $rootScope, $ionicHistory) {
  $ionicPlatform.ready(function() {
  // Add additional data (data field in the REST API) when you send your notification with yourUrlKey equal to the url you want to navigate to.
  var notificationOpenedCallback = function(jsonData) {
    if (jsonData.additionalData) {
      if (jsonData.additionalData.postid)
      // alert("Notification received:\n" + jsonData.additionalData.postid);
       $state.go('app.post', {'postId': + jsonData.additionalData.postid});
    }
  }
  
  // Update with your OneSignal AppId and googleProjectNumber before running.
  window.plugins.OneSignal.init("243aac30-3905-485e-9c11-1833cc4c99ce",
                                 {googleProjectNumber: "743766706780"},
                                 notificationOpenedCallback);
                                 
  // Back button function
  $ionicPlatform.registerBackButtonAction(function(e){
    if ($rootScope.backButtonPressedOnceToExit) {
      ionic.Platform.exitApp();
    }

    else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    }
    else {
      $rootScope.backButtonPressedOnceToExit = true;
      window.plugins.toast.showShortBottom(
        "Press back button again to exit", function(a){}, function(b){}
      );
      setTimeout(function(){
        $rootScope.backButtonPressedOnceToExit = false;
      },2000);
    }
    e.preventDefault();
    return false;
  },101); 
  

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }  
                                  
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, CacheFactoryProvider) {

  angular.extend(CacheFactoryProvider.defaults, { 
    'storageMode': 'localStorage',
    'capacity': 10,
    'maxAge': 10800000,
    'deleteOnExpire': 'aggressive',
    'recycleFreq': 10000
  })

  // Native scrolling
  if( ionic.Platform.isAndroid() ) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }

  $stateProvider

  // sets up our default state, all views are loaded through here
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.intro', {
    url: "/intro",
    views: {
      'menuContent': {
        templateUrl: "templates/intro.html",
        controller: 'IntroCtrl'
      }
    }
  })

  // this is the first sub view, notice menuContent under 'views', which is loaded through menu.html
  .state('app.posts', {
    url: "/posts",
    views: {
      'menuContent': {
        templateUrl: "templates/posts.html",
        controller: 'PostsCtrl'
      }
    }
  })
  
 // this is the first sub view, notice menuContent under 'views', which is loaded through menu.html
  .state('app.categories', {
    url: "/categories",
    views: {
      'menuContent': {
        templateUrl: "templates/categories.html",
        controller: 'CategoriesCtrl'
      }
    }
  })  

  .state('app.bookmarks', {
    url: "/bookmarks",
    views: {
      'menuContent': {
        templateUrl: "templates/bookmarks.html",
        controller: 'BookmarksCtrl'
      }
    }
  })

  .state('app.post', {
    url: "/posts/:postId",
    views: {
      'menuContent': {
        templateUrl: "templates/post.html",
        controller: 'PostCtrl'
      }
    }
  })
  
  .state('app.category', {
    url: "/categories/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "templates/category.html",
        controller: 'CategoryCtrl'
      }
    }
  })
  
  .state('app.custom', {
    url: "/custom",
    views: {
      'menuContent': {
        templateUrl: "templates/custom.html"
      }
    }
  })

  .state('app.tabs', {
    url: "/tabs",
    views: {
      'menuContent': {
        templateUrl: "templates/tabs.html",
        controller: 'TabsCtrl'
      }
    }
  })

  .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent': {
          templateUrl: "templates/settings.html"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/intro');
})
.directive('ionItemAccordion', function($log) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    require: '^ionList',
    scope: {
      title: '@',
      iconClose: '@',
      iconOpen: '@',
      iconAlign: '@'
    },
    template: '<div><ion-item ng-class="classItem()" ng-click="toggleGroup(id)" ng-class="{active: isGroupShown(id)}">' +
      '<i class="icon" ng-class="classGroup(id)"></i>' +
      '&nbsp;' +
      '{{title}}' +
      '</ion-item>' +
      '<ion-item class="item-accordion" ng-show="isGroupShown(id)"><ng-transclude></ng-transclude></ion-item></div>',
    link: function(scope, element, attrs, ionList) {

      // link to parent
      if (!angular.isDefined(ionList.activeAccordion)) ionList.activeAccordion = false;
      if (angular.isDefined(ionList.counterAccordion)) {
        ionList.counterAccordion++;
      } else {
        ionList.counterAccordion = 1;
      }
      scope.id = ionList.counterAccordion;

      // set defaults
      if (!angular.isDefined(scope.id)) $log.error('ID missing for ion-time-accordion');
      if (!angular.isString(scope.title)) $log.warn('Title missing for ion-time-accordion');
      if (!angular.isString(scope.iconClose)) scope.iconClose = 'ion-minus';
      if (!angular.isString(scope.iconOpen)) scope.iconOpen = 'ion-plus';
      if (!angular.isString(scope.iconAlign)) scope.iconAlign = 'left';

      scope.isGroupShown = function() {
        return (ionList.activeAccordion == scope.id);
      };

      scope.toggleGroup = function() {
        $log.debug('toggleGroup');
        if (ionList.activeAccordion == scope.id) {
          ionList.activeAccordion = false;
        } else {
          ionList.activeAccordion = scope.id;
        }
      };

      scope.classGroup = function() {
        return (ionList.activeAccordion == scope.id) ? scope.iconOpen : scope.iconClose;
      };

      scope.classItem = function() {
        return 'item-stable ' + (scope.iconAlign == 'left' ? 'item-icon-left' : 'item-icon-right');
      };
    }

  };
});
