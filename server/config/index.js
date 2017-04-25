var config = {}

// Most configuration settings come from environment variables. Make sure that these are present.
const UNDEFINED = 'UNDEFINED'

// Express settings
config.BODY_PARSER_LIMIT = 4000
config.PORT = 4201

// Database settings
config.DATABASE_HOST = process.env.DATABASE_HOST || UNDEFINED
config.DATABASE_USERNAME = process.env.DATABASE_USERNAME || UNDEFINED
config.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || UNDEFINED
config.SEQUELIZE_DIALECT = 'mysql'

// Authentication settings
config.SALT_ROUNDS = 10
config.JWT_KEY = process.env.JWT_KEY || UNDEFINED
config.JWT_ISSUER = process.env.JWT_ISSUER || UNDEFINED // This should be your domain. e.g. '<your domain>.com'
config.JWT_EXPIRESIN = '10h'  // Time for the JWT to expire

// Mandrill settings for sending transactional emails (like "forgot password")
config.MANDRILL_API_KEY=process.env.MANDRILL_API_KEY || UNDEFINED
config.PASSWORD_RESET_HOST="localhost"  // Hardcoding for now
config.PASSWORD_RESET_FROM="no-reply@example.com"
config.PASSWORD_RESET_MANDRILL_TEMPLATE="PasswordReset"

// Make sure all settings are defined
var undefinedSettings = []
for (var key in config) {
  if (config.hasOwnProperty(key) && (config[key] === UNDEFINED)) {
    undefinedSettings.push(key)
  }
}
if (undefinedSettings.length > 0) {
  console.log('** ERROR: The following environment variables have not been set. The server cannot start')
  console.log(undefinedSettings)
  process.exit(1)
}

module.exports = config