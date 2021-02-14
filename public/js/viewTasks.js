$(document).ready(function() {

    const taskCheck = document.querySelectorAll(".form-check-input");

    for (i = 0; i < taskCheck.length; i++) {
        taskCheck[i].addEventListener("click", function() {
            const taskData = {
                id: $(this).attr("data-id"),
                completed: $(this).val()
            }
            
            $.ajax({
                method: "PUT",
                url: "api/complete_task",
                data: taskData
            }).then(function() {
                location.reload();
            })
        })
    }
})