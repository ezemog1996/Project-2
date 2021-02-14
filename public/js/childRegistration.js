$(document).ready(() => {
  // Getting references to our form and input
  const addBtn = document.getElementById("addChild")
  const submit = $("#submit");

  let child = 1;

  let isValid = 0;

  function validUsername(inputNumber, inputValue) {
    $.get("/api/all_children", function(data) {
      data.forEach(item => {
        if (item.username.toLowerCase() === inputValue) {
          $(`#isValid${parseInt(inputNumber)}`).text("This username is already taken");
          isValid++
        } else {
          if (document.getElementById(`isValid${parseInt(inputNumber)}`).textContent === "This username is already taken") {
            $(`#isValid${parseInt(inputNumber)}`).text("");
            isValid--
          }
        }
      })
      
    })
  }
  document.getElementById("username1").addEventListener("input", (event) => {
    validUsername(event.target.id.split("e")[2], event.target.value.toLowerCase())
  })

  addBtn.addEventListener("click", function() {
    child++
    $("#childrenContainer").append(`<div class="row mx-1 mt-2 p-1 bg-primary rounded-top black-border-top black-border-left black-border-right">
    <div class="col-12 col-sm-12 col-md-12">
      <h4 class="text-white">Child ${child}</h4>
    </div>
  </div>
  <div class="row mx-1 p-1 info-divs black-border-left black-border-right rounded-bottom black-border-bottom mb-2">
    <div class="col-12 col-sm-12 col-md-8">
      <form>
        <div class="mb-3">
          <label for="nameInput" class="form-label">Name</label>
          <input type="name" class="form-control" id="name${child}"
            placeholder="(as you want it to appear on the site)">
        </div>
        <div class="mb-3">
          <label for="usernameInput" class="form-label">Username</label>
          <input type="username" class="form-control" id="username${child}">
          <div id="isValid${child}"></div>
        </div>
        <div class="mb-3">
          <label for="passwordInput" class="form-label">Password</label>
          <input type="password" class="form-control" id="password${child}">
        </div>
      </form>
    </div>
    <div class="col-6 col-sm-4 col-md-5 col-lg-4">
      <label for="nameInput" class="form-label">Gender</label>
      <select class="form-select" id="gender${child}" aria-label="Default select example">
        <option selected>Select Gender</option>
        <option value="male">male</option>
        <option value="female">female</option>
      </select>
      <label for="start" class="mt-3 form-label">Birthday</label>
      <input type="date" class="form-control" id="birthday${child}" name="birthday" placeholder="yyyy-mm-dd">
      <label for="nameInput" class="form-label mt-3">Favorite Color</label>
      <select class="form-select" id="colorSelect${child}" aria-label="Default select example">
        <option selected>Select a Color</option>
        <option value="blue">blue</option>
        <option value="green">green</option>
        <option value="lightblue">light blue</option>
        <option value="orange">orange</option>
        <option value="pink">pink</option>
        <option value="purple">purple</option>
        <option value="red">red</option>
        <option value="yellow">yellow</option>
      </select>
    </div>
  </div>`)
  document.getElementById(`username${child}`).addEventListener("input", (event) => {
    validUsername(event.target.id.split("e")[2], event.target.value.toLowerCase())
  })
  })
  // When the signup button is clicked, we validate the email and password are not blank
  submit.on("click", event => {
    let filled;
    let selected;
    event.preventDefault();
    let alertText = ""
    const inputs = document.querySelectorAll("input");
    for (i = 0; i < inputs.length; i++) {
      if (inputs[i].value.trim() === "") {
        alertText = alertText.concat("Please fill out all fields.");
        filled = false
        break
      } else {
        filled = true
      }
    }

    const selections = document.querySelectorAll("select");

    for (i = 0; i < selections.length; i++) {
      if (selections[i].value === "Select Gender" || selections[i].value === "Select a Color") {
        alertText = alertText.concat("\nPlease fill out all selection boxes.");
        selected = false
        break
      } else {
        selected = true
      }
    }

    if (isValid !== 0) alertText = alertText.concat("\nOne or more usernames may already taken.");
    if (isValid === 0 && filled && selected) {

      let data = [];

      function getInfo(item) {
        return document.getElementById(item).value
      }

      for (i = 1;; i++) {
        try {
          let object = {
            name: getInfo(`name${i}`),
            username: getInfo(`username${i}`),
            password: getInfo(`password${i}`),
            birthday: getInfo(`birthday${i}`),
            gender: getInfo(`gender${i}`),
            color: getInfo(`colorSelect${i}`)
          }

          if (!object.name || !object.username || !object.password || !object.birthday || !object.gender || !object.color) {
            return;
          }

          data.push(object);
        } catch (err) {
          break;
        }
      }
      signUpUser(data);
    } else {
      alert(alertText);
    }
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(data) {
    $.post("/api/child_registration", {
      data: JSON.stringify(data)
    })
      .then((res) => {
        if (res) {
          window.location.replace("/dashboard");
          //is the request really happending sequencially
        }
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleSignUpErr);
  }

  function handleSignUpErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
