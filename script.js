const form = document.querySelector(".shopping");
const newItem = document.getElementById("item-input");
const submitButton = document.querySelector(".add-item");
const itemContainer = document.querySelector(".items");
const list = document.querySelector(".list");
let elementEditing;
const appKeyName = "Shopping List";
const clearButton = document.querySelector(".clear");

let editing = false;

form.addEventListener("submit", addItem);

clearButton.onclick = clear;

init();

function init() {
  const dict = localStorage.getItem(appKeyName);
  if (!dict) {
    localStorage.setItem(appKeyName, JSON.stringify({}));
  } else {
    const data = JSON.parse(dict);
    for (const [key, value] of Object.entries(data)) {
      const markup = createArticle(value, key);
      const delButton = markup.querySelector(".delete");
      const editButton = markup.querySelector(".edit");
      const clearButton = markup.querySelector(".clear");
      delButton.onclick = deleteItem;
      editButton.onclick = editItem;
      list.appendChild(markup);
    }
    if (Object.keys(data).length > 0) {
      itemContainer.classList.add("item-list");
    }
  }
}

newItem.addEventListener("input", () => {
  if (newItem.value === "") {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
});

function addItem(e) {
  e.preventDefault();
  const value = newItem.value;
  let dict = JSON.parse(localStorage.getItem(appKeyName));
  if (editing) {
    const id = elementEditing.getAttribute("data-id");
    const pElement = elementEditing.querySelector("p");
    pElement.innerText = newItem.value;
    dict[id] = newItem.value;
    localStorage.setItem(appKeyName, JSON.stringify(dict));
    postModal();
    submitButton.innerText = "Add Item";
    newItem.value = "";
    editing = false;
  } else {
    const id = new Date().getTime().toString();
    const article = createArticle(value, id);
    list.appendChild(article);
    const delButton = article.querySelector(".delete");
    const editButton = article.querySelector(".edit");
    delButton.onclick = deleteItem;
    editButton.onclick = editItem;
    dict[id] = value;
    localStorage.setItem(appKeyName, JSON.stringify(dict));
    displayMessage(`${value} successfully added to the list`, "success");
  }
  if (list.children.length > 0) {
    itemContainer.classList.add("shopping");
  }
  newItem.value = "";
}

function createArticle(name, id) {
  const article = document.createElement("article");
  article.setAttribute("data-id", id);
  article.classList.add("item-list");
  article.innerHTML = `<p class="item-title">${name}</p>
    <div class="button">
        <button class="edit">
            <i class="fas fa-edit"></i>
        </button>
        <button class="delete">
            <i class="fas fa-trash"></i>
        </button>
    </div>`;
  return article;
}

function displayMessage(message, level) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerText = message;
  toast.classList.add(level);
  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 2000);
}

async function deleteItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  const value = item.querySelector("p").innerText;
  try {
    const choice = await showModal(`Are you sure you want to delete ${value}`);
    if (choice) {
      list.removeChild(item);
      const id = item.getAttribute("data-id");
      const data = JSON.parse(localStorage.getItem(appKeyName));
      delete data[id];
      localStorage.setItem(appKeyName, JSON.stringify(data));
      const value = item.querySelector("p").innerText;
      displayMessage(`Item ${value} removed.`, "danger");
      if (list.children.length === 0) {
        itemContainer.classList.remove("shopping");
      }
    } else {
    }
  } catch (error) {
    console.log(error);
  }
}

function editItem(e) {
  preModal();
  elementEditing = e.currentTarget.parentElement.parentElement;
  newItem.disabled = false;
  submitButton.disabled = false;
  const pElement = elementEditing.querySelector("p");
  newItem.value = pElement.innerText;
  newItem.focus();
  submitButton.innerText = "Save";
  editing = true;
}

function showModal(message) {
  return new Promise((resolve) => {
    preModal();
    const div = document.createElement("div");
    div.classList.add("modal");
    div.innerHTML = `<p>${message}</p><div class="btn-row"><button id="yes">Yes</button><button id="no">No</button></div>`;
    document.body.appendChild(div);
    document.getElementById("yes").addEventListener("click", function () {
      document.querySelector(".modal").remove();
      postModal();
      resolve(true);
    });
    document.getElementById("no").addEventListener("click", function () {
      document.querySelector(".modal").remove();
      postModal();
      resolve(false);
    });
  });
}

function preModal() {
  submitButton.disabled = true;
  newItem.disabled = true;
  const editButtons = document.querySelectorAll(".edit");
  const deleteButtons = document.querySelectorAll(".delete");
  editButtons.forEach((btn) => {
    btn.onclick = null;
    btn.style.cursor = "auto";
  });
  deleteButtons.forEach((btn) => {
    btn.onclick = null;
    btn.style.cursor = "auto";
  });
  const clearButton = document.querySelector(".clear");
  clearButton.disabled = true;
}

function postModal() {
  submitButton.disabled = false;
  newItem.disabled = false;
  const editButtons = document.querySelectorAll(".edit");
  const deleteButtons = document.querySelectorAll(".delete");
  editButtons.forEach((btn) => {
    btn.onclick = editItem;
    btn.style.cursor = "pointer";
  });
  deleteButtons.forEach((btn) => {
    btn.onclick = deleteItem;
    btn.style.cursor = "pointer";
  });
  const clearButton = document.querySelector(".clear");
  clearButton.disabled = false;
}

async function clear() {
  try {
    const choice = await showModal(
      "Are you sure you want to delete all items?"
    );
    if (choice) {
      localStorage.setItem(appKeyName, JSON.stringify({}));
      list.innerHTML = "";
      displayMessage("All items removed from list.", "danger");
      itemContainer.classList.remove("show-shopping");
    } else {
    }
  } catch (error) {
    console.log(error);
  }
}
