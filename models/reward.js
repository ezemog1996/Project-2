// Creating our User model
module.exports = function (sequelize, DataTypes) {
    const Reward = sequelize.define("Reward", {
      childId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // The email cannot be null, and must be a proper email before creation
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // The password cannot be null
      price: {
        type: DataTypes.STRING,
        allowNull: false
      },
      //state cannot be null 
      asin: {
        type: DataTypes.STRING,
        allowNull: false
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    return Reward;
  
  }