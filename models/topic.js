'use strict';
module.exports = function(sequelize, DataTypes) {
    var topic = sequelize.define('topic', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        userId: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.topic.belongsTo(models.user);
                models.topic.hasMany(models.place);
            }
        }
    });
    return topic;
};
