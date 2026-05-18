// var logger = require('../logger'),
//     retorter = require('./retorter')(logger),
//     services = require('../services');

// function verifyToken(routeHandler){
//     return function(request, response){
//         if(!request.headers || !request.headers.authorization){
//             return retorter.unauthorised(request, response);
//         }

//         services.authentication.validateToken(
//             request.headers.authorization.split(' ').pop(),
//             function(error, account){
//                 if(error || !account){
//                     return retorter.unauthorised(request, response);
//                 }

//                 request.account = account;

//                 routeHandler(request, response);
//             }
//         );
//     };
// }

// module.exports = verifyToken;



//kory's old stuff from predicator which doesn't have simple-cors: 

module.exports = function(routeHandler){
    return routeHandler;
};

return;

var services = require('../services');

function verifyToken(routeHandler){
    return function(request, response){
        
        console.log('services.authentication.validateToken account:', request.headers.authorization)

        function unauthorised(response){
            response.writeHead(401);
            response.end('Unauthorised');
        }

        if(!request.headers || !request.headers.authorization){

            unauthorised(response);

            return;
        }

        services.authentication.validateToken(
            request.headers.authorization.split(' ').pop(),
            
            function(error, account){
                
                if(error || !account){

                    unauthorised(response);

                    return;
                }

                request.account = account;

                routeHandler(request, response);
            }
        );
    };
}


module.exports = verifyToken;


