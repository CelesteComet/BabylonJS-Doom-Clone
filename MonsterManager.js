import * as BABYLON from 'babylonjs';
import { scene, camera, debug } from './globals';
import ProjectileManager from './ProjectileManager';

var SpriteManagerImp = new BABYLON.SpriteManager("SpriteManagerImp", "sprites/imp.png", 100, 64, scene);
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
        o.fire();
        o.vX = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
        o.vZ = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
      }
      o.hitbox.position.x += o.vX;
      o.hitbox.position.z += o.vZ;
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
export default MonsterManager;