const Sequelize = require("sequelize");

//connection to MySQL using Sequelize
const Connection = new Sequelize("striveRite_db", "root", "!UCSD_fall@2020!", {
    host: "localhost",
    port: 3000,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        idle: 1000
    }
});


module.exports = Connection;