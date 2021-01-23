$(document).ready(() => {
    console.log("Ready!");

    const titleInput = $("#task-title");
    const descriptionInput = ("#task-description");
    const date = ("#date");
    const time = ("#time");
    const points = ("#points");
    const priority = ("#priority");
    const assignedBy = ("#assigned-by");

    document.querySelector("#saveTask").addEventListener("click", event => {
        event.preventDefalult();
        const taskData = {
            title: titleInput.val().trim(),
            description: descriptionInput.val().trim(),
            date: date.val().trim(),
            time: time.val().trim(),
            points: points.val().trim(),
            priority: priority.val().trim(),
            assignedBy: assignedBy.val().trim()
        };

        if (!taskData.title || !taskData.description || !taskData.date || !taskData.time || !taskData.points || !tasksData.priority || !taskData.assignmedBy) {
            return
        }

        saveTask(
            taskData.title,
            taskData.description,
            taskData.date,
            taskData.time,
            taskData.points,
            taskData.priority,
            taskData.assignedBy
        );
        titleInput.val("");
        descriptionInput.val("");
        date.val("");
        time.val("Select time");
        points.val("");
        priority.val("Select Priority Level");
        assignedBy.val("");

    });

    function saveTask(title, description, date, time, points, priority, assignedBy) {
        $.post("/api/create-task", {
            title,
            description,
            date,
            time,
            points,
            priority,
            assignedBy
        })
          .then(() => {
              console.log("Task added!");
          })
          .catch(handleSaveErr);
    }

    function handleSaveErr(err) {
        console.log("There was an Error!");
    }

  });