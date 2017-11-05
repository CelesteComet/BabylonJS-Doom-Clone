import * as BABYLON from 'babylonjs';
import { scene, debug, camera, cambox } from './globals';
import Sounds from './sounds';

var SpriteManagerFireball = new BABYLON.SpriteManager("SpriteManagerFireball", "sprites/fireballs.png", 20000 , 15, scene);

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

export default ProjectileManager;

