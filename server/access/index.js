function getApplicablePermissions(accountId, callback){
    callback(null, []);
}

function checkPermission(accountId, permission, callback){
    callback(null, true);
}

module.exports = {
    getApplicablePermissions: getApplicablePermissions,
    checkPermission: checkPermission
};