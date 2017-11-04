import * as BABYLON from 'babylonjs';  

// get the canvas DOM element
export const canvas = document.getElementById('renderCanvas');

// load the 3D engine
export const engine = new BABYLON.Engine(canvas, true);

// create a basic BJS Scene object
const scene = new BABYLON.Scene(engine);

scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
scene.collisionsEnabled = true;

export { scene }

