'use strict';

module.exports = function($done) {
  var path = require('path');

  require(path.resolve(__dirname, 'web-create-service-back.js'))();

  DependencyInjection.injector.controller.get('$WebCreateService').init();

  $done();
};
