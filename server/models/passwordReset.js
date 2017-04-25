'use strict'

module.exports = function(sequelize, DataTypes) {
  var PasswordReset = sequelize.define('PasswordReset', {
    resetToken: { type: DataTypes.STRING, unique: true },
    emailId: DataTypes.STRING
  })

  return PasswordReset
}
