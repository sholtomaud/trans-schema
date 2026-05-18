var services = require('../services'),
    addAction = require('./addAction');

var recordActions = {};

addAction(recordActions, services.record.get, 'record.get');
addAction(recordActions, services.record.getWithView, 'record.getWithView');
addAction(recordActions, services.record.getAll, 'record.getAll');
addAction(recordActions, services.record.create, 'record.create');
addAction(recordActions, services.record['import'], 'record.import');
addAction(recordActions, services.record.update, 'record.update');
addAction(recordActions, services.record.remove, 'record.remove');

module.exports = recordActions;