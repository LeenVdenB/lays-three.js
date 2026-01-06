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
controls.minAzimuthAngle = -Math.PI * (70 / 180);
controls.maxAzimuthAngle = Math.PI * (70 / 180);

// stand loader
const stand = new GLTFLoader();
stand.load("/3d-object/small_stand.glb", (gltf) => {
  const model = gltf.scene;
  model.position.set(1, -7, 1);
  model.rotation.y = 0;
  model.scale.set(8, 8, 8);

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.color.set("#8b5a2b");
    }
  });

  scene.add(model);
});

//titel text
const titleCanvasElement = document.createElement("canvas");
titleCanvasElement.width = 1024;
titleCanvasElement.height = 256;

const titleCtxElement = titleCanvasElement.getContext("2d");
titleCtxElement.clearRect(
  0,
  0,
  titleCanvasElement.width,
  titleCanvasElement.height
);
window.titleCanvas = titleCanvasElement;
window.titleCtx = titleCtxElement;

//image canvas
const imageCanvasElement = document.createElement("canvas");
imageCanvasElement.width = 1024;
imageCanvasElement.height = 1024;

const imageCtxElement = imageCanvasElement.getContext("2d");
imageCtxElement.clearRect(
  0,
  0,
  imageCanvasElement.width,
  imageCanvasElement.height
);

window.imageCanvas = imageCanvasElement;
window.imageCtx = imageCtxElement;

let chipsModel = null;
//gltf loader van de chipszak
const loader = new GLTFLoader();
loader.load("/3d-object/chips_arthur_de_klerck.glb", (gltf) => {
  const model = gltf.scene;
  model.position.set(-4, 4, 0);
  model.rotation.y = 0.5;
  model.scale.set(3, 3, 3);

  model.name = "chips";
  chipsModel = model;
  window.meshParts = [];
  let meshIndex = 0;

  model.traverse((child) => {
    if (child.isMesh) {
      child.userData.index = meshIndex;
      window.meshParts[meshIndex] = child;
      console.log("mesh", meshIndex, "=", child.name);
      meshIndex++;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  // Titel toevoegen als een apart vlak met de canvas als textuur
  const titleTexture = new THREE.CanvasTexture(window.titleCanvas);
  const titleMaterial = new THREE.MeshBasicMaterial({
    map: titleTexture,
    transparent: true,
  });
  const titlePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 0.6),
    titleMaterial
  );
  titlePlane.position.copy(window.meshParts[2].position);
  titlePlane.position.z += 1.5;
  titlePlane.position.y += 4.3;
  titlePlane.position.x -= 4;
  titlePlane.quaternion.copy(window.meshParts[2].quaternion);
  titlePlane.rotation.x += 6;

  scene.add(titlePlane);

  window.titlePlane = titlePlane;
  window.titleTexture = titleTexture;

  //afbeelding toevoegen als een apart vlak met de canvas als textuur
  const imageTexture = new THREE.CanvasTexture(window.imageCanvas);
  imageTexture.flipY = false;

  const imageMaterial = new THREE.MeshBasicMaterial({
    map: imageTexture,
    transparent: true,
  });
  const imagePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 2),
    imageMaterial
  );
  imagePlane.position.copy(window.meshParts[3].position);
  imagePlane.position.z += 2;
  imagePlane.position.y += 2.5;
  imagePlane.position.x -= 3.9;

  imagePlane.quaternion.copy(window.meshParts[3].quaternion);
  imagePlane.rotation.x += 2.9;
  imagePlane.rotation.y += Math.PI;
  imagePlane.scale.x *= -1; // zorgt ervoor dat afbeelding niet gespiegeld is

  scene.add(imagePlane);
  window.imagePlane = imagePlane;
  window.imageTexture = imageTexture;

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

//Canvas voor titel
export const titleCanvas = document.createElement("canvas");
titleCanvas.width = 1024;
titleCanvas.height = 512;

export const titleCtx = titleCanvas.getContext("2d");
titleCtx.clearRect(0, 0, titleCanvas.width, titleCanvas.height);

//render scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}
animate();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  if (!chipsModel) return;

  const intersects = raycaster.intersectObjects(chipsModel.children, true);

  if (intersects.length === 0) {
    console.log("Niets geraakt");
    return;
  }

  window.selectedMesh = intersects[0].object;
});
