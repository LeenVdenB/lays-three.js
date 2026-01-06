import { color } from "three/tsl";

const params = new URLSearchParams(window.location.search);
const userEmail = params.get("user") || "anonymous";

console.log("Ingelogde gebruiker:", userEmail);

// Als er geen user is → anonymous
const currentUser = userEmail || "anonymous";

console.log("Ingelogde gebruiker:", currentUser);

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
  document.querySelector(".step-1").style.display = "flex";
  document.getElementById("resetBtn").style.display = "block";
});

const backToIntro = document.getElementById("backToIntro");

backToIntro.addEventListener("click", () => {
  document.querySelector(".step-1").style.display = "none";
  document.querySelector(".text").style.display = "flex";
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

const toStep3 = document.getElementById("toStep3");
toStep3.addEventListener("click", () => {
  document.querySelector(".step-2").style.display = "none";
  document.querySelector(".step-3").style.display = "flex";
});

const backToStep2 = document.getElementById("backToStep2");
backToStep2.addEventListener("click", () => {
  document.querySelector(".step-3").style.display = "none";
  document.querySelector(".step-2").style.display = "flex";
});

const toStep4 = document.getElementById("toStep4");
toStep4.addEventListener("click", () => {
  document.querySelector(".step-3").style.display = "none";
  document.querySelector(".step-4").style.display = "flex";
});
const backToStep3 = document.getElementById("backToStep3");
backToStep3.addEventListener("click", () => {
  document.querySelector(".step-4").style.display = "none";
  document.querySelector(".step-3").style.display = "flex";
});

const toStep5 = document.getElementById("toStep5");
toStep5.addEventListener("click", () => {
  document.querySelector(".step-4").style.display = "none";
  document.querySelector(".step-5").style.display = "flex";
});

const backToStep4 = document.getElementById("backToStep4");
backToStep4.addEventListener("click", () => {
  document.querySelector(".step-5").style.display = "none";
  document.querySelector(".step-4").style.display = "flex";
});

document.getElementById("color").addEventListener("input", (e) => {
  if (!window.meshParts) return;

  const logoIndex = 1;

  window.meshParts.forEach((mesh, index) => {
    if (index !== logoIndex && mesh.material && mesh.material.color) {
      mesh.material.color.set(e.target.value);
    }
  });
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

document.getElementById("imageUpload").addEventListener("change", function (e) {
  console.log("👉 imageUpload change event fired", e.target.files[0]);
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    const ctx = window.imageCtx;
    const canvas = window.imageCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    );

    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    ctx.drawImage(img, x, y, w, h);
    window.imageTexture.needsUpdate = true;
  };

  img.src = URL.createObjectURL(file);
});

function resetConfigurator() {
  document
    .querySelectorAll(".text")
    .forEach((el) => (el.style.display = "none"));
  document.querySelector(".step-1").style.display = "flex";
  document.getElementById("colorBody").value = "#ff0000";
  document.getElementById("colorTitle").value = "#ff0000";
  document.getElementById("colorImage").value = "#ff0000";

  if (window.meshParts) {
    if (window.meshParts[0]) window.meshParts[0].material.color.set("#ff0000");
    if (window.meshParts[2]) window.meshParts[2].material.color.set("#ff0000");
    if (window.meshParts[3]) window.meshParts[3].material.color.set("#ff0000");
  }

  document.getElementById("titleInput").value = "";
  document.getElementById("titleSize").value = 120;
  document.getElementById("titleColor").value = "#000000";
  document.getElementById("titleFont").value = "Arial";

  if (window.titleCtx && window.titleCanvas) {
    window.titleCtx.clearRect(
      0,
      0,
      window.titleCanvas.width,
      window.titleCanvas.height
    );
    window.titleTexture.needsUpdate = true;
  }

  document.getElementById("imageUpload").value = "";

  if (window.imageCtx && window.imageCanvas) {
    window.imageCtx.clearRect(
      0,
      0,
      window.imageCanvas.width,
      window.imageCanvas.height
    );
    window.imageTexture.needsUpdate = true;
  }
  document.getElementById("flavorSelect1").value = "";
  document.getElementById("flavorSelect2").value = "";
  document.getElementById("flavorSelect3").value = "";

  document.getElementById("userName").value = "";
  document.getElementById("userEmail").value = "";
}

//bag opslaan naar backend
async function saveBag() {
  const storedUserId = localStorage.getItem("userId");
  const color = document.getElementById("color").value;
  const font = document.getElementById("titleFont").value;

  const title = document.getElementById("titleInput").value;

  const flavors = [
    document.getElementById("flavorSelect1").value,
    document.getElementById("flavorSelect2").value,
    document.getElementById("flavorSelect3").value,
  ];

  const userName = document.getElementById("userName").value;
  const userEmailInput = document.getElementById("userEmail").value;
  const screenshot = renderer.domElement.toDataURL("image/png");

  const bagData = {
    color: color,
    name: title,
    flavors: flavors,
    font: font,
    user: {
      name: userName,
      email: userEmailInput,
    },
    userId: storedUserId || currentUser,
    image: screenshot,
  };

  console.log("👉 Versturen naar backend:", bagData);

  // 6. Verstuur naar jouw backend
  const response = await fetch("https://lays-api.onrender.com/api/v1/bag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bagData),
  });

  const result = await response.json();
  console.log("👉 Backend antwoord:", result);

  alert("Je chipszak is verstuurd!");
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
document
  .getElementById("resetBtn")
  .addEventListener("click", resetConfigurator);
document.getElementById("submitConfig").addEventListener("click", saveBag);
document.getElementById("backHomeBtn").addEventListener("click", () => {
  window.location.href = "https://lays-do-us-a-flavor.netlify.app/";
});
