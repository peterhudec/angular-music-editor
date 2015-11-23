(function() {
  'use strict';
  angular.module('musicode')
    .directive('mcEditor', mcEditorDirective)
    .directive('mcTimeline', mcTimelineDirective)
    .directive('mcTrack', mcTrackDirective)
    .directive('mcNote', ['pitchNames', mcNoteDirective])
    .directive('mcNoteEditor', ['pitchNames', 'noteUtils', mcNoteEditorDirective]);

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
      $scope.tickWidth = 80;
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

  function mcTrackDirective () {
    return {
      scope: {
        tickWidth: '=',
        zoomLevel: '='
      },
      controller: ['$scope', controller],
      link: link,
      templateUrl: 'app/components/musicode/editor/templates/track.html'
    };

    function controller ($scope) {

    }

    function link (scope, element, attributes, controller) {
      element.children('div').css({
        'background-color': 'rgba(230, 255, 200, .5)',
        'margin-bottom': '5px',
        'height': '40px'
      });
    }
  }

  function mcNoteDirective (pitchNames) {
    return {
      scope: {
        zoomLevel: '=',
        tickWidth: '=',
        duration: '=',
        pitch: '='
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

  function mcNoteEditorDirective (pitchNames, noteUtils) {
    return {
      scope: {
        zoomLevel: '=',
        tickWidth: '=',
        duration: '=',
        pitch: '='
      },
      controller: ['$scope', controller],
      templateUrl: 'app/components/musicode/editor/templates/note-editor.html',
      link: link
    };

    function controller ($scope) {
      $scope.pitches = pitchNames;
      $scope.distance = 0;
      $scope.smoothWidth = noteUtils.getWidth($scope) + $scope.distance;
      $scope.discreteWidth = $scope.smoothWidth;
    }

    function link (scope, element, attributes, controller) {

      // TODO: Use $window service.
      var $window = $(window);
      var $resizeHandle = element.find('.resize');
      var $d = element.find('.discrete-indicator');

      scope.$watchGroup(['zoomLevel', 'tickWidth', 'duration'], function (newVal, oldVal) {
        console.log('zl changed');
        scope.smoothWidth = noteUtils.getWidth(scope) + scope.distance;
        scope.discreteWidth = scope.smoothWidth;
        // console.log('zl changed', $scope.discreteWidth);
      });

      $resizeHandle.css('width', scope.smoothWidth);
      $d.css('width', scope.discreteWidth);

      var dragging = false;
      var start = 0;
      var smoothWidth = scope.smoothWidth;

      element.find('.resize-handle').on('mousedown', function (e) {
        dragging = true;
        start = e.pageX;
        smoothWidth = scope.smoothWidth;
        console.log('start drag', e.target, e);
        $window.on('mousemove', drag);
      });

      $window.on('mouseup', function (e) {
        if (dragging) {
          console.log('end drag');
          $window.off('mousemove', drag);
          dragging = false;
          smoothWidth = scope.smoothWidth;
          scope.distance = 0;
          scope.$apply();
        }
      });

      scope.$watch('discreteWidth', function (newVal) {
        console.log('discrete width changed', newVal);
        $resizeHandle.css('width', scope.discreteWidth);
        $d.css('width', scope.discreteWidth);
      });

      function drag (e) {
        e.preventDefault();
        scope.distance = e.pageX - start;


        scope.smoothWidth = smoothWidth + scope.distance;
        scope.discreteWidth = Math.round(scope.smoothWidth / scope.tickWidth) * scope.tickWidth;


        // $resizeHandle.css('width', scope.discreteWidth);
        // $d.css('width', scope.discreteWidth);

        scope.duration = scope.discreteWidth / (scope.tickWidth * scope.zoomLevel);
        scope.$digest();
      }
    }
  }
}());
