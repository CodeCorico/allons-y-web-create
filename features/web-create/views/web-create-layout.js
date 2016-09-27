(function() {
  'use strict';

  window.Ractive.controllerInjection('web-create-layout', [
    '$RealTimeService', '$component', '$data', '$done',
  function webCreateLayoutController(
    $RealTimeService, $component, $data, $done
  ) {
    var WebCreateLayout = $component({
      data: $data
    });

    $RealTimeService.realtimeComponent('webCreate', {
      name: 'web-create-links',
      update: function(event, args) {
        if (!WebCreateLayout || !args) {
          return;
        }

        args.sections = args.sections || [];

        WebCreateLayout.set('sections', args.sections);
      }
    }, 'web-create-links');

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
