(function() {
  'use strict';
  angular.module('musicode')
    .directive('mcTimeline', mcTimelineDirective);

  function mcTimelineDirective () {
    return {
      link: link,
      scope: {
        tickWidth: '='
      },
      transclude: true,
      templateUrl: 'app/components/musicode/editor/templates/timeline.html'
    };

    function link (scope, element, attributes, controller) {
      // TODO: Move to stylesheet
      element.children('.timeline').css({
        'background-color': 'lightgrey',
        'background-image': 'linear-gradient(90deg, black 1px, transparent 1px)'
      });

      scope.$watch('tickWidth', function (newValue) {
        element.children('.timeline').css('background-size', newValue + 'px');
      });
    }
  }

}());
