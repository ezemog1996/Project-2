$(document).ready(() => {
    // Getting references to our form and input
    const submit = $("#btnSubmit");
    const childName = $("input#child-name");
    const birthMonth = $("dropdown#birth-month");
    const birthDay = $("dropdown#birth-day");
    const birthYear = $("dropdown#birth-year");
    const genderDropdown = $("dropdown#gender");
    const colorSelect = $("select#color");
  
    // When the submit button is clicked
    submit.on("click", event => {
      console.log(photo);
      event.preventDefault();
      const childData = {
        childName: childName.val().trim(),
        birthMonth: birthMonth.val(),
        birthDay: birthDay.val(),
        birthYear: birthYear.val(),
        genderDropdown: genderDropdown.val(),
        colorSelect: colorSelect.val()
      };
      console.log(childData);
  
      if (!childData.parentName || !childData.colorSelect) {
        return;
      }
      // If we have a name, run the childReg function
      childReg(childData.childName, childData.birthMonth, childData.birthDay, childData.birthYear, childData.gender);
      childName.val("Child Name");
      birthMonth.val("Birth Month");
      birthDay.val("Birth Day");
      birthYear.val("Birth Year");
      genderDropdown.val("Select Gender");
      colorSelect.val("Select Color");
    });
  
    // If successful, we are redirected to the dashboard
    // Otherwise we log any errors
    function childReg(childName, birthMonth, birthDay, birthYear, genderDropdown, colorSelect) {
      $.post("/api/child-registration", {
        childName: childName,
        birthMonth: birthMonth,
        birthDay: birthDay,
        birthYear: birthYear,
        genderDropdown: genderDropdown,
        colorSelect: colorSelect
      })
        .then(() => {
          window.location.replace("/login");
          // If there's an error, handle it by throwing up a bootstrap alert
        })
        .catch(handleLoginErr);
    }
  
    function handleLoginErr(err) {
      $("#alert .msg").text(err.responseJSON);
      $("#alert").fadeIn(500);
    }
  });