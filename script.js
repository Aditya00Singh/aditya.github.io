// Task Data
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task');
const taskDateInput = document.getElementById('task-date');
const taskPriorityInput = document.getElementById('task-priority');
const addTaskButton = document.getElementById('add-task');
const filterButtons = document.querySelectorAll('.filter-btn');
const remainingCount = document.getElementById('remaining-count');
const clearCompletedButton = document.getElementById('clear-completed');
const darkModeToggle = document.getElementById('toggle-dark-mode');
const searchInput = document.getElementById('search-task');

// Initialize App
function init() {
  renderTasks();
  updateRemainingCount();
  checkDarkMode();
  setEventListeners();
}

// Add Task
function addTask() {
  const taskText = newTaskInput.value.trim();
  const dueDate = taskDateInput.value;
  const priority = taskPriorityInput.value;

  if (taskText) {
    tasks.push({
      id: Date.now(),
      text: taskText,
      dueDate,
      priority,
      completed: false,
    });

    // Reset input fields
    newTaskInput.value = '';
    taskDateInput.value = '';
    taskPriorityInput.value = 'medium';

    saveTasks();
    renderTasks();
  } else {
    alert('Task description cannot be empty!');
  }
}

// Render Tasks
function renderTasks() {
  taskList.innerHTML = '';

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  const searchQuery = searchInput.value.toLowerCase();
  const searchedTasks = filteredTasks.filter(task =>
    task.text.toLowerCase().includes(searchQuery)
  );

  // Generate task items
  searchedTasks.forEach(task => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.priority} ${task.completed ? 'completed' : ''} ${
      isOverdue ? 'overdue' : ''
    }`;
    taskItem.innerHTML = `
      <input type="checkbox" class="toggle-completed" ${task.completed ? 'checked' : ''} data-id="${task.id}">
      <span class="task-text">${task.text}</span>
      <small>${task.dueDate ? `Due: ${task.dueDate}` : ''}</small>
      <button class="delete-btn" data-id="${task.id}">❌</button>
    `;

    taskList.appendChild(taskItem);
  });

  updateRemainingCount();
}

// Update Remaining Task Count
function updateRemainingCount() {
  const remainingTasks = tasks.filter(task => !task.completed).length;
  remainingCount.textContent = remainingTasks;
}

// Save Tasks to Local Storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete Task
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
}

// Toggle Task Completion
function toggleTaskCompletion(taskId) {
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// Clear Completed Tasks
function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// Check Dark Mode on Load
function checkDarkMode() {
  const darkMode = JSON.parse(localStorage.getItem('darkMode'));
  if (darkMode) document.body.classList.add('dark');
}

// Set Event Listeners
function setEventListeners() {
  addTaskButton.addEventListener('click', addTask);

  taskList.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
      const taskId = parseInt(e.target.dataset.id, 10);
      deleteTask(taskId);
    } else if (e.target.classList.contains('toggle-completed')) {
      const taskId = parseInt(e.target.dataset.id, 10);
      toggleTaskCompletion(taskId);
    }
  });

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.dataset.filter;
      renderTasks();
    });
  });

  clearCompletedButton.addEventListener('click', clearCompletedTasks);

  darkModeToggle.addEventListener('click', toggleDarkMode);

  searchInput.addEventListener('input', renderTasks);
}

// Initialize App
init();

