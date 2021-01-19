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
    signUpUser(userData.email, userData.password);
    nameInput.val("");
    emailInput.val("");
    stateSelect.val("Select your state");
    cityInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(name, email, state, city, password) {
    $.post("/api/signup", {
      name: name,
      email: email,
      state: state,
      city: city,
      password: password
    })
      .then(() => {
        window.location.replace("/register-parent");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
