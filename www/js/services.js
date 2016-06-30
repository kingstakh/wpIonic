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

.factory('Bookmark', function( CacheFactory ) {

  if ( ! CacheFactory.get('bookmarkCache') ) {
    CacheFactory.createCache('bookmarkCache');
  }

  var bookmarkCache = CacheFactory.get( 'bookmarkCache' );

  return {
    set: function(id) {
      bookmarkCache.put( id, 'bookmarked' );
      window.plugins.toast.showShortCenter(
        "Bookmarked", function(a){}, function(b){}
      );
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
      window.plugins.toast.showShortCenter(
        "Removed", function(a){}, function(b){}
      );      
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
