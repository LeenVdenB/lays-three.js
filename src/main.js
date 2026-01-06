import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.selectedMesh = null;

//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

document.body.appendChild(renderer.domElement);

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(0, 4, 13); //x, y, z

//OrbitControls toevoegen
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 15;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(-2, 2, 0);
controls.minAzimuthAngle = -Math.PI * (70 / 180); // -70°
controls.maxAzimuthAngle = Math.PI * (70 / 180); // +70°

// stand loader
const stand = new GLTFLoader();
stand.load("/3d-object/small_stand.glb", (gltf) => {
  const model = gltf.scene;
  model.position.set(1, -7, 1);
  model.rotation.y = 0;
  model.scale.set(8, 8, 8); // vergroot indien te klein

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.color.set("#8b5a2b");
    }
  });

  scene.add(model);
});

let chipsModel = null;
//gltf loader van de chipszak
const loader = new GLTFLoader();
loader.load("/3d-object/chips_arthur_de_klerck.glb", (gltf) => {
  const model = gltf.scene;
  model.position.set(-4, 4, 0);
  model.rotation.y = 0.5;
  model.scale.set(3, 3, 3); // vergroot indien te klein

  model.name = "chips";
  chipsModel = model;
  let meshIndex = 0;

  model.traverse((child) => {
    if (child.isMesh) {
      child.userData.index = meshIndex;
      console.log("mesh", meshIndex, "=", child.name);
      meshIndex++;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(model);
});

//light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 10);
spotLight.position.set(0, 12, 5); //x, y, z
spotLight.castShadow = true;
spotLight.shadow.biasq = -0.0001;
scene.add(spotLight);

new RGBELoader().load("/environment/studio_small_03_4k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = texture;
  scene.environment = texture;
});

//render scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}
animate();

window.addEventListener("click", (event) => {
  // muispositie normaliseren
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // raycast uitvoeren
  raycaster.setFromCamera(mouse, camera);

  // alleen raycasten op de chipszak, niet op de hele scene
  if (!chipsModel) return;

  const intersects = raycaster.intersectObjects(chipsModel.children, true);

  if (intersects.length === 0) {
    console.log("Niets geraakt");
    return;
  }

  window.selectedMesh = intersects[0].object;
  console.log("Geselecteerd mesh index:", window.selectedMesh.userData.index);
  window.selectedMesh.material.color.set("#ff0000");
});
