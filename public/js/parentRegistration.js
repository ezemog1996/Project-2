$(document).ready(() => {
  // Getting references to our form and input
  const submit = $("#submit");
  const parentName = $("input#parent-name");
  const lastName = $("input#parent-last-name");
  const relationshipSelect = $("select#relationshipSelect");

  // When the signup button is clicked, we validate the email and password are not blank
  submit.on("click", event => {
    event.preventDefault();
    const parentData = {
      parentName: parentName.val().trim(),
      lastName: lastName.val().trim(),
      relationship: relationshipSelect.val()
    };
    console.log(parentData);

    if (!parentData.parentName || !parentData.lastName) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(
      parentData.parentName,
      parentData.lastName,
      parentData.relationship
    );
    parentName.val("");
    lastName.val("");
    relationshipSelect.val("Relationship");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(parentName, lastName, relationship) {
    $.post("/api/parent-registration", {
      parentName: parentName,
      lastName: lastName,
      relationship: relationship
    })
      .then(() => {
        window.location.replace("/register-child");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
