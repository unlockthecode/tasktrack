let tasks = JSON.parse(localStorage.getItem(tasks) || "[]")

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function delTasks(){
    localStorage.clear
}

function addTask(){
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const status = document.getElementById("status").value;

    if (!title) return alert("Task needs a valid title!");
    else if (!description) return alert("Task needs a description");
    else if (status === "Status") return alert("Select a valid status.")

        
}