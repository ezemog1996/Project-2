const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: " ",
    database: "striveRite_db",
});

connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("MySQL Connected..");
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