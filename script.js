
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const todoList = document.querySelector('#todo-list');
const taskCount = document.querySelector('#task-count');
const emptyState = document.querySelector('#empty-state');
const filterButtons = document.querySelectorAll('.filter-button');

let tasks = [];
let currentFilter = 'all';

function updateTaskCount() {
  const count = tasks.length;
  taskCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'}`;
}

function renderTasks() {
  todoList.innerHTML = '';
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  if (!filteredTasks.length) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  filteredTasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `todo-item${task.completed ? ' completed' : ''}`;
    item.innerHTML = `
      <label class="task-checkbox">
        <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" />
        <span class="task-title">${task.text}</span>
      </label>
      <div class="task-actions">
        <button type="button" data-action="toggle" data-id="${task.id}">✓</button>
        <button type="button" data-action="remove" data-id="${task.id}">✕</button>
      </div>
    `;

    const toggleButton = item.querySelector('[data-action="toggle"]');
    const removeButton = item.querySelector('[data-action="remove"]');
    const checkbox = item.querySelector('input[type="checkbox"]');

    toggleButton.addEventListener('click', () => toggleTask(task.id));
    removeButton.addEventListener('click', () => removeTask(task.id));
    checkbox.addEventListener('change', () => toggleTask(task.id));

    todoList.appendChild(item);
  });
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const newTask = {
    id: Date.now().toString(),
    text: trimmed,
    completed: false,
  };

  tasks.unshift(newTask);
  taskInput.value = '';
  updateTaskCount();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  updateTaskCount();
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  renderTasks();
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(taskInput.value);
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

updateTaskCount();
renderTasks();
