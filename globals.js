import * as BABYLON from 'babylonjs';

export const debug = false;

// get the canvas DOM element
export const canvas = document.getElementById('renderCanvas');
canvas.addEventListener('click', function() {
  canvas.requestPointerLock();
})

// load the 3D engine
export const engine = new BABYLON.Engine(canvas, true);

// create a basic BJS Scene object
const scene = new BABYLON.Scene(engine);
scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
scene.collisionsEnabled = true;

// create the asset manager
var assetsManager = new BABYLON.AssetsManager(scene);

// create the camera
var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 2, -2), scene);
camera.applyGravity = true;
camera.checkCollisions = true;
camera.ellipsoid = new BABYLON.Vector3(0.1, 1.5, 0.2);
// target the camera to scene origin
camera.setTarget(BABYLON.Vector3.Zero());

// attach the camera to the canvas
camera.attachControl(canvas, true);

// give camera WASD movement
camera.keysUp.push(87);
camera.keysDown.push(83);
camera.keysLeft.push(65);
camera.keysRight.push(68);

// limit camera speed
camera.speed = 1;

// create a FreeCamera, and set its position to (x:0, y:5, z:-10)
var cambox = BABYLON.MeshBuilder.CreateBox('cam', {height: 0.8, width: 1, depth: 1}, scene);
cambox.isPickable = false;

export { scene, camera, cambox, assetsManager }

