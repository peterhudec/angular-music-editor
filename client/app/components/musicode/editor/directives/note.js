(function() {
  'use strict';
  angular.module('musicode')
    .directive('mcNote', ['pitchNames', mcNoteDirective]);

  function mcNoteDirective (pitchNames) {
    return {
      scope: {
        zoomLevel: '=?',
        tickWidth: '=?',
        duration: '=?',
        pitch: '=?'
      },
      controller: ['$scope', controller],
      templateUrl: 'app/components/musicode/editor/templates/note.html',
      link: link
    };

    function controller ($scope) {

    }

    function link (scope, element, attributes, controller) {

      scope.$watch('pitch', function (newValue) {
        scope.pitchName = pitchNames[newValue];
      });

      scope.$watch('zoomLevel', updateElement);
      scope.$watch('tickWidth', updateElement);
      scope.$watch('duration', updateElement);

      function updateElement () {
        var width = scope.tickWidth * scope.zoomLevel * scope.duration;
        element.find('.note').css({
          width: width + 'px'
        })
      }
    }
  }
}());
