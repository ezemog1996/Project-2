// Creating our User model
module.exports = function (sequelize, DataTypes) {
    const Task = sequelize.define("Task", {
      childId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      due: {
        type: DataTypes.DATE,
        allowNull: false
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      priority: {
          type: DataTypes.INTEGER,
          allowNull: false
      }
    });
  
    return Task;
  };