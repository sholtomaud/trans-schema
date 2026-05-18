var services = require('../services'),
    addAction = require('./addAction');

var siteActions = {};

addAction(siteActions, services.site.get, 'site.get');
addAction(siteActions, services.site.getWithView, 'site.getWithView');
addAction(siteActions, services.site.getAllSites, 'site.getAllSites');
addAction(siteActions, services.site.create, 'site.create');
addAction(siteActions, services.site['import'], 'site.import');
addAction(siteActions, services.site.update, 'site.update');
addAction(siteActions, services.site.remove, 'site.remove');

module.exports = siteActions;