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

  app.get("/view_tasks", isAuthenticated, (req, res) => {
    var hbsObject = {
      name: "Robert",
      highPriority: [{taskTitle: "Clean Your Room", taskDescription: "Pick up, vacuum, and do the bed.", taskValue: 5, dueDate: "01/27/2021", timeDue: "6:00pm"}],
      mediumPriority: [{taskTitle: "Clean Your Room", taskDescription: "Pick up, vacuum, and do the bed.", taskValue: 5, dueDate: "01/27/2021", timeDue: "6:00pm"}],
      lowPriority: [{taskTitle: "Clean Your Room", taskDescription: "Pick up, vacuum, and do the bed.", taskValue: 5, dueDate: "01/27/2021", timeDue: "6:00pm"}]
    }

    res.render("viewTasks", hbsObject)
  });

  app.get("/new_task", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/createTask.html"));
  });

  app.get("/search_rewards", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/productSearch.html"));
  });

  app.get("/view_rewards", isAuthenticated, (req, res) => {
    var hbsObject = {
      prizes: [{image: "https://cdn.vox-cdn.com/thumbor/IKt535q8LMnJDddmLL74TBtzv88=/0x266:1024x949/1280x854/cdn.vox-cdn.com/uploads/chorus_image/image/48942277/N3DS_PokemonSuperMysteryDungeon_MainIllustration_png_jpgcopy.0.0.jpg", title: "100 Cards Poke Style Card Holo EX Full Art : 20 GX + 20 Mega + 1 Energy", price: "$25.00", asin: "B0886GRSZH", link: "https://www.amazon.com/dp/B0886GRSZH"}]
    }

    res.render("viewPrizes", hbsObject);
  })

  app.get("/register", (req, res) => {
    console.log(path.join(__dirname, "../public/signup.html"));

    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });
};