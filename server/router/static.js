var config = require('../config'),
    makeRequest = require('request'),
    Dion = require('dion');

module.exports = function(router){
    var dion = new Dion(router);

    function pipeToStaticServer(request, response){
        makeRequest(config.clientUrl + request.url)
            .pipe(response);
    }

    return {
        '/': pipeToStaticServer,
        '/index.html': pipeToStaticServer,
        '/scripts/`path...`': pipeToStaticServer,
        '/styles/`path...`': pipeToStaticServer
    };
}