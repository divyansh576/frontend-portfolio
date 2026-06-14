let pages = JSON.parse(localStorage.getItem("pages")) || [];
let currentPage = null;

const pageList = document.getElementById("pageList");
const pageTitle = document.getElementById("pageTitle");
const content = document.getElementById("content");
const newPageBtn = document.getElementById("newPage");
const addTodoBtn = document.getElementById("addTodo");
const toggleThemeBtn = document.getElementById("toggleTheme");

/* -------- Page Logic -------- */
function renderPages() {
  pageList.innerHTML = "";
  pages.forEach((page, index) => {
    const li = document.createElement("li");
    li.textContent = page.title || "Untitled";
    li.onclick = () => openPage(index);
    if (currentPage === index) li.classList.add("active");
    pageList.appendChild(li);
  });
}

function openPage(index) {
  currentPage = index;
  pageTitle.value = pages[index].title;
  content.innerHTML = pages[index].content;
  enableDrag();
  renderPages();
}

newPageBtn.onclick = () => {
  pages.push({ title: "New Page", content: "" });
  currentPage = pages.length - 1;
  save();
  openPage(currentPage);
};

function save() {
  localStorage.setItem("pages", JSON.stringify(pages));
}

pageTitle.oninput = () => {
  if (currentPage !== null) {
    pages[currentPage].title = pageTitle.value;
    save();
    renderPages();
  }
};

content.oninput = () => {
  if (currentPage !== null) {
    pages[currentPage].content = content.innerHTML;
    save();
  }
};

/* -------- Dark Mode -------- */
toggleThemeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/* -------- Add To-Do Block -------- */
addTodoBtn.onclick = () => {
  const block = document.createElement("div");
  block.className = "block todo";
  block.draggable = true;
  block.innerHTML = `
    <input type="checkbox">
    <span contenteditable="true">New Task</span>
  `;
  content.appendChild(block);
  enableDrag();
  save();
};

/* -------- Drag & Drop -------- */
function enableDrag() {
  const blocks = document.querySelectorAll(".block");

  blocks.forEach(block => {
    block.addEventListener("dragstart", () => {
      block.classList.add("dragging");
    });

    block.addEventListener("dragend", () => {
      block.classList.remove("dragging");
      pages[currentPage].content = content.innerHTML;
      save();
    });
  });

  content.addEventListener("dragover", e => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(content, e.clientY);

    if (!dragging) return;

    if (afterElement == null) {
      content.appendChild(dragging);
    } else {
      content.insertBefore(dragging, afterElement);
    }
  });ff
}

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll(".block:not(.dragging)")];

  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* -------- Initial Load -------- */
if (pages.length > 0) {
  openPage(0);
} else {
  newPageBtn.click();
}