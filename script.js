let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function delTasks() {
  localStorage.removeItem("tasks"); 
  tasks = [];
  renderTasks();
}

function addTask() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const status = document.getElementById("status").value;

  if (!title) return alert("Task needs a valid title!");
  else if (!description) return alert("Task needs a description");
  else if (status === "" || status === "Status") return alert("Select a valid status.");

  const newTask = {
    id: Date.now(),
    title,
    description,
    status,
    comments: []
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("status").value = "";
}

function renderTasks() {
  const filter = document.getElementById("filter").value;
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const filtered = filter ? tasks.filter(t => t.status === filter) : tasks;

  filtered.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      <h3>${task.title} (${task.status})</h3>
      <p>${task.description}</p>

      <label>Status:</label>
      <select onchange="updateStatus(${task.id}, this.value)">
        <option ${task.status === 'To Do' ? 'selected' : ''}>To Do</option>
        <option ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
        <option ${task.status === 'Done' ? 'selected' : ''}>Done</option>
      </select><br><br>

      <div>
        <strong>Comments:</strong>
        ${task.comments.map(c => `<p class="comment">- ${c}</p>`).join('')}
        <input onkeydown="if(event.key==='Enter') addComment(${task.id}, this)">
      </div>
    `;
    list.appendChild(div);
  });
}

function updateStatus(id, newStatus) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = newStatus;
    saveTasks();
    renderTasks();
  }
}

function addComment(id, input) {
  const comment = input.value.trim();
  if (!comment) return;

  const task = tasks.find(t => t.id === id);
  if (task) {
    task.comments.push(comment);
    input.value = "";
    saveTasks();
    renderTasks();
  }
}

// Initial render when page loads 
renderTasks();
