// app.js

// 1. Session check
const user = sessionStorage.getItem("user");
if (!user) {
  window.location.href = "index.html"; // not logged in
}

// 2. Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("user");
  window.location.href = "index.html";
});
// app.js (continue)

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let editingId = null; // for update

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// CREATE + UPDATE
document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;
  const status = document.getElementById("status").value;

  if (editingId === null) {
    // CREATE
    const task = {
      id: Date.now(),
      title,
      description,
      priority,
      dueDate,
      status,
    };
    tasks.push(task);
  } else {
    // UPDATE
    tasks = tasks.map((t) =>
      t.id === editingId ? { ...t, title, description, priority, dueDate, status } : t
    );
    editingId = null;
  }

  saveTasks();
  e.target.reset();
  renderTasks();
});

// READ + DISPLAY
function renderTasks(filteredList = null) {
  const data = filteredList || tasks;
  const tbody = document.getElementById("taskTableBody");
  tbody.innerHTML = "";

  data.forEach((task) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${task.priority}</td>
      <td>${task.dueDate}</td>
      <td>
        <input type="checkbox" ${task.status === "Completed" ? "checked" : ""} data-id="${task.id}" class="toggleStatus">
        ${task.status}
      </td>
      <td>
        <button class="editBtn" data-id="${task.id}">Edit</button>
        <button class="deleteBtn" data-id="${task.id}">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

renderTasks();

// DELETE + TOGGLE + EDIT handlers
document.getElementById("taskTableBody").addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("deleteBtn")) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }

  if (e.target.classList.contains("editBtn")) {
    const task = tasks.find((t) => t.id === id);
    editingId = id;
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("priority").value = task.priority;
    document.getElementById("dueDate").value = task.dueDate;
    document.getElementById("status").value = task.status;
  }

  if (e.target.classList.contains("toggleStatus")) {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" } : t
    );
    saveTasks();
    renderTasks();
  }
});
let timer;
function debounce(fn, delay) {
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
const filterStatus = document.getElementById("filterStatus");
const filterPriority = document.getElementById("filterPriority");
const filterDate = document.getElementById("filterDate");
const searchInput = document.getElementById("searchInput");

function applyFilters() {
  let filtered = [...tasks];

  const statusVal = filterStatus.value;
  const priorityVal = filterPriority.value;
  const dateVal = filterDate.value;
  const searchVal = searchInput.value.toLowerCase();

  if (statusVal) {
    filtered = filtered.filter((t) => t.status === statusVal);
  }

  if (priorityVal) {
    filtered = filtered.filter((t) => t.priority === priorityVal);
  }

  if (dateVal) {
    filtered = filtered.filter((t) => t.dueDate === dateVal);
  }

  if (searchVal) {
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(searchVal) ||
        t.description.toLowerCase().includes(searchVal)
    );
  }

  renderTasks(filtered);
}

// attach filters
filterStatus.addEventListener("change", applyFilters);
filterPriority.addEventListener("change", applyFilters);
filterDate.addEventListener("change", applyFilters);

// search with debounce
searchInput.addEventListener(
  "input",
  debounce(() => applyFilters(), 300)
);
