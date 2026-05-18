var logger = require('../logger'),
    retorter = require('./retorter')(logger),
    actions = require('../actions'),
    requestData = require('request-data'),
    wraperr = require('wraperr'),
    FileServer = require('file-server'),
    fileServer = new FileServer(function(error, request, response){
        retorter.error(request, response, error);
    }),
    path = require('path'),
    publicPath = path.join(__dirname, '../../public'),
    authenticationService = require('../services').authentication;

function login(request, response, tokens, data){
    authenticationService.login( data, function(error, loginId){
        if(error){
            response.writeHead(401);
            response.end(JSON.stringify(error.message));
            return;
        }
        response.end(JSON.stringify(loginId));
    })

    //     actions['authentication.login'](
    //     retort.request.account,
    //     [
    //         data
    //     ],
    //     wraperr(
    //         retort.ok,
    //         retort.error
    //     )
    // );
}

function createAccount(request, response, tokens, data){
    authenticationService.createAccount( data, function(error, userId){
        if(error){
            // console.log( 'router createAccount data',  data ,'error', error);
            response.writeHead(500);
            response.end(JSON.stringify(error.message));
            return;
        }

        response.end(JSON.stringify(userId));
    })

    // actions['authentication.createAccount'](
    //     retort.request.account,
    //     [
    //         data
    //     ],
    //     wraperr(
    //         retort.ok,
    //         retort.error
    //     )
    // );
}

module.exports = {
    '/login': {
        GET: fileServer.serveFile(path.join(publicPath, './login.html'), 'text/html'),
        POST: requestData(login)
    },
    '/accounts': {
        POST: requestData(createAccount)
    }
};


// authenticationService = require('../services').authentication,
    

// function login(request, response, tokens, data){
//     // console.log('login router tokens', tokens);
//     // console.log('login router data', data);
//     authenticationService.login(data, function(error, userId){

//         if(error){
//             response.writeHead(500);
//             response.end(JSON.stringify(error.message));
//             return;
//         }

//         response.end(JSON.stringify(userId));
//     });
// }

// function createAccount(request, response, tokens, data){
//     authenticationService.login(data, function(error, userId){

//         if(error){
//             response.writeHead(500);
//             response.end(JSON.stringify(error.message));
//             return;
//         }

//         response.end(JSON.stringify(userId));
//     });
// }


