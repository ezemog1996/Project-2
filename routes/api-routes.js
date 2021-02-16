// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");


module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    if (!req.user.parentId) {
      db.Child.findAll({attribute: ['id'], where: {parentid: req.user.id}}).then(function(results) {
        res.json(
          {
            children: results
          }
        )
      })
    } else {
      res.json({ children: "Move along!" })
    }
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    let parent = db.Parent.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      state: req.body.state,
      city: req.body.city
    }).then(() => {
      res.status(200).send(parent);
    }).catch((err) => {
      res.status(500).send(err)
    })
  });

  app.post("/api/child_registration", (req, res) => {
    const children = JSON.parse(req.body.data);
    // let keepTrackNumber = 0;
    const registerChildren = new Promise((resolve, reject) => {
      children.forEach(item => {
        db.Child.create({
          parentId: req.user.id,
          name: item.name,
          username: item.username,
          password: item.password,
          birthday: item.birthday,
          gender: item.gender,
          color: item.color
        })
      })
      resolve(`Registered your children`)
    })

    registerChildren.then((message) => {
        console.log(message)
        res.status(200).send(message)
    })
      .catch(() => {
        res.status(500).send("Failed to Register");
      })
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.get("/api/all_children", (req, res) => {
    db.Child.findAll({attributes: ['username']})
      .then(result => {
        res.json(result)
      })
  });

  app.get("/api/all_parents"), (req, res) => {
    db.Parent.findAll({attributes: ["email"]})
      .then(result => {
        res.json(result);
      })
  }

  app.get("/api/get_children", (req, res) => {
    db.Child.findAll({attributes: ['id', 'name', 'username'], where: {parentId: req.user.id}})
      .then(function(result) {
        res.json(result)
      })
  })

  app.post("/api/create_task", (req, res) => {
    let task = db.Task.create(req.body)
      .then(function() {
        db.Child.findOne({where: {id: req.body.childId}})
          .then(async function(result) {
            db.Child.update({
                tasksAssigned: result.dataValues.tasksAssigned + 1
              },
              {
                where: {
                  id: req.body.childId
                }
              })
          })
      });

    if (task) {
      res.status(200).send(task);
    } else {
      res.status(500).send("error encountered");
    }
  })

  app.put("/api/complete_task", (req, res) => {
    db.Task.update({completed: req.body.completed}, {
      where: {
        id: req.body.id
      }
    }).then(function(result) {
      res.json(result);
    })
  })

  app.delete("/api/approve_task/:id", (req, res) => {
    db.Task.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(result) {
      db.Child.findOne({
        where: {
        id: result.dataValues.childId
        }
      }).then(async function(data) {
        const newPoints = await data.dataValues.points + result.dataValues.points;
        const newCompleted = await data.dataValues.tasksCompleted + 1;
        const newAssigned = await data.dataValues.tasksAssigned - 1;
        db.Child.update({
          points: newPoints,
          tasksCompleted: newCompleted,
          tasksAssigned: newAssigned
        },
        {
          where: {
            id: data.dataValues.id
          }
        }).then(function() {
          db.Task.destroy({
            where: {
              id: req.params.id
            }
          }).then(function(r) {
            res.json(r);
          })
        })
      })
    })
    
  })

  app.put("/api/reject_task", (req, res) => {
    db.Task.update({
      completed: req.body.completed
    },
    {
      where: {
        id: req.body.id
      }
    }).then(function(results) {
      res.json(results)
    })
  })

  app.post("/api/add_reward", (req, res) => {
    db.Reward.create(req.body)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch(() => {
        res.status(500).send("error encountered")
      })
  })

  app.delete("/api/cash_points/:id/:childId/:points", (req, res) => {
    db.Child.findOne({
      where: {
        id: req.params.childId
      }
    })
      .then(function(result) {
        if (result.dataValues.points >= parseInt(req.params.points)) {
          db.Child.update(
            {
              points: result.points - parseInt(req.params.points)
            },
            {
              where: {
                id: req.params.childId
              }
            }
          ).then(() => {
            db.Reward.destroy({where: {id: req.params.id}})
              .then(() => {
                res.send("Success!")
              })
          })
        } else {
          res.send("They don't have enough points for this item!")
        }
      })
  })

};