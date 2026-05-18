var gfc = require('gfc-node')();

function get( gfcToken, userName, callback){
    var where = {};
    where['userName'] = {$regex : "^" + userName + "$"};

    gfc.records.getAll(
        gfcToken,
        {
            skip: 0,
            limit: 1,
            query: {
                where: where 
            }
        },
        function(error, users){
            if(error){
                return callback(error);
            }

            if(typeof users != "undefined" && users != null && users.length > 0){
                var userId = users[0];
                userId.data._id = userId.id;
                callback(null, userId );    
            }
            else{
                return callback('There is no user by that name, please register.');    
            }
            
        }
    );
}

function validate( gfcToken, token, callback){
    var where = {};
    where['token'] = {$regex : "^" + token + "$"};

    gfc.records.getAll(
        gfcToken,
        {
            skip: 0,
            limit: 1,
            query: {
                where: where 
            }
        },
        function(error, userId){
            if(error){
                return callback(error);
            }
            
            callback(null, userId.map(function(userId){
                userId.data._id = userId.id;
                return userId.data;
            }));
            
        }
    );
}

function create( gfcToken, recordData, callback){
    console.log('create gfcToken', gfcToken);
    console.log(' recordData', recordData);
    gfc.records.create(
        gfcToken,
        recordData,
        function(error, userId){
            if(error){
                console.log('crate callback error: ',error);
                return callback(error);
            }
            delete userId.data.password;
            userId.data._id = userId.id;

            console.log('return userId', userId);

            callback(null, userId.data );
        }
    );
}

function update(gfcToken, accountId, accoundData, callback){
    gfc.records.update(
        gfcToken,
        accountId,
        accoundData,
        function(error, loginId){
            if(error){
                return callback(error);
            }
            loginId.data._id = loginId.id;
            callback(null, loginId.data);
        }
    );
}

module.exports = {
    get: get,
    validate: validate,
    create: create,
    update: update
};





//This was created prior to thinking that NRDS users authentication are just GFC records.

// function create( userData, callback){
//     gfc.accounts.create(
//         gfcToken,
//         recordData,
//         function(error, token){
//             if(error){
//                 return callback(error);
//             }
//             token.data._id = token.id;
//             callback(null, token);
//         }
//     );
// }

// function login( loginId, callback){
//     gfc.accounts.login(
//         loginId,
//         function(error, token){
//             if(error){
//                 return callback(error);
//             }
//             token.data._id = token.id;
//             callback(null, token);
//         }
//     );
// }

// module.exports = {
//     login: login,
//     create: create
// };