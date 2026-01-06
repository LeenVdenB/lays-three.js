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
  document.querySelector(".text").style.display = "none"; // intro weg
  document.querySelector(".step-1").style.display = "flex"; // stap 1 tonen
});

const backToIntro = document.getElementById("backToIntro");

backToIntro.addEventListener("click", () => {
  document.querySelector(".step-1").style.display = "none";
  document.querySelector(".text").style.display = "flex"; // intro terug
});

const toStep2 = document.getElementById("toStep2");
toStep2.addEventListener("click", () => {
  document.querySelector(".step-1").style.display = "none";
  document.querySelector(".step-2").style.display = "flex";
});

const backToStep1 = document.getElementById("backToStep1");

backToStep1.addEventListener("click", () => {
  document.querySelector(".step-2").style.display = "none";
  document.querySelector(".step-1").style.display = "flex";
});

document.getElementById("colorBody").addEventListener("input", (e) => {
  if (!window.meshParts || !window.meshParts[0]) return;
  window.meshParts[0].material.color.set(e.target.value);
});

document.getElementById("colorTitle").addEventListener("input", (e) => {
  if (!window.meshParts || !window.meshParts[2]) return;
  window.meshParts[2].material.color.set(e.target.value);
});

document.getElementById("colorImage").addEventListener("input", (e) => {
  if (!window.meshParts || !window.meshParts[3]) return;
  window.meshParts[3].material.color.set(e.target.value);
});

function updateTitleCanvas() {
  const text = document.getElementById("titleInput").value;
  const color = document.getElementById("titleColor").value;
  const font = document.getElementById("titleFont").value;

  const ctx = window.titleCtx;
  const canvas = window.titleCanvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const size = document.getElementById("titleSize").value;
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  window.titleTexture.needsUpdate = true;
}

document
  .getElementById("titleInput")
  .addEventListener("input", updateTitleCanvas);
document
  .getElementById("titleColor")
  .addEventListener("input", updateTitleCanvas);
document
  .getElementById("titleFont")
  .addEventListener("change", updateTitleCanvas);
document
  .getElementById("titleSize")
  .addEventListener("input", updateTitleCanvas);
