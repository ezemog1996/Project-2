$(document).ready(() => {
  // Getting references to our form and input
  const loginForm = $("form.login");
  const emailInput = $("input#inputEmail");
  const passwordInput = $("input#inputPassword");

  // When the signup button is clicked, we validate the email and password are not blank
  loginForm.on("submit", event => {
    event.preventDefault();
    $("#error-message").text("");
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    loginUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function loginUser(email, password) {
    $.post("/api/login", {
        email: email,
        password: password
      })
      .then((res) => {
        if (!res.children.length) {
          window.location.replace("/child_registration");
        } else if (res.children === "Move along!") {
          window.location.replace("/view_tasks")
        } else {
          window.location.replace("/dashboard");
        }

        // Do something with the response if necessary. Blank for now
        // If there's an error, handle it by throwing up a bootstrap alert
        // window.location.replace("/members")
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#error-message").text("Email/Username and Password do not match")
  }
});