var requestData = require('request-data'),
    searchService = require('../services').search;

function searchSites(request, response, tokens, data){
    searchService.searchSites(request.headers.authorization, data, function(error, sites){

        if(error){
            response.writeHead(500);
            response.end(JSON.stringify(error.message));
            return;
        }

        response.end(JSON.stringify(sites));
    });
}

module.exports = {
    '/search': {
        POST: requestData(searchSites)
    }
};