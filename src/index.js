import * as THREE from "/libs/three.module.js";

/*
 * 1. Mouse movement -
 * 2. Background - texture
 * 3. Trails
 * 4. Face
 */

let camera, scene, renderer;
let mat, geo, particleSystem;
let sprite;

const positions_particles = [];
const NUMBER = 1000;

init();
update();

function init() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 900;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0055);

  geo = new THREE.BufferGeometry();

  sprite = new THREE.TextureLoader().load("assets/spark1.png");

  for (let i = 0; i < NUMBER; i++) {
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;

    positions_particles.push(x, y, z);
  }

  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions_particles, 3)
  );
  //geo.setAttribute("velocity", new THREE.Float32BufferAttribute(velocities, 3));

  mat = new THREE.PointsMaterial({
    size: 20,
    map: sprite,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  });
  mat.color.setHSL(0.98, 0.9, 0.5);

  particleSystem = new THREE.Points(geo, mat);

  scene.add(particleSystem);

  renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClearColor = false;
  // canvas append renderer to body
  document.body.appendChild(renderer.domElement);

  document.body.style.touchAction = "none";

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
var help = true;
function update() {
  requestAnimationFrame(update);

  const time = Date.now() * 0.0001;
  const positions_particles = particleSystem.geometry.attributes.position.array;

  for (let i = 0; i < NUMBER; i++) {
    const object = scene.children[i];

    if (object instanceof THREE.Points) {
      if (help === true) {
        object.scale.x -= 0.005;
        object.rotation.y += Math.PI / 4;
        //object.rotation.z -= (9 * Math.PI) / 8;
      } else if (help === false) {
        object.scale.x += 0.005;
        object.rotation.y += Math.PI / 2;
        //object.rotation.z -= (3 * Math.PI) / 4;
      }
      if (object.scale.x <= -1.5) {
        help = false;
      } else if (object.scale.x >= 1.5) {
        help = true;
      }
    }
    positions_particles[i] += 5;
  }
  const color = [0.98, 1.0, 0.5];

  const h = ((360 * (color[0] + time)) % 360) / 360;
  mat.color.setHSL(h, color[1], color[2]);

  particleSystem.geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}
