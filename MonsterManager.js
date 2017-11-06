import * as BABYLON from 'babylonjs';
import { scene, camera } from './globals';
import ProjectileManager from './ProjectileManager';
import Sounds from './sounds';
import opts from './options';
import MapManager from './MapManager';

const { debug } = opts;
/*
  var testBox = BABYLON.MeshBuilder.CreateBox('cam', {height: 5, width: 5, depth: 1}, scene)
  testBox.material = Materials.woodenCrateMaterial;
  testBox.position.y += 1;
  testBox.position.z += 6;
  testBox.isPickable = true;
*/
var ground;


var MonsterManager = {
  init: function(assets) {
    this.materials = assets.materials;
    this.run();
    console.log("Adding a beautiful floor");
    ground = BABYLON.Mesh.CreateGround('ground1', 300, 300, 0, scene);
    ground.material = new BABYLON.StandardMaterial('s', scene);
    
    ground.material = this.materials.woodenCrate;
    ground.position.y -= 20;
    ground.checkCollisions = true;
  },
  run: function() {
    var SpriteManagerImp = new BABYLON.SpriteManager("SpriteManagerImp", "sprites/impy.png", 100, 70, scene);
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
      o.vY = -0.05;
      o.vZ = 0;

      // Hitbox stuff
      o.hitboxHeight = 2.1;
      o.hitboxDepth = 1;
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
      o.sprite.size = 2.8;
      //o.sprite.position = o.hitbox.position;
      //o.sprite.position.y += 100;
      o.sprite.playAnimation(0, 3, true, 300);

      // Sprite Actions
      o.shootFireball = function() {
        o.stopMoving();
        o.sprite.playAnimation(12, 14, false, 150, function() {
          o.fire();
          o.sprite.playAnimation(0, 3, false, 200, function() {

            o.vX = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
            o.vZ = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
            o.sprite.playAnimation(0, 3, true, 200);
          });
        });
      }

      o.playMoveAnimation = function() {

      }

      o.stopMoving = function() {
        o.vX = 0;
        o.vZ = 0;
      }

      o.die = function() {
        o.dead = true;
        o.sprite.playAnimation(15, 19, false, 150);
        o.hitbox.dispose();
        Sounds.pain.play();
      }

      // Update
      o.update = function() {
        o.tick++;
        for(let id in MapManager.list) {
          if(o.hitbox.intersectsMesh(MapManager.list[id])) {
            o.vX = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
            o.vZ = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
          }
        }

        if(o.hitbox.intersectsMesh(ground)) {
          o.vY = 0;
        }


        if(o.dead) {
          o.vX = 0;
          o.vZ = 0;
          return;
        }
        if(Math.random() < 0.01 && !o.dead) {
          o.shootFireball();
        }

        o.hitbox.position.x += o.vX;
        o.hitbox.position.z += o.vZ;
        o.hitbox.position.y += o.vY;
      }

      // Add it to the list
      this.list[o.id] = o
      // and then return it
      return o;
    }
  },
  update: function() {
    for(var id in this.list) {
      this.list[id].update();
    }
  }
}





//var MonsterManager = new MonsterManager();
export default MonsterManager;