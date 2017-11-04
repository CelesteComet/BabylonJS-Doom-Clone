var debug = false; 
var moveUnits = true;
var noFire = false;
var music = true;
if(debug) {
  music = false;
}

// Globals


import * as BABYLON from 'babylonjs';
import { scene, engine, canvas } from './globals';
import Sounds from './sounds.js';
import Materials from './materials.js';


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

// create a FreeCamera, and set its position to (x:0, y:5, z:-10)
var cambox = BABYLON.MeshBuilder.CreateBox('cam', {height: 0.8, width: 1, depth: 1}, scene);
cambox.isPickable = false;
var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 2, -2), scene);
camera.applyGravity = true;
camera.checkCollisions = true;
camera.ellipsoid = new BABYLON.Vector3(0.1, 1.5, 0.2);

canvas.addEventListener('click', function() {
  canvas.requestPointerLock();
})


var SpriteManagerImp = new BABYLON.SpriteManager("SpriteManagerImp", "sprites/imp.png", 100, 64, scene);
var SpriteManagerFireball = new BABYLON.SpriteManager("SpriteManagerFireball", "sprites/fireballs.png", 20000 , 15, scene);




var ProjectileManager = function() {
  this.list = {};

  this.create = function() {
    // ID stuff
    var o = {};
    o.id = Math.random();

    // movement stuff
    o.speed = 0.4;
    o.vX = 0;
    o.vY = 0;
    o.vZ = 0;

    // hitbox stuff 
    
    o.hitboxHeight = 0.5;
    o.hitboxDepth = 0.1;
    o.hitboxWidth = 0.5;
    o.hitbox = BABYLON.MeshBuilder.CreateBox('fireball', {height: o.hitboxHeight, width: o.hitboxWidth, depth: o.hitboxDepth}, scene);
    o.hitbox.id = o.id;
    o.hitbox.material = new BABYLON.StandardMaterial("wireframeMaterial", scene);
    if(debug) {
      o.hitbox.material.wireframe = true;
    } else {
      o.hitbox.material.alpha = 0;
    }
    o.hitbox.rotation = camera.rotation;
    o.hitbox.checkCollisions = true;
    o.hitbox.isPickable = false;

    // sprite stuff
    o.sprite = new BABYLON.Sprite("fireball", SpriteManagerFireball);
    o.sprite.playAnimation(0, 1, true, 100);
    

    o.update = function() {
      if(o.hitbox.intersectsMesh(cambox)) {
        o.hitbox.dispose();
        o.sprite.dispose();
        if(!debug) {
          Sounds.doomGuyInPain.play();
        }
        delete ProjectileManager.list[o.id]
      }
      o.hitbox.position.x += o.vX;
      o.hitbox.position.y += o.vY;
      o.hitbox.position.z += o.vZ;
      o.sprite.position = o.hitbox.position;
    }

    // add to list and return
    this.list[o.id] = o;
    return o;
  }

  this.update = function() {
    for(var id in this.list) {
      this.list[id].update();
    }
  }
}

var ProjectileManager = new ProjectileManager();

var MonsterManager = function() {
  this.list = {};

  this.create = function() {
    // ID stuff
    var o = {};
    o.id = Math.random();

    // property stuff
    o.dead = false;
    o.fire = function() {
      var fireball = ProjectileManager.create();
      fireball.hitbox.position = o.hitbox.position.clone();
      // Get player vector3
      var direction = camera.position.subtract(o.hitbox.position).normalize();
      fireball.vX = direction.x * fireball.speed;
      fireball.vY = direction.y * fireball.speed;
      fireball.vZ = direction.z * fireball.speed;
    }

    // Movement stuff
    o.tick = 0;
    o.vX = 0;
    o.vY = 0;
    o.vZ = 0;

    // Hitbox stuff
    o.hitboxHeight = 1.8;
    o.hitboxDepth = 2;
    o.hitboxWidth = 1;
    o.hitbox = BABYLON.MeshBuilder.CreateBox('imp', {height: o.hitboxHeight, width: o.hitboxWidth, depth: o.hitboxDepth}, scene);
    o.hitbox.id = o.id;
    o.hitbox.material = new BABYLON.StandardMaterial("wireframeMaterial", scene);
    if(debug) {
      o.hitbox.material.wireframe = true;
    } else {
      o.hitbox.material.alpha = 0;
    }
    o.hitbox.rotation = camera.rotation;
    o.hitbox.position.y += 1.5;

    // Sprite stuff
    o.sprite = new BABYLON.Sprite("imp", SpriteManagerImp);
    o.sprite.size = 3.1;
    o.sprite.position = o.hitbox.position;
    o.sprite.playAnimation(0, 1, true, 300);

    // Update
    o.update = function() {
      if(o.dead) {
        o.vX = 0;
        o.vZ = 0;
        return;
      }
      o.tick++;
      if(Math.random() < 0.01 && !o.dead) {
        if(!noFire) {
          o.fire();
        }
        o.vX = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
        o.vZ = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
      }
      if(moveUnits) {
        o.hitbox.position.x += o.vX;
        o.hitbox.position.z += o.vZ;

      }

    }

    // Add it to the list
    this.list[o.id] = o
    // and then return it
    return o;
  }

  this.update = function() {
    for(var id in this.list) {
      this.list[id].update();
    }
  }
  return this;
}

var MonsterManager = new MonsterManager();

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
  camera.speed = 0.4;

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
if(music) {
  var e1m1music = new BABYLON.Sound("Music", "sounds/e1m1.mp3", scene, null, { loop: true, autoplay: !debug });
}

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
  if(canShoot) {
    Sounds.shotgunBlast.play();
    timer = 55;
    var ray = new BABYLON.Ray(camera.globalPosition, camera.getTarget().subtract(camera.globalPosition).normalize());
    console.log(camera.globalPosition, camera.getTarget().subtract(camera.globalPosition).normalize())
    var pickInfo = scene.pickWithRay(ray);
    
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