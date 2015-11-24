(function() {
  'use strict';
  angular.module('musicode')
    .directive('mcNoteEditor', ['$window', 'pitchNames', 'noteUtils', mcNoteEditorDirective]);

  function mcNoteEditorDirective ($window, pitchNames, noteUtils) {
    return {
      scope: {
        onAddBefore: '&',
        onAddAfter: '&',
        zoomLevel: '=?',
        tickWidth: '=?',
        duration: '=?',
        pitch: '=?',
        position: '=?'
      },
      templateUrl: 'app/components/musicode/editor/templates/note-editor.html',
      link: link
    };

    function link (scope, element) {
      scope.pitches = pitchNames;
      // Default values for optional attributes.
      var initalDuration = 1 /scope.zoomLevel;
      scope.duration = angular.isDefined(scope.duration) ? scope.duration : initalDuration;
      scope.pitch = angular.isDefined(scope.pitch) ? scope.pitch : 0;
      scope.position = angular.isDefined(scope.position) ? scope.position : 0;

      var start, width;
      var dragging = false;

      var $win = angular.element($window);
      var $body = angular.element('body');
      var $element = element.find('.note-editor');
      var $resizeHandle = element.find('.resize-handle');

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

          // TODO: Set as option through attributes?
          // Run root digest cycle.
          // scope.$apply();
        }
      });

      function drag (e) {
        e.preventDefault();

        var draggedDistance = e.pageX - start;
        var smoothWidth = width + draggedDistance;
        var smoothEndPosition = scope.position + smoothWidth;
        var smoothEndBetweenTicks = smoothEndPosition + scope.tickWidth / 2
        var remainder = smoothEndBetweenTicks % scope.tickWidth;
        var snappedEndPosition = smoothEndBetweenTicks - remainder;
        var newDiscreteWidth = snappedEndPosition - scope.position;
        var newDuration = newDiscreteWidth / (scope.tickWidth * scope.zoomLevel);

        // Update models
        scope.discreteWidth = newDiscreteWidth;
        scope.duration = newDuration;

        // TODO: Set as option through attributes?
        // Update DOM, but only in this directive.
        // scope.$digest();
        scope.$apply();
      }
    }
  }
}());
