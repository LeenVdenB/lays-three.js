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

const colorPicker = document.getElementById("colorPicker");

colorPicker.addEventListener("input", () => {
  if (!window.selectedMesh) return; // geen mesh geselecteerd

  const hex = colorPicker.value;
  window.selectedMesh.material.color.set(hex);
  console.log("Gekozen kleur:", hex);

  // later: chipszak materiaal aanpassen
});
