$(document).ready(function() {
    const confirmBtns = document.querySelectorAll(".confirm");
    const incompleteBtns = document.querySelectorAll(".incomplete");

    for (i = 0; i < confirmBtns.length; i++) {
        confirmBtns[i].addEventListener("click", function(event) {

            const id = event.target.id;

            $.ajax({
                method: "DELETE",
                url: "/api/approve_task/" + id
            }).then(function() {
                location.reload();
            })
        })
    }

    for (i = 0; i< incompleteBtns.length; i++) {
        incompleteBtns[i].addEventListener("click", function(event) {
            
            const taskData = {
                id: $(this).attr("id"),
                completed: false
            }

            $.ajax({
                method: "PUT",
                url: "api/reject_task",
                data: taskData
            }).then(function() {
                location.reload();
            })
        })
    }
})