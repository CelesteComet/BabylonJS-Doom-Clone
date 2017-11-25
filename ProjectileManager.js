import * as BABYLON from 'babylonjs';
import { scene, debug, camera, cambox } from './globals';
import Sounds from './sounds';
import UIManager from './UIManager';
import SpriteManager from './SpriteManager';
import ParticleManager from './ParticleManager';
import MonsterManager from './MonsterManager';
import Utils from './utils';
import KeyboardManager from './KeyboardManager';

var SpriteManagerFireball = new BABYLON.SpriteManager("SpriteManagerFireball", "sprites/fireballs.png", 20000 , 15, scene);

var playerRocketMesh = BABYLON.MeshBuilder.CreateBox('playerRocket', {height: 1, width: 1, depth: 1}, scene);
playerRocketMesh.material = new BABYLON.StandardMaterial('asd', scene);
playerRocketMesh.material.alpha = 0;
playerRocketMesh.position.y = -40;




var explosionMesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 7}, scene);
explosionMesh.position.y -= 40;
explosionMesh.material = new BABYLON.StandardMaterial('asd', scene);
explosionMesh.material.alpha = 0.5;




function Explosion(position) {
  var sprite = new BABYLON.Sprite("explosionSprite", SpriteManager.Explosion)
  sprite.size = 5;
  var explosion = explosionMesh.createInstance();
  explosion.position = position;
  explosion.computeWorldMatrix();
      sprite.position = explosion.position;
      sprite.playAnimation(0,2, false, 400, function() {
        sprite.dispose();
      }.bind(this))
  for(let id in MonsterManager.list) {
    if(MonsterManager.list[id].hitbox.intersectsMesh(explosion)) {
      MonsterManager.list[id].getHurt(100, 5, explosion.position);

    }
  }
  explosion.dispose();
}

function PlayerRocket() {

  var speed = 1;
  var velocityVector = camera.getTarget().subtract(camera.globalPosition).normalize();
  var sprite = new BABYLON.Sprite("rocket", SpriteManager.Rocket)
  var cellIndexKey;
  sprite.size = 3;

  // dumb trick
  if(KeyboardManager.keys.a) {
    cellIndexKey = 'a';
    sprite.cellIndex = 3;
  } else if(KeyboardManager.keys.d) {
    cellIndexKey = 'd';
    sprite.cellIndex = 2;
  } else {
    sprite.cellIndex = 0;
  }

  // public variables
  this.id = Math.random();
  this.mesh = playerRocketMesh.createInstance();

  // Set mesh properties
  this.mesh.id = this.id;
  this.mesh.position = camera.position.clone().add(velocityVector.scale(3));
  this.mesh.position.y -= 0.5;

  this.mesh.onCollide = function(mesh) {
    this.blewUp = true;
  }.bind(this);

  this.remove = function() 
  {
    this.mesh.dispose();
    delete ProjectileManager.list[this.id];
    sprite.dispose();
  }

  // public methods 
  this.update = function() 
  {
    if(!KeyboardManager.keys[cellIndexKey]) {
      sprite.cellIndex = 0;   
    }
    if(this.blewUp) {
      new Explosion(this.mesh.position)
      this.remove();
    } else {
      this.mesh.moveWithCollisions(velocityVector);
    }
    sprite.position = this.mesh.position;
  }
}

const ProjectileManager = new function() {
  // public variables 
  this.list = {};
  // public methods
  this.createRocket = function() {
    var rocket = new PlayerRocket;
    this.list[rocket.id] = rocket;
    return rocket;
  }

  this.update = function() 
  {
    for (let id in this.list) {
      this.list[id].update();
    }
  }
}


/*
const ProjectileManager = new (function() {
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
    
    // play a sound on creation
    var sound = Sounds.fireball;
    sound.setVolume(0.3);
    sound.play();
    

    o.update = function() {

      if(o.hitbox.intersectsMesh(cambox)) {
        o.hitbox.dispose();
        o.sprite.dispose();
        if(!debug) {
          Sounds.doomGuyInPain.play();
          UIManager.takeDamage(3);
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
})()
*/
export default ProjectileManager;

