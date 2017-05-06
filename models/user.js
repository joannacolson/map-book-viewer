'use strict';
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define('user', {
        firstName: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [1, 49],
                    msg: "First Name must be between 1 and 49 characters in length"
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [1, 49],
                    msg: "Last Name must be between 1 and 49 characters in length"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: "Invalid email address"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [4, 32],
                    msg: "Password must be between 4 and 32 characters in length"
                },
                isAlphanumeric: {
                    msg: "No special characters allowed in password!!!"
                }
            }
        },
        facebookId: DataTypes.STRING,
        facebookToken: DataTypes.STRING
    }, {
        hooks: {
            beforeCreate: function(createdUser, options, cb) {
                if (createdUser && createdUser.password) {
                    // hash the password
                    var hash = bcrypt.hashSync(createdUser.password, 10);
                    // Change the password value to the hash before inserting into the DB
                    createdUser.password = hash;
                }
                // continue to save the user, with no errors
                cb(null, createdUser);
            }
        },
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.user.hasMany(models.topic);
            }
        },
        instanceMethods: {
            // Called against specific instances in the database
            isValidPassword: function(passwordTyped) {
                // return true if the password matches the hash, else return false
                return bcrypt.compareSync(passwordTyped, this.password);
            },
            // overrides an instance method called toJSON, which will leave the hash out of the user's JSON object
            // returns { name: 'Brian', email: 'bh@ga.co' } without the hashed password!
            toJSON: function() {
                // get the user's JSON data
                var jsonUser = this.get();
                // delete the password from the JSON data, and return
                delete jsonUser.password;
                return jsonUser;
            },
            getFullName: function() {
                return this.firstName + " " + this.lastName;
            }
        }
    });
    return user;
};
