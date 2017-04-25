/**
 * Declarations
*/
var bodyParser = require('body-parser')
var express = require('express')
var cors = require('cors')
// Allow cross-origin requests so we can do AJAX calls from client side localhost:xxxx to localhost:yyyy
// Perhaps there is a better way to do this other than allowing all CORS requests.
var config = require('./config')
var passport = require('passport')
var authentication = require('./auth/authentication')
var acl = require('./auth/acl')

/**
 * Create the app and define settings
 */
// IMPORTANT: module.exports is defined here, not at the end of the file. This is because we need
//            access to the 'app' object within the /import route to call app.use()
var app = module.exports = express();
app.use(cors());
app.use(bodyParser.json({
  limit: config.bodyParserLimit
}));

app.use(passport.initialize());

/**
 * Define models
 */
var models = require('./models');

/**
 * Define routes
 */
// Anything starting with /api will require JWT authentication. Token can be obtained by calling /login
app.use('/api', passport.authenticate('jwt', {session: false}));

// Non-API (public) routes
app.use('/', require('./routes/authentication'));

/**
 * Start the server
 */
models.sequelize.sync().then(function () {
  app.listen(config.PORT);
  console.log('App initialized and listening on port ' + config.PORT)
});

// module.exports has been assigned earlier in the file.
