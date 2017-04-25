var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var models = require('../models')
var path = require('path')
var config = require('../config')
var bcryptjs = require('bcryptjs') 
var jwt = require('jsonwebtoken')
var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt
const saltRounds = config.SALT_ROUNDS

/**
 * Define local strategy to be used when logging in with a username and password
 */
passport.use(new LocalStrategy(
  function (username, password, done) {
    models.User.findOne({
      where: { emailId: username },
      include: [{ all: true }]
    })
      .then((user) => {
        if (!user) {
          console.log('User not found')
          return done(null, false)
        }
        bcryptjs.compare(password, user.password)
          .then((result) => {
            if (result) {
              done(null, {
                jwt: jwt.sign({ user: user.emailId }, config.JWT_KEY, {
                  expiresIn: config.JWT_EXPIRESIN,
                  issuer: config.JWT_ISSUER
                }),
                roles: user.Roles,
                firstName: user.firstName,
                lastName: user.lastName
              })
            } else {
              done(null, false)
            }
          })
      }).catch((err) => {
        console.log(err)
        done(null, false)
      })
  }
))

/**
 * Define JWT token based strategy used when accessing API calls
 */
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader()
opts.secretOrKey = config.JWT_KEY
opts.issuer = config.JWT_ISSUER
passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
  models.User.findOne({
    where: {
      emailId: jwtPayload.user
    }
  }).then((user) => {
    done(null, user)
  })
}))
