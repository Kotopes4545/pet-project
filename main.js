const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const registerButton = document.querySelector('.register-button');
const modal = document.getElementById('modal');
const usernameInput = document.getElementById('username-input');
const registerLoginButton = document.getElementById('register-login-button');
const taskListContainer = document.querySelector('.task-list-container');

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  registerButton.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  registerLoginButton.addEventListener('click', () => {
    registerOrLogin();
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });

  addTaskButton.addEventListener('click', addTask);
  taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      removeLastTask();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = savedUser;
    taskListContainer.querySelector('h2').textContent = `Список задач (${currentUser})`;
    loadTasksFromStorage();
  }
});

function registerOrLogin() {
  const username = usernameInput.value.trim().toLowerCase();
  if (username) {
    currentUser = username;
    taskListContainer.querySelector('h2').textContent = `Список задач (${username})`;
    loadTasksFromStorage();
    // Сохраняем имя пользователя в localStorage
    localStorage.setItem('currentUser', currentUser);
  } else {
    alert('Пожалуйста, введите имя пользователя.');
  }
}

function addTask() {
  if (!currentUser) {
    alert('Пожалуйста войдите.');
    return;
  }

  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    const taskItem = createTaskItem(taskText);
    taskList.appendChild(taskItem);
    taskInput.value = '';
    saveTasksToStorage();
  }
}

function removeLastTask() {
  const lastTask = taskList.lastElementChild;
  if (lastTask) {
    if (lastTask.classList.contains('completed')) {
      lastTask.style.transition = 'transform 1s ease-in-out';
      lastTask.style.transform = 'translateY(50px)';
      setTimeout(() => {
        lastTask.remove();
        saveTasksToStorage();
      }, 1000);
    } else {
      lastTask.remove();
      saveTasksToStorage();
    }
  }
}

function createTaskItem(text) {
  const taskItem = document.createElement('li');
  const taskText = document.createElement('span');
  taskText.textContent = text;
  const deleteButton = document.createElement('span');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'Удалить';

  deleteButton.addEventListener('click', () => {
    taskItem.classList.toggle('completed');
    if (taskItem.classList.contains('completed')) {
      taskItem.style.textDecoration = 'line-through';
      taskList.appendChild(taskItem);
    } else {
      taskItem.style.textDecoration = 'none';
      taskItem.remove(); // Теперь удаляем задачу, если она не перечеркнута
    }
    saveTasksToStorage();
  });

  taskItem.appendChild(taskText);
  taskItem.appendChild(deleteButton);
  return taskItem;
}

function saveTasksToStorage() {
  if (!currentUser) return;
  const tasks = [];
  for (let i = 0; i < taskList.children.length; i++) {
    const taskItem = taskList.children[i];
    const taskText = taskItem.firstChild.textContent;
    const isCompleted = taskItem.classList.contains('completed');
    tasks.push({ text: taskText, completed: isCompleted });
  }
  localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  if (!currentUser) return;
  taskList.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
  tasks.forEach((task) => {
    const taskItem = createTaskItem(task.text);
    if (task.completed) {
      taskItem.classList.add('completed');
      taskItem.style.textDecoration = 'line-through'; // Перечеркиваем выполненные задачи
      taskList.appendChild(taskItem);
    } else {
      taskList.prepend(taskItem);
    }
  });
}

