var SeaLion = require('sea-lion'),
    router = new SeaLion(),
    unsecureRouter = new SeaLion(),
    verifyToken = require('./verifyToken');

router.add(require('./site'));
router.add(require('./search'));
router.add(require('./ui'));

unsecureRouter.add(require('./authentication'));
unsecureRouter.add(require('./static')(unsecureRouter));
unsecureRouter.add({
    '`path...`': verifyToken(router.createHandler())
});

module.exports = unsecureRouter;