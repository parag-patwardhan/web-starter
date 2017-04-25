'use strict'

module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    role: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Role.belongsTo(models.User);
      }
    }
  })

  return Role
}
