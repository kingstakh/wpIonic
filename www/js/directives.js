angular.module('wpIonic.directives', [])

/**
 * Accordion list directive.
 */

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
