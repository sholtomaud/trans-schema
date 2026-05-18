var services = require('../services'),
    addAction = require('./addAction');

var schemaActions = {};

addAction(schemaActions, services.schema.get, 'schema.get');
addAction(schemaActions, services.schema.getAll, 'schema.getAll');
addAction(schemaActions, services.schema.create, 'schema.create');
addAction(schemaActions, services.schema.update, 'schema.update');
addAction(schemaActions, services.schema.remove, 'schema.remove');

module.exports = schemaActions;