$(document).ready(() => {
    // Getting references to our form and input
    const save = $("#btnSave");
    const taskTitle = $("input#task-title");
    const taskDescription = $("input#task-description");
    const dateComplete = $("input#date-complete");
    const timeComplete = $("select#time-complete");
    const taskValue = $("input#task-value");
    const taskPriority = $("select#task-priority");
    const assignedBy = $("input#assigned-by");
  
    // When the submit button is clicked
    save.on("click", event => {
      console.log(photo);
      event.preventDefault();
      const taskData = {
        taskTitle: taskTitle.val().trim(),
        taskDescription: taskDescription.val().trim(),
        dateComplete: dateComplete.val().trim(),
        timeComplete: timeComplete.val(),
        taskValue: taskValue.val().trim(),
        taskPriority: taskPriority.val(),
        assignedBy: assignedBy.val().trim(),
      };
      console.log(taskData);
  
      if (!taskData.taskTitle || !taskData.taskValue) {
        return;
      }
      // If we have a name, run the childReg function
      createTask(taskData.taskTitle, taskData.taskDescription, taskData.dateComplete, taskData.timeComplete, taskData.taskValue, taskData.taskPriority, taskData.assignedBy);
      taskTitle.val("Task Title");
      taskDescription.val("Task Description");
      dateComplete.val("Date Complete");
      timeComplete.val("Time Complete");
      taskValue.val("Task Value");
      taskPriority.val("Task Priority");
      assignedBy.val("Assigned By");
    });
  
    // If successful, we are redirected to the dashboard
    // Otherwise we log any errors
    function createTask(childName, birthMonth, birthDay, birthYear, genderDropdown, colorSelect) {
      $.post("/api/create-task", {
        taskTitle: taskTitle,
        taskDescription: taskDescription,
        dateComplete: dateComplete,
        timeComplete: timeComplete,
        taskValue: taskValue,
        taskPriority: taskPriority,
        assignedBy: assignedBy
      })
        .then(() => {
          window.location.replace("/dashboard");
          // If there's an error, handle it by throwing up a bootstrap alert
        })
        .catch(handleLoginErr);
    }
  
    function handleLoginErr(err) {
      $("#alert .msg").text(err.responseJSON);
      $("#alert").fadeIn(500);
    }
  });