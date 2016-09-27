module.exports = function() {
  'use strict';

  DependencyInjection.service('$WebCreateService', function($AbstractService, $RealTimeService) {

    return new (function $WebCreateService() {

      var REALTIME_EVENTS = {
            'web-create-links': {
              call: 'callCreateLinks'
            }
          },

          async = require('async'),
          extend = require('extend'),
          _this = this,
          _sectionsFuncs = [],
          _sections = [];

      $AbstractService.call(this);

      this.init = function() {
        Object.keys(REALTIME_EVENTS).forEach(function(eventName) {
          if (REALTIME_EVENTS[eventName].call) {
            var call = REALTIME_EVENTS[eventName].call;

            REALTIME_EVENTS[eventName].call = function() {
              _this[call].apply(_this, arguments);
            };
          }
        });

        $RealTimeService.registerEvents(REALTIME_EVENTS);
      };

      this.links = function(sectionTitle, links) {
        if (typeof sectionTitle == 'function') {
          _sectionsFuncs.push(sectionTitle);

          return;
        }

        var section = null;

        for (var i = 0; i < _sections.length; i++) {
          if (_sections[i].title == sectionTitle) {
            section = _sections[i];

            break;
          }
        }

        if (!section) {
          section = {
            title: sectionTitle,
            links: []
          };

          _sections.push(section);
        }

        links = Array.isArray(links) ? links : [links];

        section.links = section.links.concat(links);
      };

      this.callCreateLinks = function($socket, eventName, args, callback) {
        var sockets = $socket ? [$socket] : $RealTimeService.socketsFromOrigin('web-create-links'),
            sections = extend(true, [], _sections);

        if (!sockets.length) {
          if (callback) {
            callback();
          }

          return;
        }

        async.eachSeries(_sectionsFuncs, function(func, nextFunc) {

          func(sockets, sections, nextFunc);

        }, function() {
          $RealTimeService.fire(eventName, {
            sections: sections
          }, $socket);

          if (callback) {
            callback();
          }
        });
      };

    })();

  });

};
