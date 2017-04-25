var aclPackage = require('acl');
var models = require('../models');

// Use memory backend for acl
var acl = new aclPackage(new aclPackage.memoryBackend());

// Set up roles and permissions
acl.allow('BankManager', ['/api/import', '/api/viewData'], '*');
acl.allow('RecoveryAgent', ['/api/dashboard', '/api/email', '/api/timeline'], '*');

// Go through all the roles and assign them to the user ids
models.Role.findAll()
  .then((roles) => {
    // Iterate over roles
    roles.forEach((role) => {
      // For each user id, set the role from the table
      acl.addUserRoles(role.UserId, role.role);
    });
  });

// Bank Managers are allowed to do everything that recovery agents are allowed to do
acl.addRoleParents('BankManager', 'RecoveryAgent');

module.exports = acl;
