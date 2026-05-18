var services = require('../services'),
    addAction = require('./addAction');

var translationActions = {};

addAction(translationActions, services.translation.get, 'translation.get');
addAction(translationActions, services.translation.getAll, 'translation.getAll');
addAction(translationActions, services.translation.create, 'translation.create');
addAction(translationActions, services.translation.update, 'translation.update');
addAction(translationActions, services.translation.remove, 'translation.remove');

module.exports = translationActions;