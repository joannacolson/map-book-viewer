'use strict';
module.exports = function(sequelize, DataTypes) {
  var topic = sequelize.define('topic', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return topic;
};