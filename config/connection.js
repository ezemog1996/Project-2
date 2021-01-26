// const mysql = require("mysql");
const Sequelize = require("sequelize");

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Sap92010",
//     database: "striveRite_db",
// });

// //connect to database
// connection.connect(function (err) {
//     if (err) {
//         console.error("error connecting: " + err.stack);
//         return;
//     }
//     console.log("connected as id " + connection.threadId);
// });

// module.exports = connection;

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