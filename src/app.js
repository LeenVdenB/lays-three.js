const rulesCheck = document.getElementById("rulesCheck");
const startBtn = document.getElementById("startBtn");

rulesCheck.addEventListener("change", () => {
  if (rulesCheck.checked) {
    startBtn.disabled = false;
    startBtn.classList.add("enabled");
  } else {
    startBtn.disabled = true;
    startBtn.classList.remove("enabled");
  }
});

startBtn.addEventListener("click", () => {
  document.querySelector(".text").style.display = "none";
  // hier komt straks je configurator UI
});
