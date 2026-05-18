var db = require('../../persistence'),
    errors = require('generic-errors'),
    bcrypt = require('bcrypt'),
    crypto = require('crypto'),
    config = require('../../config'),
    kgo = require('kgo');

function getControls( userName, callback){
    db.Controls.get( config.gfcToken, userName, function(error, data){
        if(error || !data){
            var err = new errors.Unauthorised();
            console.log('err: ', err);
            return callback(new errors.Unauthorised());
        }
        callback(null,data)
    });
}

function validatePassword(account, password, callback){
    if(!account || !account.data.password || !password){
        return callback(new errors.Unauthorised());
    }
    
    bcrypt.compare(password, account.data.password, function(error, result) {
        if(error || !result){
            var err = new errors.Unauthorised();
            console.log('err: ', err);
            return callback(new errors.Unauthorised());
        }
        callback();
    });
}

function updateToken(account, valid, callback){
    kgo
    ({
        account: account
    })
    ('token', generateToken)
    ('expiry', generateExpiry)
    ('update', ['account', 'token','expiry'], function(account, token, expiry, done){
        var accountData = {},
            data = {};
        data = account.data;
        data.tokenExpiry = expiry;
        data.token = token;
        accountData['data'] = data;
        accountData['schemaId'] = account.schemaId;
        db.Account.update(config.gfcToken, account.id, accountData, callback);
    })
    (['token', '!update'], callback.bind(null, null) )
    // .on('error', function(error){
    //     callback(error);
    // });
}

function login(data, callback){
    kgo
    ({
        userName: data.userName,
        password: data.password
    })
    ('account', ['userName'], getAccount)
    ('valid', ['account', 'password'], validatePassword )
    ('token', ['account', 'valid'], updateToken)
    (['token'], function(account, done){
        delete account.password;
        callback(null, account );
    })
    // .on('error', function(error){
    //     callback(error);
    // });
}

function generateToken(callback){
    crypto.randomBytes(16, function(error, token) {
        if (error || !token) {
            return callback(error || new Error('Problem when generating token'));
        }

        callback(null, token.toString('hex'));
    });
}

function validateToken(token, callback){
    db.Account.validate(
        {
            token: token,
            tokenExpiry: {
                $gt: Date.now()
            },
            enabled: true
        },
        callback
    );
}

function generateExpiry(callback){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    callback(null, expiry);
}

function createAccount(accountData, callback){
    kgo
    ({
        password: accountData.password,
        rounds: 12
    })
    ('passwordHash', ['password', 'rounds'], bcrypt.hash)
    ('token', generateToken )
    ('expiry', generateExpiry )
    ('saved',['passwordHash','token', 'expiry'], function(passwordHash, token, expiry, done){
        var account = {};
        accountData.password = passwordHash;
        accountData.userAccessLevel = Number(accountData.userAccessLevel);
        accountData.tokenExpiry = expiry;
        accountData.token = token;
        account['data'] = accountData;
        account['schemaId'] = config.accountsSchemaId;
        db.Account.create(config.gfcToken, account, callback);
    })
    (['token', '!saved'], callback.bind(null, null) )
    // .on('error', function(error){
    //     callback(error);
    // });
}

module.exports = {
    validateToken: validateToken,
    login: login,
    createAccount: createAccount
};