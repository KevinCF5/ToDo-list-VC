import { v4 as uuidv4 } from "uuid";

window.addEventListener("load", () => {
  customElements.define("tasks-container", Tasks);
});

interface ITask {
  id: string;
  message: string;
  completed: boolean;
}

class Tasks extends HTMLElement {
  form: HTMLFormElement;
  tasksContainer: HTMLDivElement;
  tasks: ITask[] = [];

  constructor() {
    super();

    const form = document.querySelector("#formElement") as HTMLFormElement;
    const tasksContainer = document.querySelector(
      "#tasksContainer"
    ) as HTMLDivElement;

    if (!form || !tasksContainer) {
      return;
    }

    this.form = form;
    this.tasksContainer = tasksContainer;
    this.form.addEventListener("submit", this.handleCreateNewTask.bind(this));

    // get values from localStorage
    this.handleLocalStorageInit();
    // update task badges
    this.handleUpdateTaskBadges();

    for (let taskIndex = 0; taskIndex < this.tasks.length; taskIndex++) {
      const task = this.tasks[taskIndex];

      tasksContainer.insertAdjacentHTML(
        "beforeend",
        `<li class="task-item ${
          task.completed ? `completed` : ""
        }" id="task-item-${task.id}">
        <button id="completeTaskBtn-${task.id}" class="completeTaskBtn">
          <img class="uncompleted-icon" src="assets/media/check.svg" />
          <img class="completed-icon" src="assets/media/checked.svg" />
        </button>
        <p>${task.message}</p>
        <button id="removeTaskBtn-${task.id}">
          <img src="assets/media/trash.svg" />
        </button>
        </li>`
      );

      const completeTaskBtn = document.querySelector(
        `#completeTaskBtn-${task.id}`
      ) as HTMLButtonElement;
      completeTaskBtn.addEventListener("click", () =>
        this.handleCompleteTask(task.id)
      );

      const removeTaskBtn = document.querySelector(
        `#removeTaskBtn-${task.id}`
      ) as HTMLButtonElement;
      removeTaskBtn.addEventListener("click", () =>
        this.handleRemoveTask(task.id)
      );
    }
  }

  handleLocalStorageInit() {
    const getLocalStorageTasks = window.localStorage.getItem("tasks");

    if (!getLocalStorageTasks) {
      window.localStorage.setItem("tasks", JSON.stringify([]));
      return;
    }
    const parsedLsTasks = JSON.parse(getLocalStorageTasks);

    console.log("parsedTasks", parsedLsTasks);

    this.tasks = parsedLsTasks;

    console.log("tasks ahah", this.tasks);
  }

  handleUpdateTaskBadges() {
    const completedTasksBadge = document.querySelector(
      "#completedTasksBadge"
    ) as HTMLDivElement;
    const createdTasksBadge = document.querySelector(
      "#createdTasksBadge"
    ) as HTMLDivElement;

    if (!completedTasksBadge || !createdTasksBadge) {
      return;
    }
    createdTasksBadge.textContent = String(this.tasks.length);

    const completedTasks = this.tasks.filter((task) => task.completed);

    completedTasksBadge.textContent = `${completedTasks.length} de ${this.tasks.length}`;
  }

  addNewLsTask(newTaskObj: ITask) {
    const getLocalStorageTasks = window.localStorage.getItem("tasks");
    if (!getLocalStorageTasks) {
      return;
    }

    const parsedLsTasks = JSON.parse(getLocalStorageTasks);

    parsedLsTasks.push(newTaskObj);

    window.localStorage.setItem("tasks", JSON.stringify(parsedLsTasks));
  }

  handleCreateNewTask(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const inputValue = formData.get("add-task") as string;

    const newTaskObj: ITask = {
      id: uuidv4(),
      message: inputValue,
      completed: false,
    };

    console.log("tasks ahahah", this.tasks);

    //add in memory
    this.tasks.push(newTaskObj);

    (document.querySelector("#add-task") as HTMLInputElement).value = "";

    //add to HTML

    this.tasksContainer.insertAdjacentHTML(
      "beforeend",
      `<li class="task-item" id="task-item-${newTaskObj.id}">
      <button id="completeTaskBtn-${newTaskObj.id}" class="completeTaskBtn">
      <img class="uncompleted-icon" src="assets/media/check.svg" />
      <img class="completed-icon" src="assets/media/checked.svg" />
      </button>
      <p>${inputValue}</p>
      <button id="removeTaskBtn-${newTaskObj.id}">
        <img src="assets/media/trash.svg" />
      </button>
    </li>`
    );

    const completeTaskBtn = document.querySelector(
      `#completeTaskBtn-${newTaskObj.id}`
    ) as HTMLButtonElement;
    completeTaskBtn.addEventListener("click", () =>
      this.handleCompleteTask(newTaskObj.id)
    );

    const removeTaskBtn = document.querySelector(
      `#removeTaskBtn-${newTaskObj.id}`
    ) as HTMLButtonElement;
    removeTaskBtn.addEventListener("click", () =>
      this.handleRemoveTask(newTaskObj.id)
    );

    this.addNewLsTask(newTaskObj);

    this.handleUpdateTaskBadges();
  }

  handleCompleteTask(taskId: string) {
    console.log(`completed task ${taskId}`);
    const getMemoryTask = this.tasks.find((task) => task.id === taskId);
    const taskElement = document.querySelector(`#task-item-${taskId}`);

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

    const parsedLsTasks: ITask[] = JSON.parse(getLocalStorageTasks);

    const getLsTask = parsedLsTasks.find((task) => task.id === taskId);

    if (!getLsTask) {
      return;
    }

    getLsTask.completed = true;

    window.localStorage.setItem("tasks", JSON.stringify(parsedLsTasks));

    // add completed task to html
    taskElement.classList.add("completed");

    this.handleUpdateTaskBadges();
  }

  handleRemoveTask(taskId: string) {
    console.log("taskIndex", taskId);
    const taskElement = document.querySelector(`#task-item-${taskId}`);

    if (!taskElement) {
      return;
    }

    taskElement.remove();

    const getLocalStorageTasks = window.localStorage.getItem("tasks");

    if (!getLocalStorageTasks) {
      return;
    }

    const parsedLocalStorageTasks: ITask[] = JSON.parse(getLocalStorageTasks);

    const getLsTaskIndex = parsedLocalStorageTasks.findIndex(
      (task) => task.id === taskId
    );

    parsedLocalStorageTasks.splice(getLsTaskIndex, 1);

    const getTaskIndex = this.tasks.findIndex((task) => task.id === taskId);

    this.tasks.splice(getTaskIndex, 1);

    window.localStorage.setItem(
      "tasks",
      JSON.stringify(parsedLocalStorageTasks)
    );

    this.handleUpdateTaskBadges();
  }
}
