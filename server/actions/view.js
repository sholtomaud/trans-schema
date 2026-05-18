var services = require('../services'),
    addAction = require('./addAction');

var viewActions = {};

addAction(viewActions, services.view.get, 'view.get');
addAction(viewActions, services.view.create, 'view.create');
addAction(viewActions, services.view.update, 'view.update');
addAction(viewActions, services.view.remove, 'view.remove');

module.exports = viewActions;