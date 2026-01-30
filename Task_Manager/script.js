const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

let tasks = [];
let editingIndex = null;

//  Load tasks
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) tasks = JSON.parse(stored);
  renderTasks();
  updateProgress();
}

//  Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate(dateValue) {
  if (!dateValue) return "No due date";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "No due date";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

//  Render tasks
function renderTasks(list = tasks) {
  taskList.innerHTML = "";

  list.forEach((task, index) => {
    const li = document.createElement("li");

    if (task.completed) li.classList.add("completed");

    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.text;

    const priorityBadge = document.createElement("span");
    priorityBadge.classList.add("badge", task.priority);
    priorityBadge.textContent = task.priority.toUpperCase();

    const dateSpan = document.createElement("span");
    dateSpan.className = "due-chip";
    dateSpan.textContent = formatDate(task.date);

    const meta = document.createElement("div");
    meta.className = "task-meta";
    meta.append(priorityBadge, dateSpan);

    info.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const doneBtn = document.createElement("button");
    doneBtn.textContent = task.completed ? "Undo" : "Done";
    doneBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
      updateProgress();
    };

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => {
      taskInput.value = task.text;
      priorityInput.value = task.priority;
      dateInput.value = task.date;
      editingIndex = index;
      addBtn.textContent = "Save Task";
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      updateProgress();
    };

    actions.append(doneBtn, editBtn, deleteBtn);

    li.append(info, actions);
    taskList.appendChild(li);
  });
}

//  Add task
addBtn.onclick = () => {
  const text = taskInput.value.trim();
  if (!text) return alert("Enter a task!");

  if (editingIndex !== null) {
    tasks[editingIndex].text = text;
    tasks[editingIndex].priority = priorityInput.value;
    tasks[editingIndex].date = dateInput.value;
    editingIndex = null;
    addBtn.textContent = "Add Task";
  } else {
    tasks.push({
      text,
      priority: priorityInput.value,
      date: dateInput.value,
      completed: false
    });
  }

  saveTasks();
  renderTasks();
  updateProgress();

  taskInput.value = "";
  dateInput.value = "";
};

//  Search filter
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = tasks.filter(t => t.text.toLowerCase().includes(keyword));
  renderTasks(filtered);
});

//  Progress bar update
function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  progressText.textContent = `${percent}% Completed`;
  progressBar.style.width = percent + "%";
}

// Theme switch
themeToggle.onclick = () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  localStorage.setItem("theme", document.body.classList.contains("dark-mode"));
};

if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
}

loadTasks();
