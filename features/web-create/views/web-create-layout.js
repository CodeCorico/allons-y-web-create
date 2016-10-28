(function() {
  'use strict';

  window.Ractive.controllerInjection('web-create-layout', [
    '$RealTimeService', '$component', '$data', '$done',
  function webCreateLayoutController(
    $RealTimeService, $component, $data, $done
  ) {
    var WebCreateLayout = $component({
      data: $.extend(true, {
        loaded: false
      }, $data)
    });

    function _createCookie(newCookieData) {
      if (newCookieData) {
        window.Cookies.set('web.create', newCookieData, {
          expires: 365,
          path: '/'
        });
      }

      return window.Cookies.getJSON('web.create') || {
        s: []
      };
    }

    function _orderSections(sections) {
      sections = typeof sections == 'undefined' ? WebCreateLayout.get('sections') : sections;

      var createCookie = _createCookie();

      sections.sort(function(a, b) {
        var aOrder = createCookie.s.indexOf(a.title),
            bOrder = createCookie.s.indexOf(b.title);

        aOrder = aOrder > -1 ? aOrder : 99999999;
        bOrder = bOrder > -1 ? bOrder : 99999999;

        if (aOrder < bOrder) {
          return -1;
        }

        if (aOrder > bOrder) {
          return 1;
        }

        if (a.title < b.title) {
          return -1;
        }

        if (a.title > b.title) {
          return 1;
        }

        return 0;
      });

      WebCreateLayout.set('sections', sections);
    }

    $RealTimeService.realtimeComponent('webCreate', {
      name: 'web-create-links',
      update: function(event, args) {
        WebCreateLayout.set('loaded', true);

        if (!WebCreateLayout || !args) {
          return;
        }

        args.sections = args.sections || [];

        _orderSections(args.sections);
      }
    }, 'web-create-links');

    WebCreateLayout.on('linkOpened', function(event) {
      var index = event.keypath.split('.')[1],
          title = WebCreateLayout.get('sections.' + index + '.title'),
          createCookie = _createCookie(),
          oldPosition = createCookie.s.indexOf(title);

      if (oldPosition > -1) {
        createCookie.s.splice(oldPosition, 1);
      }

      createCookie.s.unshift(title);

      _createCookie(createCookie);
    });

    WebCreateLayout.on('routeExit', function($next) {
      $RealTimeService.unregisterComponent('webCreate');
      WebCreateLayout.set('teardown', true);

      setTimeout(function() {
        WebCreateLayout.teardown();
        WebCreateLayout = null;

        $next();
      }, 250);
    });

    WebCreateLayout.require().then($done);
  }]);

})();
