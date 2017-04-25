/**
 * File to load all models from the "models" folder. Example from http://docs.sequelizejs.com/en/1.7.0/articles/express/
 */
'use strict';
var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var config = require('../config')

var sequelize = new Sequelize(config.DATABASE_HOST,
                              config.DATABASE_USERNAME,
                              config.DATABASE_PASSWORD,
                              { dialect: config.SEQUELIZE_DIALECT });
var db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'timelineData.js');
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
