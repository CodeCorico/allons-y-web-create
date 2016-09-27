'use strict';

module.exports = {
  url: '/create',

  enter: [
    '$FaviconService', '$Page', '$i18nService', '$Layout',
  function($FaviconService, $Page, $i18nService, $Layout) {
    document.title = $i18nService._('Create') + ' - ' + $Page.get('web').brand;
    $FaviconService.update('/public/web-create/favicon.png');

    setTimeout(function() {
      $Layout.require('web-create-layout');
    });
  }],

  exit: ['$next', '$Layout', function($next, $Layout) {
    var WebCreateLayout = $Layout.findChild('name', 'web-create-layout');

    if (!WebCreateLayout) {
      return $next();
    }

    WebCreateLayout.fire('routeExit', $next);
  }]
};
