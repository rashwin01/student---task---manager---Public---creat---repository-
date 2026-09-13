const form = document.getElementById("taskForm");
const title = document.getElementById("taskTitle");
const date = document.getElementById("taskDate");
const priority = document.getElementById("taskPriority");
const list = document.getElementById("taskList");
const clearCompleted = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

function saveTasks() {
  localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = '<div class="empty">No tasks added yet.</div>';
    return;
  }

  tasks.sort((a, b) => a.date.localeCompare(b.date));

  tasks.forEach(task => {
    const item = document.createElement("div");
    item.className = "task" + (task.completed ? " done" : "");

    item.innerHTML = `
      <div class="info">
        <div class="title">${escapeHtml(task.title)}</div>
        <div class="meta">Due: ${task.date} • Priority: ${task.priority}</div>
      </div>
      <div class="actions">
        <button class="complete" onclick="toggleTask(${task.id})">
          ${task.completed ? "Undo" : "Done"}
        </button>
        <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

form.addEventListener("submit", event => {
  event.preventDefault();

  tasks.push({
    id: Date.now(),
    title: title.value.trim(),
    date: date.value,
    priority: priority.value,
    completed: false
  });

  saveTasks();
  renderTasks();
  form.reset();
});

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
