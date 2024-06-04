let tasks = [];

const handleUpdateTaskBadges = () => {
  const createdTasksBadge = document.querySelector("#createdTasksBadge");
  const completedTasksBadge = document.querySelector("#completedTasksBadge");

  if (!completedTasksBadge || !createdTasksBadge) {
    return;
  }
  createdTasksBadge.textContent = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed);

  completedTasksBadge.textContent = `${completedTasks.length} de ${tasks.length}`;
};

const handleCompleteTask = (taskIndex) => {
  console.log(`completed task ${taskIndex}`);
  const getMemoryTask = tasks[taskIndex];
  const taskElement = document.querySelector(`#task-item-${taskIndex}`);

  if (!taskElement || !getMemoryTask) {
    return;
  }

  // Change completed property in memory
  getMemoryTask.completed = true;

  // Update LocalStorage task

  const getLocalStorageTasks = window.localStorage.getItem("tasks");
  if (!getLocalStorageTasks) {
    return;
  }

  const parsedTasks = JSON.parse(getLocalStorageTasks);

  const getLsTask = parsedTasks[taskIndex];

  if (!getLsTask) {
    return;
  }

  getLsTask.completed = true;

  window.localStorage.setItem("tasks", JSON.stringify(parsedTasks));

  // add completed task to html
  taskElement.classList.add("completed");

  handleUpdateTaskBadges();
};

const handleTasks = () => {
  const form = document.querySelector("#formElement");
  const tasksContainer = document.querySelector("#tasksContainer");

  if (!form || !tasksContainer) {
    return;
  }

  const handleLocalStorageInit = () => {
    const getLocalStorageTasks = window.localStorage.getItem("tasks");

    if (!getLocalStorageTasks) {
      window.localStorage.setItem("tasks", JSON.stringify([]));
      return;
    }
    const parsedTasks = JSON.parse(getLocalStorageTasks);

    console.log("parsedTasks", parsedTasks);

    tasks = parsedTasks;
  };

  const addNewLsTask = (newTaskObj) => {
    const getLocalStorageTasks = window.localStorage.getItem("tasks");
    if (!getLocalStorageTasks) {
      return;
    }

    const parsedTasks = JSON.parse(getLocalStorageTasks);

    parsedTasks.push(newTaskObj);

    window.localStorage.setItem("tasks", JSON.stringify(parsedTasks));
  };

  handleLocalStorageInit();

  handleUpdateTaskBadges();

  console.log("tasks", tasks);

  for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
    const task = tasks[taskIndex];

    tasksContainer.insertAdjacentHTML(
      "beforeend",
      `<li class="task-item ${
        task.completed ? `completed` : ""
      }" id="task-item-${taskIndex}">
    <button class="completeTaskBtn" onclick="handleCompleteTask(${taskIndex})">
      <img class="uncompleted-icon" src="assets/media/check.svg" />
      <img class="completed-icon" src="assets/media/checked.svg" />
    </button>
    <p>${task.message}</p>
    <button>
      <img src="assets/media/trash.svg" />
    </button>
  </li>`
    );
  }

  const handleCreateNewTask = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const inputValue = formData.get("add-task");

    const newTaskObj = {
      message: inputValue,
      completed: false,
    };

    //add in memory
    tasks.push(newTaskObj);

    document.querySelector("#add-task").value = "";

    //add to HTML

    tasksContainer.insertAdjacentHTML(
      "beforeend",
      `<li class="task-item" id="task-item-${tasks.length - 1}">
      <button class="completeTaskBtn" onclick="handleCompleteTask("${
        tasks.length - 1
      }")>
      <img class="uncompleted-icon" src="assets/media/check.svg" />
      <img class="completed-icon" src="assets/media/checked.svg" />
      </button>
      <p>${inputValue}</p>
      <button>
        <img src="assets/media/trash.svg" />
      </button>
    </li>`
    );

    addNewLsTask(newTaskObj);

    handleUpdateTaskBadges();
  };

  form.addEventListener("submit", handleCreateNewTask);
};

window.addEventListener("load", handleTasks);
