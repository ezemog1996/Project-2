$(document).ready(() => {
  // Getting references to our form and input
  const submit = $("#submit");
  const parentName = $("input#parent-name");
  const lastName = $("input#parent-last-name");
  const genderSelect = $("select#selectState");

  $("#profileImage").click(() => {
    $("#imageUpload").click();
  });

  function fasterPreview(uploader) {
    if (uploader.files && uploader.files[0]) {
      $("#profileImage").attr(
        "src",
        window.URL.createObjectURL(uploader.files[0]));
    }
  }

  $("#imageUpload").change(function(){
    fasterPreview(this);
  });

  // When the signup button is clicked, we validate the email and password are not blank
  submit.on("click", event => {
    console.log(photo);
    event.preventDefault();
    const parentData = {
      parentName: parentName.val().trim(),
      lastName: lastName.val().trim(),
      gender: genderSelect.val(),
    };
    console.log(userData);

    if (!parentData.parentName || !parentData.lastName) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(parentData.parentName, parentData.lastName, parentData.gender);
    parentName.val("");
    lastName.val("");
    genderSelect.val("Select Gender");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(parentName, lastName, gender) {
    $.post("/api/signup", {
      parentName: parentName,
      lastName: lastName,
      gender: gender
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
})