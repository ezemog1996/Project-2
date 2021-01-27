// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");



module.exports = function (app) {
  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }

    debugger;

    res.sendFile(path.join(__dirname, "../public/login.html"));
    //res.sendFile("/login.html");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/dashboard", isAuthenticated, (req, res) => {

    var hbsObject = {
      children: [{name: "Robert Ortiz", totalPoints: 7, completeCount: 2, taskCount: 10}, {name: "Austin Perez", totalPoints: 3, completeCount: 1, taskCount: 10}, {name: "Enrique Gomez", totalPoints: 0, completeCount: 0, taskCount: 10}]
    }

    console.log("members initiated");
    res.render("dashboard", hbsObject);
  });

  app.get("/register", (req, res) => {
    console.log(path.join(__dirname, "../public/signup.html"));

    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });
};