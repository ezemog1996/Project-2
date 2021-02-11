// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
const bcrypt = require("bcryptjs");
const { authorize } = require("passport");
// Creating our User model
module.exports = function (sequelize, DataTypes) {
  const Parent = sequelize.define("Parent", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //state cannot be null 
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  });

  Parent.associate = function(models) {
    Parent.hasMany(models.Child, {
      foreignKey: 'parentId',
      onDelete: "cascade"
    });
  };

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  Parent.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  Parent.addHook("beforeCreate", parent => {
    parent.password = bcrypt.hashSync(
      parent.password,
      bcrypt.genSaltSync(10),
      null
    );
  });
  return Parent;
};