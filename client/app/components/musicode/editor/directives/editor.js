(function() {
  'use strict';
  angular.module('musicode')
    .directive('mcEditor', mcEditorDirective);

  function mcEditorDirective () {
    return {
      scope: {
        foo: '=',
        save: '&onSave'
      },
      controller: ['$scope', controller],
      link: link,
      // TODO: Make the URL relative.
      templateUrl: 'app/components/musicode/editor/templates/editor.html'
    };

    function link (scope, element, attrs, controller, transcludeFn) {
      console.log('link', scope, element, attrs, controller, transcludeFn);
    }

    function controller ($scope) {
      $scope.zoomLevel = 1;
      $scope.tickWidth = 20;
      $scope.tracks = [];

      $scope.zoomIn = zoomIn;
      $scope.zoomOut = zoomOut;
      $scope.addTrack = addTrack;

      function zoomIn () {
        $scope.zoomLevel *= 2;
      }

      function zoomOut () {
        $scope.zoomLevel /= 2;
      }

      function addTrack () {
        $scope.tracks.push({});
      }
    }
  }

}());
