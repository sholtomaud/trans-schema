var JaySchema = require('jayschema'),
    jayschema = new JaySchema(),
    normaliseErrors = require('jayschema-error-messages'),
    schemas = require('./schemas'),
    access = require('../access');

function validateSchema(args, schema, callback){
    jayschema.validate(args, schema, function(error){
        if (error) {
            return callback(normaliseErrors(error));
        }

        callback();
    });
}

module.exports = function(actions, target, action, unsecured) {
    actions[action] = function(account, args, callback) {

        if (unsecured === true) {
            validateSchema(args, schemas[action], function(error){
                if(error){
                    return callback(error);
                }

                target.apply(null, args.concat(callback));
            });
            return;
        }

        access.checkPermission(account.id, action, function(error) {
            if (error) {
                return callback(error);
            }

            validateSchema(args, schemas[action], function(error){
                if(error){
                    return callback(error);
                }

                args.unshift(account);

                target.apply(null, args.concat(callback));
            });
        });
    };
};
