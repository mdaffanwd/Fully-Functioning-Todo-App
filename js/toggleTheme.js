let body = document.body;
let themeIcon = document.querySelector(".theme-btn");
let background = document.querySelector(".background");

// =============================
//  Theme changing Functionality
// =============================
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  themeIcon.src = "images/icon-sun.svg";
}
themeIcon.addEventListener("click", (e) => {
  // console.log(e.target);
  e.stopImmediatePropagation();
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeIcon.src = "images/icon-sun.svg";
  } else {
    localStorage.setItem("theme", "light");
    themeIcon.src = "images/icon-moon.svg";
    background.style.background = `url("images/bg-desktop-light.jpg") no-repeat;`;
  }
});
