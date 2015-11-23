(function() {
  'use strict';
  angular.module('musicode', [])
    .service('oneWayBinding', function () {
      return {
        bindOne: bindOne,
        bindAll: bindAll
      };

      function bindOne (scope, attributes, name, _default, callback) {
        if (attributes.hasOwnProperty(name)) {
          scope.$watch(attributes[name], function (newValue) {
            scope[name] = newValue;
            callback();
          })
        } else {
          scope[name] = _default;
        }
      }

      function bindAll (scope, attributes, values) {
        for (var key in values) {
          var val = values[key];
          var _default = val[0];
          var callback = val[1];
          bindOne(scope, attributes, key, _default, callback);
        }
      }
    })
    .service('noteUtils', function () {
      return {
        getWidth: getWidth
      };

      function getWidth (opts) {
        return opts.tickWidth * opts.zoomLevel * opts.duration;
      }
    })
    .value('pitchNames', [
      'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'
    ]);
}());
