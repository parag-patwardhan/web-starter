var express = require('express')
var passport = require('passport')
var router = express.Router()
var models = require('../models')
var uuid = require('uuid')
var config = require('../config')
var mandrill = require('mandrill-api/mandrill');
var mandrillClient = new mandrill.Mandrill(config.MANDRILL_API_KEY);
var bcrypt = require('bcryptjs');

/**
 * POST /login
 */
router.post('/login',
  // Use passport with local authentication strategy
  passport.authenticate('local', { session: false }),
  (req, res, next) => {
    if (req.user) {
      // The result from passport.authenticate comes in as req.user. This will contain a
      // JSON web token (jwt) that we passback to the user
      res.status(200).json({
        resultShort: 'success',
        resultLong: 'Login successful',
        user: req.user
      })
    } else {
      res.status(400).json({
        resultShort: 'failure',
        resultLong: 'Login not successful'
      })
    }
  })

/**
 * POST /forgotPassword
 */
router.post('/forgotPassword', (req, res, next) => {
  console.log(req.body.emailId);
  models.User.findOne({
    where: {
      emailId: req.body.emailId
    }
  })
    .then((user) => {
      if (!user) {
        res.status(200).json({
          resultShort: 'failure',
          resultLong: 'There is no user associated with that email address'
        });
      } else {
        // Create a password reset token and store it in the database
        var resetToken = uuid.v4().toString();
        models.PasswordReset.create({
          resetToken: resetToken,
          emailId: req.body.emailId
        })
          .then((newResetToken) => {
            // Send password reset email
            // Set the merge variables that we will use to customize the email for this defaulter
            var globalMergeVars = [{
              'name': 'PASSWORD_RESET_URL',
              'content': 'http://' + config.PASSWORD_RESET_HOST + '/resetPassword?token=' + resetToken + '&emailId=' + req.body.emailId
            }];

            // Set other variables that will be used for sending the email. Hardcoding email addresses for now.
            var templateContent = [];
            var message = {
              'subject': 'Reset your password',
              'from_email': config.PASSWORD_RESET_FROM,
              'from_name': config.PASSWORD_RESET_FROM,
              'to': [
                {
                  'email': req.body.emailId,
                  'name': req.body.emailId,
                  'type': 'to'
                }
              ],
              'headers': {
                'Reply-To': config.PASSWORD_RESET_FROM
              },
              'important': true,
              'global_merge_vars': globalMergeVars
            };
            mandrillClient.messages.sendTemplate({
              'template_name': config.PASSWORD_RESET_MANDRILL_TEMPLATE,
              'template_content': templateContent,
              'message': message,
              'async': false,
              'ip_pool': 'Main Pool',
              'send_at': (new Date()).toISOString() // Send it now!
            }, function (result) {
              res.status(200).json({
                resultShort: 'success',
                resultLong: 'An email has been sent to ' + req.body.emailId + ' with instructions to reset your password'
              })
            })
          })
      }
    })
})


/**
 * POST /resetPasswordServer
 */
router.post('/resetPasswordServer', (req, res, next) => {
  var emailId = req.body.emailId
  var resetToken = req.body.token
  var newPassword1 = req.body.newPassword1
  var newPassword2 = req.body.newPassword2

  // Passwords must match
  if (newPassword1 !== newPassword2) {
    res.status(200).json({
      resultShort: 'failure',
      resultLong: 'Passwords do not match'
    })
    return
  }

  // Password cannot be empty
  if (!newPassword1) {
    res.status(200).json({
      resultShort: 'failure',
      resultLong: 'Password cannot be empty'
    })
  }

  var d = new Date()
  d.setDate(d.getDate() - 1) // "d" now represents one day before today
  models.PasswordReset.findOne({
    where: {
      emailId: emailId,
      resetToken: resetToken,
      createdAt: {
        $gt: d
      }
    }
  }).then((passwordReset) => {
    if (!passwordReset) {
      res.status(200).json({
        resultShort: 'failure',
        resultLong: 'The token provided to the server was invalid or has expired. Try getting a new password reset email from the login page'
      });
    } else {
      // Save the new password
      bcrypt.hash(newPassword1, saltRounds).then((hashedPassword) => {
        models.User.update({
          password: hashedPassword
        },
          {
            where: {
              emailId: emailId
            }
          }).then((updatedUser) => {
            res.status(200).json({
              resultShort: 'success',
              resultLong: 'Password changed successfully. You can now login to your account with the new password'
            });
            // Delete the password reset token
            models.PasswordReset.destroy({
              where: {
                resetToken: resetToken
              }
            })
          })
      })
    }
  })
})

module.exports = router;
