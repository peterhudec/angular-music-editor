(function() {
  'use strict';
  angular.module('musicode')
    .directive('mcEditor', mcEditorDirective)
    .directive('mcTimeline', mcTimelineDirective)
    .directive('mcTrack', mcTrackDirective)
    .directive('mcNote', ['pitchNames', mcNoteDirective])
    .directive('mcNoteEditor', ['$window', 'pitchNames', 'noteUtils', mcNoteEditorDirective]);

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

  function mcNoteEditorDirective ($window, pitchNames, noteUtils) {
    return {
      scope: {
        zoomLevel: '=',
        tickWidth: '=',
        duration: '=',
        pitch: '='
      },
      templateUrl: 'app/components/musicode/editor/templates/note-editor.html',
      link: link
    };

    function link (scope, element) {
      var start, width;
      var dragging = false;

      var $win = angular.element($window);
      var $body = angular.element('body');
      var $element = element.find('.note-editor');
      var $resizeHandle = element.find('.resize-handle');

      scope.pitches = pitchNames;

      scope.$watchGroup(['zoomLevel', 'tickWidth', 'duration'], function () {
        scope.discreteWidth = noteUtils.getWidth(scope);
      });

      $resizeHandle.on('mousedown', function (e) {
        dragging = true;
        start = e.pageX;
        width = scope.discreteWidth;
        $win.on('mousemove', drag);

        $element.addClass('dragging');
        $body.addClass('dragging-note');
      });

      $win.on('mouseup', function (e) {
        if (dragging) {
          $win.off('mousemove', drag);
          dragging = false;
          width = scope.discreteWidth;

          $element.removeClass('dragging');
          $body.removeClass('dragging-note');

          // Run root digest cycle.
          scope.$apply();
        }
      });

      function drag (e) {
        e.preventDefault();

        var smoothWidth = width + e.pageX - start;
        var numberOfTicks = Math.round(smoothWidth / scope.tickWidth);
        var newDiscreteWidth = numberOfTicks * scope.tickWidth;
        var newDuration = newDiscreteWidth / (scope.tickWidth * scope.zoomLevel);

        // Update models
        scope.discreteWidth = newDiscreteWidth;
        scope.duration = newDuration;
        // Update DOM, but only in this directive.
        scope.$digest();
      }
    }
  }
}());
