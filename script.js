let newTask = document.getElementById("input-task");
let addBtn = document.getElementById("add-btn");
let searchTitle = document.getElementById("search-title");
let dateFrom = document.getElementById("date-from");
let dateTo = document.getElementById("date-to");
let searchBtn = document.getElementById("search-btn");
let filterBtn = document.getElementById("filter-btn");
let taskList = document.getElementById("task-list");
let taskLists = document.getElementById("task-lists");
let loader = document.getElementById("loader");
let previousBtn = document.getElementById("previous-btn");
let nextBtn = document.getElementById("next-btn");

let listData = [];
let filteredList = [];
let currentPage = 0;
let todoperpage = 5;

dateTo.setAttribute("max", new Date().toISOString().split("T")[0]);
dateFrom.addEventListener("change", () => {
  dateTo.setAttribute("min", dateFrom.value);
});
dateTo.addEventListener("change", () => {
  dateFrom.setAttribute("max", dateTo.value);
});
addBtn.addEventListener("click", addNewToDo);
filterBtn.addEventListener("click", applyFilter);
searchBtn.addEventListener("click", searchWithTitle);
nextBtn.addEventListener("click", () => {
  if (currentPage < filteredList.length / todoperpage - 1) {
    currentPage++;
    showTaskList(filteredList, currentPage);
  }
});
previousBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    showTaskList(filteredList, currentPage);
  }
});

function applyFilter() {
  if (dateFrom.value && dateTo.value) {
    let from = new Date(dateFrom.value);
    let to = new Date(dateTo.value);
    filteredList = listData.filter((list) => {
      let listDate = new Date(list.date);
      return listDate >= from && listDate <= to;
    });
    showTaskList(filteredList, currentPage);
    currentPage = 0;
  } else {
    filteredList.listData;
    currentPage = 0;
    showTaskList(filteredList, currentPage);
  }
}

function searchWithTitle() {
  if (searchTitle.value === "") {
    showTaskList(filteredList, currentPage);
  }
  taskList.innerHTML = "";
  let match = 0;
  let searchedTitle = searchTitle.value.trim().toLowerCase();
  filteredList.forEach((list) => {
    if (list.todo.toLowerCase().includes(searchedTitle)) {
      match++;
      searchTitle.value = "";
      let div = document.createElement("div");
      let p = document.createElement("p");
      let span = document.createElement("span");
      p.innerText = list.todo;
      span.innerText = `${
        list.completed ? "completed" : "incomplete"
      } | ${new Date(list.date).toLocaleDateString()}`;
      div.className = "task";
      span.className = "task-desc";
      div.appendChild(p);
      div.appendChild(span);
      taskList.appendChild(div);
    }
  });
  if (match === 0) {
    taskList.innerHTML = "<h2> No tile matched ...</h2>";
  }
}

function assignDate(listData) {
  listData.forEach((list) => {
    list.date = randomDate();
  });
}

function randomDate() {
  let date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString().split("T")[0];
}

async function addNewToDo() {
  let newTodo = {};
  newTodo.todo = newTask.value;
  newTodo.completed = false;
  newTodo.date = new Date().toISOString();
  newTodo.userId = 50;
  try {
    const response = await axios.post(
      "https://dummyjson.com/todos/add",
      newTodo
    );
    console.log("Added Todo:", response.data);
    let div = document.createElement("div");
    let p = document.createElement("p");
    let span = document.createElement("span");
    p.innerText = response.data.todo;
    span.innerText = `${
      response.data.completed ? "completed" : "incomplete"
    } | ${new Date().toLocaleDateString()}`;
    div.className = "task";
    span.className = "task-desc";
    div.appendChild(p);
    div.appendChild(span);
    taskList.prepend(div);
    listData = [newTodo, ...listData];
    filteredList = listData;
  } catch (error) {
    console.error("Failed to add todo:", error);
    alert("Error adding task!");
  }
}

const showTaskList = function (listData, startIdx = 0, listPerpage = 5) {
  taskList.innerHTML = "";
  let start = startIdx * listPerpage;
  listData.slice(start, start + listPerpage).forEach((list) => {
    let div = document.createElement("div");
    let p = document.createElement("p");
    let span = document.createElement("span");
    p.innerText = list.todo;
    span.innerText = `${
      list.completed ? "completed" : "incomplete"
    } | ${new Date(list.date).toLocaleDateString()}`;
    div.className = "task";
    span.className = "task-desc";
    div.appendChild(p);
    div.appendChild(span);
    taskList.appendChild(div);
  });
};

const fetchList = async () => {
  try {
    let response = await fetch("https://dummyjson.com/todos");
    listData = (await response.json()).todos;
    console.log("data fetched...");
    assignDate(listData);
    filteredList = listData;
    loader.style.display = "none";
    taskLists.style.display = "block";
    showTaskList(listData, 0);
  } catch (error) {
    alert("unable to fetch data...");
    console.log(error);
  }
};
fetchList();
