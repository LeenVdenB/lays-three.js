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
  console.log("Ga naar stap 2");
  // hier komt straks je naam-stap
});

// ⭐ Kleur voor de body
document.getElementById("colorBody").addEventListener("input", (e) => {
  if (!window.meshParts || !window.meshParts[0]) return;
  window.meshParts[0].material.color.set(e.target.value);
});

// ⭐ Kleur voor de titel
document.getElementById("colorTitle").addEventListener("input", (e) => {
  if (!window.meshParts || !window.meshParts[2]) return;
  window.meshParts[2].material.color.set(e.target.value);
});

// ⭐ Kleur voor de afbeelding / groot vlak
document.getElementById("colorImage").addEventListener("input", (e) => {
  if (!window.meshParts || !window.meshParts[3]) return;
  window.meshParts[3].material.color.set(e.target.value);
});
