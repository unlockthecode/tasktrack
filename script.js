let editingTaskId = null;
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function delTasks() {
  localStorage.removeItem("tasks"); 
  tasks = [];
  renderTasks();
}

function deleteTask(id){
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString(); // Formats it to your local time
}

function showError(message) {
    const errorDiv = document.getElementById("error");
    errorDiv.textContent = message;
}

function clearError() {
    document.getElementById("error").textContent = "";
}

function addTask() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const status = document.getElementById("status").value;
  
  if (!title) return showError("Task needs a valid title!");
  if (!description) return showError("Task needs a description.");
  if (status === "" || status === "Status") return showError("Select a valid status.");

  const newTask = {
    id: Date.now(),
    title,
    description,
    status,
    comments: [],
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  clearError();
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("status").value = "";
}

function deleteComment(taskId, commentIndex) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.comments.splice(commentIndex, 1);  // Remove the comment by index
  saveTasks();
  renderTasks();
}

function renderTasks() {
  const filter = document.getElementById("filter").value;
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const filtered = filter ? tasks.filter(t => t.status === filter) : tasks;

  filtered.forEach(task => {
  const div = document.createElement("div");
  div.className = "task";

  if (task.id === editingTaskId) { // EDITING
    div.innerHTML = `
      <input id="edit-title-${task.id}" value="${task.title}">
      <textarea id="edit-desc-${task.id}">${task.description}</textarea><br>

      <button onclick="saveEdit(${task.id})">Save</button>
      <button onclick="cancelEdit()">Cancel</button>
    `;
  } else { // VIEWING
    div.innerHTML = ` 
        <div class="task-header">
            <h3>Task: ${task.title}</h3>
            <small class="created-date">${formatDate(task.createdAt)}</small>
        </div>

        <p><pre>${task.description}</pre></p>

      <label>Status:</label>
      <select onchange="updateStatus(${task.id}, this.value)">
        <option ${task.status === 'To Do' ? 'selected' : ''}>To Do</option>
        <option ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
        <option ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
      </select><br><br>

      <div>
        <strong>Comments:</strong>
        ${task.comments.map((c, index) => `
            <p class="comment">
            <span class="delete-comment" onclick="deleteComment(${task.id}, ${index})">&times;</span>${c}</p>`).join('')}
        <input onkeydown="if(event.key==='Enter') addComment(${task.id}, this)">
      </div>

      <button onclick="deleteTask(${task.id})">Delete</button>
      <button onclick="editTask(${task.id})">Edit</button>
    `;
  }

  document.getElementById("taskList").appendChild(div);
});
}

function editTask(id) {
  editingTaskId = id;
  renderTasks();
}

function cancelEdit() {
  editingTaskId = null;
  renderTasks();
}

function saveEdit(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newTitle = document.getElementById(`edit-title-${id}`).value.trim();
  const newDesc = document.getElementById(`edit-desc-${id}`).value.trim();

  if (!newTitle || !newDesc) {
    alert("Please fill out both fields.");
    return;
  }

  task.title = newTitle;
  task.description = newDesc;
  editingTaskId = null;

  saveTasks();
  renderTasks();
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
