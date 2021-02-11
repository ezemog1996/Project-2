// Requiring path to so we can use relative routes to our HTML files
const { decodeBase64 } = require("bcryptjs");
const path = require("path");
const db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");



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
    let hbsObject;
    if (req.user.parentId) {
      const name = req.user.name;
      const points = req.user.points;
      db.Task.findAll({where: {childId: req.user.id}}).then(function(results) {
        let highPriority = [];
        let mediumPriority = [];
        let lowPriority = [];
        for (i = 0; i < results.length; i++) {
          let due = `${results[i].dataValues.due}`
          console.log(due)
          results[i].dataValues.date = due.split(" ")[1] + " " + due.split(" ")[2] + " " + due.split(" ")[3];
          results[i].dataValues.time = due.split(" ")[4];
          if (results[i].dataValues.priority === 3) {
            highPriority.push(results[i].dataValues);
          } else if (results[i].dataValues.priority === 2) {
            mediumPriority.push(results[i].dataValues);
          } else {
            lowPriority.push(results[i].dataValues);
          }
        }

        const sortedHigh = highPriority.sort(function(a,b) {
          return new Date(a.due) - new Date(b.due);
        });

        const sortedMedium = mediumPriority.sort(function(a,b) {
          return new Date(a.due) - new Date(b.due);
        });

        const sortedLow = lowPriority.sort(function(a,b) {
          return new Date(a.due) - new Date(b.due);
        });

        hbsObject = {
          isParent: false,
          children: [{
            name,
            points,
            sortedHigh,
            sortedMedium,
            sortedLow
          }]
        }
      }).then(function() {
        res.render("viewTasks", hbsObject);
      })
    } else {
      let children = [];
      function hbsObject(children) {
        return {
        isParent: true,
        children
        }
      }
      db.Child.findAll({
        where: {
          parentId: req.user.id
        },
        include: [{
          model: db.Task
        }]
      }).then( async function(results) {
        for await (let child of results) {
          taskList = {
            name: child.name,
            points: child.points,
            sortedHigh: child.Tasks.filter(task => task.dataValues.priority === 3),
            sortedMedium: child.Tasks.filter(task => task.dataValues.priority === 2),
            sortedLow: child.Tasks.filter(task => task.dataValues.priority === 1)
          }
          if (taskList.sortedHigh.length) {
            taskList.sortedHigh.forEach(item => {
              const due = `${item.dataValues.due}`
              item.dataValues.date = due.split(" ")[1] + " " + due.split(" ")[2] + " " + due.split(" ") [3];
              item.dataValues.time = due.split(" ") [4];
            })
          }
          if (taskList.sortedMedium.length) {
            taskList.sortedMedium.forEach(item => {
              const due = `${item.dataValues.due}`
              item.dataValues.date = due.split(" ")[1] + " " + due.split(" ")[2] + " " + due.split(" ") [3];
              item.dataValues.time = due.split(" ") [4];
            })
          }
          if (taskList.sortedLow.length) {
            taskList.sortedLow.forEach(item => {
              const due = `${item.dataValues.due}`
              item.dataValues.date = due.split(" ")[1] + " " + due.split(" ")[2] + " " + due.split(" ") [3];
              item.dataValues.time = due.split(" ") [4];
            })
          }
          children.push(taskList);
        }
        hbsObject = {
          isParent: true,
          children
        }
        // for await (let item of results) {
        //   let name = item.name;
        //   let points = item.points;
        //   let highPriority = [];
        //   let mediumPriority = [];
        //   let lowPriority = [];
        //   db.Task.findAll({where: {childId: item.dataValues.id}}).then(async function(result) {
        //     for await (let data of result) {
        //       let due = `${data.dataValues.due}`
        //       data.dataValues.date = due.split(" ")[1] + " " + due.split(" ")[2] + " " + due.split(" ")[3];
        //       data.dataValues.time = due.split(" ")[4];
        //       if (data.dataValues.priority === 3) {
        //         highPriority.push(data.dataValues);
        //       } else if (data.dataValues.priority === 2) {
        //         mediumPriority.push(data.dataValues);
        //       } else {
        //         lowPriority.push(data.dataValues);
        //       }
        //     }

        //     const sortedHigh = highPriority.sort(function(a,b) {
        //       return new Date(a.due) - new Date(b.due);
        //     });

        //     const sortedMedium = mediumPriority.sort(function(a,b) {
        //       return new Date(a.due) - new Date(b.due);
        //     });

        //     const sortedLow = lowPriority.sort(function(a,b) {
        //       return new Date(a.due) - new Date(b.due);
        //     });
            
        //     let taskList = {
        //       name,
        //       points,
        //       sortedHigh,
        //       sortedMedium,
        //       sortedLow
        //     }

        //     children.push(taskList)

        //   })
        // }
        
      }).then(function() {
        res.render("viewTasks", hbsObject);
      })
    }
  });

  app.get("/pending_tasks", isAuthenticated, (req,res) => {
    if (req.user.parentId) {
      res.render("noAccessPage")
    } else {
      let hbsObject;
      let children = [];
      db.Child.findAll({where: {parentId: req.user.id}}).then(function(results) {
        console.log(results[0].name)
        for (i = 0; i < results.length; i++) {
          let name = results[i].name;
          let points = results[i].points;
          let highPriority = [];
          let mediumPriority = [];
          let lowPriority = [];
          db.Task.findAll({where: {childId: results[i].dataValues.id}}).then(function(res) {
            for (j = 0; j < res.length; j++) {
              let due = `${res[j].dataValues.due}`
              res[j].dataValues.date = due.split(" ")[1] + " " + due.split(" ")[2] + " " + due.split(" ")[3];
              res[j].dataValues.time = due.split(" ")[4];
              if (res[j].dataValues.priority === 3) {
                highPriority.push(res[j].dataValues);
              } else if (res[j].dataValues.priority === 2) {
                mediumPriority.push(res[j].dataValues);
              } else {
                lowPriority.push(res[j].dataValues);
              }
            }

            const sortedHigh = highPriority.sort(function(a,b) {
              return new Date(a.due) - new Date(b.due);
            });

            const sortedMedium = mediumPriority.sort(function(a,b) {
              return new Date(a.due) - new Date(b.due);
            });

            const sortedLow = lowPriority.sort(function(a,b) {
              return new Date(a.due) - new Date(b.due);
            });
            
            let taskList = {
              name,
              points,
              sortedHigh,
              sortedMedium,
              sortedLow
            }

            children.push(taskList)

          })
        }
        hbsObject = {
          children
        }
      }).then(function() {
        res.render("pendingTasks", hbsObject);
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
      prizes = [];
      db.Reward.findAll({where: {childId: req.user.id}}).then((result) => {
        result.forEach(item => item.dataValues.isParent = false)
        result.forEach(item => prizes.push(item.dataValues))
        hbsObject = {
          childPoints: req.user.points,
          isParent: false,
          prizes
        }
      }).then(function() {
        res.render("viewPrizes", hbsObject);
      })
    } else {
      db.Child.findAll({where: {parentId: req.user.id}}).then(function(result) {
        prizes = [];
        result.forEach(item => {
          db.Reward.findAll({where: {childId: item.dataValues.id}}).then(function(results) {
            result.forEach(child => {
              results.forEach(reward => {
                if (child.id === reward.childId) {
                  reward.dataValues.childName = child.name;
                  reward.dataValues.childPoints = child.points;
                  reward.dataValues.isParent = true;
                }
              })
            })
            results.forEach(reward => prizes.push(reward.dataValues))
          })
        })

        hbsObject = {
          isParent: true,
          prizes
        }
      }).then(function() {
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