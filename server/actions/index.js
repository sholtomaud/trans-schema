var flatMergeN = require('flat-merge-n'),
    actions = flatMergeN(
        require('./authentication'),
        require('./site')
        // ,
        // require('./record'),
        // require('./schema'),
        // require('./translation'),
        // require('./view')
    );

module.exports = actions;
