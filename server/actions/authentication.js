var services = require('../services'),
    addAction = require('./addAction');

var authenticationActions = {};

// console.log('services.authentication', services);

addAction(authenticationActions, services.authentication.login, 'authentication.login', true);
addAction(authenticationActions, services.authentication.createAccount, 'authentication.createAccount', true);

module.exports = authenticationActions;




