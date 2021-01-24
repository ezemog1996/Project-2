const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sap92010",
    database: "striveRite_db",
});

//connect to databasels
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});
module.exports = connection;

// connection.connect(function (err) {
//     if (err) {
//         console.log("error connecting " + err.stack);
//         return;
//     }
//     console.log("connected as id " + connection.threadId);
// });
// module.exports = connection;