(function() {
  'use strict';
  angular.module('musicode')
    .directive('mcTrack', ['noteUtils', mcTrackDirective]);

  function mcTrackDirective (noteUtils) {
    return {
      scope: {
        tickWidth: '=?',
        zoomLevel: '=?'
      },
      controller: ['$scope', controller],
      link: link,
      templateUrl: 'app/components/musicode/editor/templates/track.html'
    };

    function controller ($scope) {
      $scope.notes = [
        {
          pitch: 0,
          duration: 1
        },
        {
          pitch: 4,
          duration: 3
        },
        {
          pitch: 7,
          duration: 2
        },
      ];

      $scope.getPosition = function (idx) {
        var currentNote = $scope.notes[idx];
        if (idx) {
          var previousNote = $scope.notes[idx - 1];

          var previousWidth = noteUtils.getWidth({
            tickWidth: $scope.tickWidth,
            zoomLevel: $scope.zoomLevel,
            duration: previousNote.duration
          });

          currentNote.position = previousNote.position + previousWidth;
        } else {
          currentNote.position = 0
        }
        return currentNote.position;
      }
    }

    function link (scope, element, attributes, controller) {
      // element.children('div').css({
      //   'background-color': 'rgba(230, 255, 200, .5)',
      //   'margin-bottom': '5px',
      //   'height': '40px'
      // });
    }
  }

}());
