/**
 * Initializes a dummy database on the current machine for development/testing/demos
 */
var models = require('../models')
var bcryptjs = require('bcryptjs')
var config = require('../config')

/**
 * The entry point for the script. Called at the end of the file
 */
var main = function() {
  if (process.argv.length !== 4) {
    console.log('-------------------------- Database initialization script ---------------------')
    console.log('Usage: "node initDeveloperDB.js <emailid> <password>')
    console.log('       where <emailid> and <password> will be used to log in to the system')
    console.log('             and  "admin"+<emailid> and <password> will be used to log in as an admin user')
    process.exit(1);
  }
  var emailId = process.argv[2]
  var password = process.argv[3]

  // Populate database
  models.sequelize.sync({ force: true, logging: true })  // NOTE: force=true will drop ALL existing tables
    .then(createUser.bind(null, emailId, password, 'FirstName', 'LastName'))
    .then(createUser.bind(null, 'admin' + emailId, password, 'FirstName', 'LastName'))
    .then(setUserRoles.bind(null, emailId))
    .catch((err) => console.log(err))
}

/**
 * Creates a user that can be used to log in to the system
 */
var createUser = function(emailId, password, firstName, lastName) {
  var hashedPassword = bcryptjs.hashSync(password, config.SALT_ROUNDS)
  console.log('hashed password is ' + hashedPassword)
  return models.User.create({
    emailId: emailId,
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName
  })
}

/**
 * Sets roles for the users created by the system
 */
var setUserRoles = function(emailId) {
  // Set the role for the ordinary user
  models.User.findOne({ where: { emailId: emailId } })
    .then((user) => {
      models.Role.create({
        role: 'Standard',
        UserId: user.id
      })
    })

  // Set the role for the administrator
  models.User.findOne({ where: { emailId: 'admin' + emailId } })
    .then((user) => {
      models.Role.create({
        role: 'Administrator',
        UserId: user.id
      })
    })

  return Promise.resolve()  // Because it doesn't matter when the roles are created. They don't affect the rest of the script.
}

// Call the entry point for the initialization script
main()