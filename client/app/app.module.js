(function () {
  'use strict';
  angular.module('musicodeApp', ['musicode'])
    .controller('myController', [myController]);

  function myController () {
    this.foo = 111;
    this.onEditorSave = onEditorSave;

    function onEditorSave (result) {
      console.log('editor saved', result);
    }

  }
})();
