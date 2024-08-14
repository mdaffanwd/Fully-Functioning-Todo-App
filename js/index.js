// TodoForm
let todoForm = document.querySelector(".todo-form");
// Todolist ul
let todoListUl = document.querySelector(".todo-list");
let todoListUlContainer = document.querySelector(".todo-list-container");
let taskList = [];

// =============================
// Form Submission Function
// =============================

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Form Inputs
  let todoTextInput = document.querySelector(".todo-text-input").value;
  let todoDescInput = document.querySelector(".todo-desc-input").value;
  let todoDateInput = document.querySelector(".todo-date-input").value;

  let newTask = {
    id: Date.now(),
    todo: todoTextInput,
    todoDesc: todoDescInput,
    dueDate: todoDateInput,
    completed: false,
    editable: false,
  };

  if (todoTextInput.length !== 0) {
    taskList.push(newTask);
    displayTask(newTask);
    saveToLocalStorage();
  }

  todoForm.reset();
});

// =============================
// Display Todo Function
// =============================
function displayTask(newTask) {
  let listItem = document.createElement("li");

  listItem.className = `list-item flex ${newTask.completed ? "completed" : ""}`;

  listItem.setAttribute("data-id", newTask.id);
  listItem.draggable = true;

  listItem.innerHTML = `
    <div class="flex left">
        <div class="round"></div>
        <div class="todo-details">
            <p class="todo-text">Task: ${newTask.todo}</p>
            ${
              newTask.todoDesc
                ? `<p class="todo-description">Description: ${newTask.todoDesc}</p>`
                : ""
            }
            ${
              newTask.dueDate
                ? `<p class="due-date">Due Date: ${newTask.dueDate}</p>`
                : ""
            }
        </div>
    </div>
    <div class="delete-edit flex right">
        <div class="edit-container flex">
            <p class="edit-btn btn btn-bg">Edit</p>
        </div>        
        <img class="todo-img hidden delete-btn" src="images/icon-cross.svg" />
    </div>
  `;

  todoListUl.appendChild(listItem);
  countTodos(taskList);

  saveToLocalStorage();

  // =============================
  // Handling Delete Todo Function
  // =============================
  listItem.querySelector(".delete-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    deleteTodo(listItem, newTask.id);
  });

  // =============================
  // Handling Completed Todo Function
  // =============================
  let tickImage = listItem.querySelector(".round");
  listItem.addEventListener("click", (e) => {
    e.stopPropagation();
    // console.log(contentParas);

    if (
      e.target.classList.contains("edit-btn") ||
      e.target.classList.contains("save-btn") ||
      e.target.classList.contains("cancel-btn")
    ) {
      return;
    }
    if (!listItem.classList.contains("editable")) {
      completedTask(listItem, newTask.id, tickImage);
    }
  });

  // =============================
  // Handling Edit Todo Function
  // =============================
  let editBtnContainer = listItem.querySelector(".delete-edit");
  editBtnContainer.querySelector(".edit-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    // console.log(editBtnContainer);
    editTodo(listItem, newTask.id);
  });

  // =============================
  // Handling clear completed Todo Function
  // =============================
  const clearCompleted = document.querySelectorAll(".clear-todos");

  clearCompleted.forEach((clearBtn) => {
    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      clearCompletedTodos();
    });
  });

  // =============================
  // Handling Drag and Drop
  // =============================
  let listItems = document.querySelectorAll(".list-item");
  listItems.forEach((listItem) => {
    listItem.addEventListener("dragstart", () => {
      setTimeout(() => listItem.classList.add("dragging"), 0);
    });
    listItem.addEventListener("dragend", () => {
      listItem.classList.remove("dragging");
    });
  });
  // sorting the todos
  todoListUl.addEventListener("dragover", sortTodoListOnDrag);
}

///////////////////////////////////
///////////////////////////////////

// -------> Functions <-------

///////////////////////////////////
///////////////////////////////////

// =============================
// Completed Task Function
// =============================
function completedTask(listItem, taskId, tickImage) {
  // listItem.style.background = 'red';
  taskList = taskList.map((todo) => {
    if (todo.id === taskId) {
      todo.completed = !todo.completed;
    }
    return todo;
  });
  listItem.classList.toggle("completed");
  tickImage.classList.toggle("completed");
  saveToLocalStorage();

  // Check if "Active" filter is selected and the task is completed
  const activeFilter = document.querySelector(".filters input:checked");
  filterTodo(activeFilter.id);
}

// =============================
// Edit Task Function
// =============================
function editTodo(listItem, taskId) {
  let clickedTask = taskList.find((task) => task.id === taskId);

  let todoDetails = listItem.querySelector(".todo-details");

  let editContainer = listItem.querySelector(".delete-edit .edit-container");

  let contentParas = todoDetails.querySelectorAll("p");

  contentParas.forEach((p) => {
    // p.setAttribute('contenteditable', 'true')
    p.contentEditable = true;
    listItem.classList.add("editable");
    contentParas[0].focus();
  });

  editContainer.innerHTML = `
  <p class="save-btn btn">Save</p>
  <p class="cancel-btn btn">Cancel</p>
`;

  //   ----------> when clicked on save btn <---------
  let saveBtn = editContainer.querySelector(".save-btn");
  saveBtn.addEventListener("click", () => {
    clickedTask.todo = contentParas[0].textContent.replace("Task: ", "").trim();

    if (clickedTask.todoDesc) {
      clickedTask.todoDesc = contentParas[1].textContent
        .replace("Description: ", "")
        .trim();
    }
    if (clickedTask.dueDate) {
      clickedTask.dueDate = contentParas[2].textContent
        .replace("Due Date: ", "")
        .trim();
    }

    saveToLocalStorage();

    // Disabling editing
    contentParas.forEach((p) => {
      p.contentEditable = false;
      listItem.classList.remove("editable");
    });

    editContainer.innerHTML = `<p class="edit-btn btn">Edit</p>`;

    // -----> To handle edit again <-------
    editContainer.querySelector(".edit-btn").addEventListener("click", () => {
      editTodo(listItem, taskId);
    });
  });

  //   ----------> when clicked on cancel btn <---------
  let cancelBtn = editContainer.querySelector(".cancel-btn");
  cancelBtn.addEventListener("click", () => {
    contentParas[0].textContent = `Task: ${clickedTask.todo}`;
    if (clickedTask.todoDesc) {
      contentParas[1].textContent = `Description: ${clickedTask.todoDesc}`;
    }
    if (clickedTask.dueDate) {
      contentParas[2].textContent = `Due Date: ${clickedTask.dueDate}`;
    }

    editContainer.innerHTML = `<p class="edit-btn btn">Edit</p>`;

    listItem.classList.remove("editable");

    editContainer.querySelector(".edit-btn").addEventListener("click", () => {
      editTodo(listItem, taskId);
    });
  });
}

// =============================
// Delete Todo Function
// =============================
function deleteTodo(todoItem, taskId) {
  taskList = taskList.filter((todoItem) => todoItem.id !== taskId);
  todoItem.remove();
  countTodos(taskList);
  saveToLocalStorage();
}

// =============================
// Todos count Function
// =============================

let todosCount = document.querySelectorAll("span.todo-count");
// todosCount.innerText = 1;
function countTodos(taskList) {
  if (todosCount) {
    todosCount.forEach((span) => {
      span.textContent = `${taskList.length}`;
    });
  }
}

// =============================
// Todos Filtering Function
// =============================

const filterBtns = document.querySelectorAll(".filters");
filterBtns.forEach((filterBtn) => {
  filterBtn.addEventListener("click", (e) => {
    filterTodo(e.target.id);
  });
});

function filterTodo(id) {
  const listItems = document.querySelectorAll(".todo-list .list-item");
  //   console.log(listItems);
  // console.log(listItems);
  if (id == "all") {
    listItems.forEach((todo) => {
      todo.classList.remove("none");
    });
  }
  if (id == "active") {
    listItems.forEach((todo) => {
      if (todo.classList.contains("completed")) {
        todo.classList.add("none");
      } else {
        todo.classList.remove("none");
      }
    });
  }
  if (id == "completed") {
    listItems.forEach((todo) => {
      if (!todo.classList.contains("completed")) {
        todo.classList.add("none");
      } else {
        todo.classList.remove("none");
      }
    });
  }
}

// =============================
// Clear CompletedTodos Function
// =============================

function clearCompletedTodos() {
  taskList = taskList.filter((todo) => !todo.completed);

  let completedListItems = document.querySelectorAll(
    ".todo-list .list-item.completed"
  );

  completedListItems.forEach((todo) => {
    todo.remove();
  });

  countTodos(taskList);
  saveToLocalStorage();
}
// =============================
// Drag and Drop Function
// =============================
function sortTodoListOnDrag(e) {
  e.preventDefault();
  const draggingItem = todoListUl.querySelector(".dragging");

  let draggingItemSiblings = [
    ...todoListUl.querySelectorAll(".list-item:not(.dragging)"),
  ];

  let nextListItem = draggingItemSiblings.find((sibling) => {
    return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
  });

  todoListUl.insertBefore(draggingItem, nextListItem);
}

// =============================
// Save to LocalStorage Function
// =============================
function saveToLocalStorage() {
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

// =============================
// Get from LocalStorage Function
// =============================
function getFromLocalStorage() {
  let storedList = localStorage.getItem("taskList");
  if (storedList) {
    taskList = JSON.parse(storedList);
    taskList.map((todo) => displayTask(todo));
  }
  countTodos(taskList);
}
getFromLocalStorage();
