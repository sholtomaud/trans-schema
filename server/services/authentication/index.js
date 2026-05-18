var db = require('../../persistence'),
    errors = require('generic-errors'),
    bcrypt = require('bcrypt'),
    crypto = require('crypto'),
    config = require('../../config'),
    kgo = require('kgo');

function getAccount( userName, callback){
    db.Account.get( config.gfcToken, userName, function(error, data){
        if(error || !data){
            return callback( new errors.Unauthorised() );
        }
        callback(null,data)
    });
}


function getControls( loginDetails, callback){
    db.Controls.get( config.gfcToken, loginDetails, function(error, data){
        if(error || !data){
            return callback( new errors.Unauthorised() );
        }
        callback(null,data)
    });
}

function menuControls( menus, controls, callback){
    for (id in menus) {
        var menu = menus[id];
        var menuControls = menu.controls;
        var appControls = [];
        if ( Array.isArray(menu.controls) && menu.controls.length > 0 ){
            for (j in menuControls){
                var controlId = menuControls[j];
                var control = controls[controlId];
                if ( control ){
                    appControls.push(control);    
                }
            }
            menus[id].controls = appControls;    
        }
    }
    callback(null, menus);
}


function getMenus( loginDetails, callback){
    db.Menus.get( config.gfcToken, loginDetails, config.applicationId, function(error, data){
        if(error || !data){
            return callback( new errors.Unauthorised() );
        }
        callback(null,data)
    });
}

function validatePassword(account, password, callback){
    console.log('account',account);
    console.log('password',password);
    if(!account || !account.data.password || !password){
        return callback(new errors.Unauthorised());
    }
    bcrypt.compare(password, account.data.password, function(error, result) {
        if(error || !result){
            var err = new errors.Unauthorised();
            return callback(err);
        }
        callback();
    });
}

function updateToken(account, callback){
    // console.log('not valid', valid);
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
        db.Account.update(config.gfcToken, account.id, accountData, function(error, data){
            if ( error ){
                done(error);
            }
            
            done(null, data)
        });
    })
    (['!token', 'update'], function(update){ 
        callback(null, update); 
    })
    (['*'], function(error){ 
        callback(error); 
    })
}

function login(data, callback){
    kgo
    ({
        userName: data.userName,
        password: data.password
    })
    ('account', ['userName'], getAccount)
    ('valid', ['account', 'password'], validatePassword )
    ('token', ['account', '!valid'], updateToken )
    ('menus', ['token', '!valid'], getMenus )
    ('controls', ['token', '!menus'], getControls )
    ('sessionMenus', ['menus', 'controls'], menuControls )
    (['sessionMenus','token'], function( sessionMenus, token ){
        var session = {};
        session['menus'] = sessionMenus;
        session['token'] = token.token;
        session['loginDetails'] = token;
        callback(null, session );
    })
    (['*'], function(error){ 
        callback(error); 
    })
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
        console.log('createAccount token', token, 'expiry', expiry, 'hash', passwordHash);
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