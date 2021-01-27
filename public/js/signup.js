$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const nameInput = $("input#inputName");
  const stateSelect = $("select#selectState");
  const cityInput = $("input#inputCity");
  const emailInput = $("input#inputEmail");
  const passwordInput = $("input#inputPassword");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      name: nameInput.val().trim(),
      email: emailInput.val().trim(),
      state: stateSelect.val(),
      city: cityInput.val().trim(),
      password: passwordInput.val().trim()
    };
    console.log(userData);

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function

    signUpUser(
        userData.name,
        userData.email,
        userData.state,
        userData.city,
        userData.password
      )
      .then((res) => {
        console.log("res: ", res);
        window.location.href = "/login";
        nameInput.val("");
        emailInput.val("");
        stateSelect.val("Select your state");
        cityInput.val("");
        passwordInput.val("");
        // window.location.replace("/login");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);

  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(name, email, state, city, password) {
    // $.post("/api/signup", {
    //     userName: name,
    //     email: email,
    //     state: state,
    //     city: city,
    //     password: password
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     window.location.href = "/login";
    //     // window.location.replace("/login");
    //     // If there's an error, handle it by throwing up a bootstrap alert
    //   })
    // .catch(handleLoginErr);
    return $.ajax({
      url: "/api/signup",
      method: "POST",
      data: {
        userName: name,
        email: email,
        state: state,
        city: city,
        password: password
      }
    })

  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});