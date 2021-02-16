// Requiring path to so we can use relative routes to our HTML files
const { decodeBase64 } = require("bcryptjs");
const path = require("path");
const db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

const sortTasks = async function(results, completed) {
  let children = [];
  for await (let child of results) {
    child.Tasks.forEach(item => {
      const due = `${item.dataValues.due}`
      item.dataValues.date = due.split(" ")[1] + " " + due.split(" ")[2] + " " + due.split(" ") [3];
      item.dataValues.time = due.split(" ") [4];
    })
    taskList = {
      name: child.name,
      points: child.points,
      sortedHigh: child.Tasks.filter(task => task.dataValues.priority === 3 && task.dataValues.completed === completed),
      sortedMedium: child.Tasks.filter(task => task.dataValues.priority === 2 && task.dataValues.completed === completed),
      sortedLow: child.Tasks.filter(task => task.dataValues.priority === 1 && task.dataValues.completed === completed)
    }

    if (taskList.sortedHigh.length > 0) taskList.hasHigh = true;
    if (taskList.sortedMedium.length > 0) taskList.hasMedium = true;
    if (taskList.sortedLow.length > 0) taskList.hasLow = true;

    if (taskList.sortedHigh.length === 0 && taskList.sortedMedium.length === 0 && taskList.sortedLow.length ===0) {
      taskList.hasTasks = false;
    } else {
      taskList.hasTasks = true;
    }

    children.push(taskList);
  }

  return {
    isParent: true,
    children
  }
}

module.exports = function (app) {
  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/dashboard");
    }

    debugger;

    res.sendFile(path.join(__dirname, "../public/login.html"));
    //res.sendFile("/login.html");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/child_registration", isAuthenticated, (req, res) => {
    if (req.user.parentId) {
      res.render("noAccessPage");
    } else {
      res.sendFile(path.join(__dirname, "../public/childRegistration.html"));
    }
  })

  app.get("/dashboard", isAuthenticated, (req, res) => {
    var dashboardObject;
    if (req.user.parentId) res.render("noAccessPage");
    else {
      db.Child.findAll({where: {parentId: req.user.id}}).then(function(results) {
        dashboardObject = {
          children: []
        }
        results.forEach(item => dashboardObject.children.push(item.dataValues));
        
      }).then(function() {
        res.render("dashboard", dashboardObject);
      })
    }
    
  });

  app.get("/view_tasks", isAuthenticated, (req, res) => {
    if (req.user.parentId) {
      const name = req.user.name;
      const points = req.user.points;
      db.Task.findAll({where: {childId: req.user.id}}).then(async function(results) {
        for await (let task of results) {
          let due = `${task.dataValues.due}`
          task.dataValues.date = due.split(" ")[1] + " " + due.split(" ")[2] + " " + due.split(" ")[3];
          task.dataValues.time = due.split(" ")[4];
        }

        hbsObject = {
          isParent: false,
          children: [{
            name,
            points,
            sortedHigh: results.filter(task => task.dataValues.priority === 3),
            sortedMedium: results.filter(task => task.dataValues.priority === 2),
            sortedLow: results.filter(task => task.dataValues.priority === 1)
          }]
        }
      }).then(function() {
        res.render("viewTasks", hbsObject);
      })
    } else {
      db.Child.findAll({
        where: {
          parentId: req.user.id
        },
        include: [{
          model: db.Task
        }]
      }).then(async function(results) {
        res.render("viewTasks", await sortTasks(results, false));
      })
    }
  });

  app.get("/pending_tasks", isAuthenticated, (req,res) => {
    if (req.user.parentId) {
      res.render("noAccessPage")
    } else {
      db.Child.findAll({
        where: {
          parentId: req.user.id
        },
        include: [{
          model: db.Task
        }]
      }).then(async function(results) {
        res.render("pendingTasks", await sortTasks(results, true));
      })
    }
  })

  app.get("/new_task", isAuthenticated, (req, res) => {
    if (req.user.parentId) {
      res.render("noAccessPage");
    } else {
      res.sendFile(path.join(__dirname, "../public/createTask.html"));
    }
  });

  app.get("/search_rewards", isAuthenticated, (req, res) => {
    if (req.user.parentId) {
      res.render("noAccessPage")
    } else {
      res.sendFile(path.join(__dirname, "../public/productSearch.html"));
    }
  });

  app.get("/view_rewards", isAuthenticated, (req, res) => {
    let hbsObject;
    if (req.user.parentId) {
      db.Reward.findAll({where: {childId: req.user.id}, raw: true}).then(async (result) => {
        await result.forEach(item => {
          item['Rewards.image'] = item.image;
          item['Rewards.childId'] = item.childId;
          item['Rewards.points'] = item.points;
          item['Rewards.title'] = item.title;
          item['Rewards.price'] = item.price;
          item['Rewards.asin'] = item.asin;
          item['Rewards.link'] = item.link;
          item.isParent = false;
        })

        const prizes = result;

        hbsObject = {
          childPoints: req.user.points,
          isParent: false,
          prizes
        }
      }).then(function() {
        res.render("viewPrizes", hbsObject);
      })
    } else {
      db.Child.findAll(
        {
          where: {
            parentId: req.user.id
          },
          include: [{
            model: db.Reward
          }],
          raw: true
        }
      )
        .then(async function(result) {
          for await (let reward of result) {
            reward.isParent = true;
          }
          const prizes = await result.filter(item => item['Rewards.id'] !== null);

          hbsObject = {
            isParent: true,
            prizes
          }
        })
          .then(function() {
            res.render("viewPrizes", hbsObject);
          })
    }
  })

  app.get("/register", (req, res) => {

    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/dashboard");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });
};