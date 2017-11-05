var debug = true; 
var moveUnits = false;
var noFire = false;
var music = true;
if(debug) {
  music = false;
}

// Globals


import * as BABYLON from 'babylonjs';
import { scene, engine, canvas, camera, cambox } from './globals';
import Utils from './utils';
import Sounds from './sounds';
import Materials from './materials';
import ProjectileManager from './ProjectileManager';
import MonsterManager from './MonsterManager';

// load the sounds


// load the textures
//Game.prototype.loadResources = function(e) {
  // Wooden Crate



// Brick Material
/*
Materials.brickMaterial = new BABYLON.StandardMaterial(name, scene);
var brickTexture = new BABYLON.BrickProceduralTexture(name + "text", 512, scene);
brickTexture.numberOfBricksHeight = 60;
brickTexture.numberOfBricksWidth = 100;
Materials.brickMaterial.diffuseTexture = brickTexture;

// Grass Material
Materials.grassMaterial = new BABYLON.StandardMaterial(name + "bawl", scene);
var grassTexture = new BABYLON.GrassProceduralTexture(name + "textbawl", 256, scene);
Materials.grassMaterial.ambientTexture = grassTexture;
*/

var timer = 0;
var offset = 0;
// Shotgun Material
Materials.shotgunMaterial = new BABYLON.StandardMaterial(name, scene);
var shotgunTexture = new BABYLON.Texture("sprites/shotgun.png", scene);

shotgunTexture.uScale = 1/7;


shotgunTexture.hasAlpha = true;
Materials.shotgunMaterial.diffuseTexture = shotgunTexture;




  //e();
//}




canvas.addEventListener('click', function() {
  canvas.requestPointerLock();
})












  // create the user interface including the gun
  var gunMesh = BABYLON.MeshBuilder.CreatePlane('weapon', {width: 1}, scene);
  gunMesh.material = Materials.shotgunMaterial;
  
  gunMesh.position.z += 2;
  gunMesh.position.y -= 0.4;
  gunMesh.isPickable = false;
  gunMesh.parent = cambox;
  gunMesh.material.hasAlpha = true;
  gunMesh.material.alpha = 1;

  

  //gunMesh.rotation = camera.rotation;




// createScene function that creates and return the scene
var createScene = function(){
  
  



  for(var i = 0; i < 10; i++) {
    var m = MonsterManager.create();
    m.hitbox.position.x += i * 5;
  }

  // Test Box
  var testBox = BABYLON.MeshBuilder.CreateBox('cam', {height: 5, width: 5, depth: 1}, scene)
  testBox.material = Materials.woodenCrateMaterial;
  testBox.position.y += 1;
  testBox.position.z += 6;
  testBox.isPickable = true;


  // create a basic light, aiming 0,1,0 - meaning, to the sky
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

  // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
  var ground = BABYLON.Mesh.CreateGround('ground1', 300, 300, 0, scene);
  ground.checkCollisions = true;

  // return the created scene
  return scene;
}

// call the createScene function


// play the badass music
var e1m1music = new BABYLON.Sound("Music", "sounds/e1m1.mp3", scene, null, { loop: true, autoplay: true});
createScene();

// run the render loop
engine.runRenderLoop(function(){
  cambox.position = camera.position;
  cambox.rotation = camera.rotation;
  updateShotgun();
  MonsterManager.update();
  ProjectileManager.update();
  scene.render();
});

// the canvas/window resize event handler
window.addEventListener('resize', function(){
  engine.resize();
});
var cycle = false;
var canShoot = true;
function updateShotgun() {
  var animationFrame = [0,1,2,3,4,5,6,5,4];
  if(timer > 0) {
    canShoot = false;
    timer--;
  }

  if(timer % 6 == 0) {
    
    Materials.shotgunMaterial.diffuseTexture.uOffset = animationFrame[offset]/7;
    offset++;
  }


  if(timer == 0) {
    offset = 0;
    canShoot = true;
    Materials.shotgunMaterial.diffuseTexture.uOffset = animationFrame[3]/7;
  }
}

window.addEventListener("click", function(e) {
  var pickInfo = Utils.getCameraRayCastPickInfo();
  if(canShoot) {
    Sounds.shotgunBlast.play();
    timer = 55;

    
    var decalSize = new BABYLON.Vector3(0.1, 0.1, 0.1);
    var decal = BABYLON.MeshBuilder.CreateDecal("decal", pickInfo.pickedMesh, {position: pickInfo.pickedPoint, normal: pickInfo.getNormal(true), size: decalSize});

    decal.material = Materials.bulletHoleMaterial;
    
    if(pickInfo && pickInfo.pickedMesh && pickInfo.pickedMesh.name == 'imp') {

      // find the monster in the list, play the death animation, then dispose
      MonsterManager.list[pickInfo.pickedMesh.id].sprite.playAnimation(3, 7, false, 200);
      MonsterManager.list[pickInfo.pickedMesh.id].dead = true;
      pickInfo.pickedMesh.dispose();
      Sounds.pain.play();
      //MonsterManager.list[pickInfo.pickedMesh.id].sprite.dispose();
    }
  }
    
})