const handleTasks = () => {
  const form = document.querySelector("#formElement");
  const tasksContainer = document.querySelector("#tasksContainer");
  const createdTasksBadge = document.querySelector("#createdTasksBadge");
  const completedTasksBadge = document.querySelector("#completedTasksBadge");

  if (!form || !tasksContainer || !createdTasksBadge || !completedTasksBadge)
    return;

  // Initial state
  // local storage
  const tasks = [
    {
      message: "task 1",
      completed: false,
    },
    {
      message: "task 2",
      completed: false,
    },
  ];

  const handleUpdateTaskBadges = () => {
    createdTasksBadge.textContent = tasks.length;

    const completedTasks = tasks.filter((task) => task.completed);

    completedTasksBadge.textContent = `${completedTasks.length} de ${tasks.length}`;
  };

  handleUpdateTaskBadges();

  console.log("tasks", tasks);

  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];

    tasksContainer.insertAdjacentHTML(
      "beforeend",
      `<li class="task-item">
    <button>
      <img src="assets/media/check.svg" />
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

    tasks.push({
      message: inputValue,
      completed: false,
    });

    document.querySelector("#add-task").value = "";

    tasksContainer.insertAdjacentHTML(
      "beforeend",
      `<li class="task-item">
    <button>
      <img src="assets/media/check.svg" />
    </button>
    <p>${inputValue}</p>
    <button>
      <img src="assets/media/trash.svg" />
    </button>
  </li>`
    );

    handleUpdateTaskBadges();
  };

  form.addEventListener("submit", handleCreateNewTask);
};

window.addEventListener("load", handleTasks);
