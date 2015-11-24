(function() {
  'use strict';
  angular.module('musicode')
    .service('noteUtils', noteUtils);

    function noteUtils () {
      return {
        getWidth: getWidth
      };

      function getWidth (opts) {
        return opts.tickWidth * opts.zoomLevel * opts.duration;
      }
    }
}());
