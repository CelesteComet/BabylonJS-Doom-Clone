import * as BABYLON from 'babylonjs';
import { scene, camera } from './globals';
import ProjectileManager from './ProjectileManager';
import Sounds from './sounds';
import opts from './options';
import { MapManager } from './MapManager';
import Utils from './utils';
import SpriteManager from './SpriteManager';

const { debug } = opts;

var MonsterManager = {
  init: function(assets) {
    this.materials = assets.materials;
    this.run();
  },
  run: function() {
    this.list = {};
    this.create = function() {
      console.log("Creating a monster")
    
      var monsterInstance = {};
      monsterInstance.id = Math.random();

      // Set monster state to 0 for inactive
      monsterInstance.state = 0

      // Set monster game properties
      // -------------------------------------------------------------------------
      monsterInstance.health = 100;
      monsterInstance.speed = 0.07;
      monsterInstance.moveVector = new BABYLON.Vector3(0,0,0);
      monsterInstance.moves = {
        up: new BABYLON.Vector3(0, 0, 1),
        down: new BABYLON.Vector3(0,0,-1),
        left: new BABYLON.Vector3(-1,0,0),
        right: new BABYLON.Vector3(1,0,0),
        upRight: new BABYLON.Vector3(1,0,1),
        upLeft: new BABYLON.Vector3(-1,0,1),
        downRight: new BABYLON.Vector3(1,0,-1),
        downLeft: new BABYLON.Vector3(-1,0,-1)
      }
      monsterInstance.moveFrames = 0;
      // -------------------------------------------------------------------------

      // Set monster hitbox properties
      // -------------------------------------------------------------------------
      monsterInstance.hitboxProps = {
        height: 3,
        depth: 1,
        width: 1
      }
      // -------------------------------------------------------------------------

      // Create monster hitbox
      // -------------------------------------------------------------------------
      const { height, depth, width } = monsterInstance.hitboxProps;
      monsterInstance.hitbox = BABYLON.MeshBuilder.CreateBox('imp', 
        { height,
          width,
          depth
        }, scene);
      // Give hitbox the same ID as the monster object
      monsterInstance.hitbox.id = monsterInstance.id;
      // Add material to monster hitbox
      monsterInstance.hitbox.material = this.materials.wireFrame;
      monsterInstance.hitbox.material.alpha = + opts.debug;
      // -------------------------------------------------------------------------


      // Create monster sprite
      // -------------------------------------------------------------------------
      monsterInstance.sprite = new BABYLON.Sprite("impSprite", SpriteManager.Imp);
      monsterInstance.sprite.size = 4;
      // Set sprite position 
      monsterInstance.sprite.position = monsterInstance.hitbox.position;
      // -------------------------------------------------------------------------

      // Set monster animations
      // -------------------------------------------------------------------------
      // Animation properties are an array that is spread to fit the sprite.animation arguments
      monsterInstance.animations = {
        'walkForward': [0, 3, true, 300],
        'dead': [15, 19, false, 150],
        'hurt': [24, 25, false, 150]
      };
      
      
      // Monster can move, fire balls, can be in a state of pain... and die.
      // -------------------------------------------------------------------------
      monsterInstance.setMoveVector = function() {
        // create a list of vectors
          var currentPosition = monsterInstance.hitbox.position.clone();
          // Up movement
          var up = currentPosition.clone();
          up.z += 1;
          // Down movement
          var down = currentPosition.clone();
          down.z -= 1;
          // Left movement
          var left = currentPosition.clone();
          left.x -= 1;
          // Right movement
          var right = currentPosition.clone();
          right.x += 1;

          // Up Right movement
          var upRight = currentPosition.clone();
          upRight.z += 1;
          upRight.x += 1;
          // Down movement
          var downRight = currentPosition.clone();
          downRight.z -= 1;
          downRight.x += 1;
          // Left movement
          var upLeft = currentPosition.clone();
          upLeft.x -= 1;
          upLeft.z += 1;
          // Right movement
          var downLeft = currentPosition.clone();
          downLeft.x -= 1;
          downLeft.z -= 1;

          this.moveVectors = {
            up, down, left, right,
            upRight, upLeft, downRight, downLeft
          };


          var mapped = {};
          // check distance between each move vector with player position
          for(let move in this.moveVectors) { 
            mapped[BABYLON.Vector3.Distance(this.moveVectors[move], camera.position)] = move;
          }

          // get the movement name of the smallest distance
          var distanceArr = Object.keys(mapped);
          var distanceKey = distanceArr.map(function(n) {
            return parseFloat(n);
          }).sort(function(a, b) {
            return a - b;
          })[0];

          var direction = mapped[distanceKey];
          this.moveFrames = 50;
          this.moveVector = this.moves[direction];
        // compare each vector to get distance 
      }

      monsterInstance.setRandomMoveVector = function() {
        this.moveFrames = 10;
        var arr = ['up', 'down', 'left', 'right', 'upLeft', 'upRight', 'downLeft', 'downRight'];
        var rand = arr[Math.floor(Math.random() * arr.length)];
        this.moveVector = this.moves[rand];

      }

      monsterInstance.fire = function() {

      }

      monsterInstance.getHurt = function(pain) {
        monsterInstance.pushBack(10);
        this.inPain = true;
        this.health -= pain;
      }

      monsterInstance.die = function() {
        this.dead = true;
        this.sprite.playAnimation(...this.animations['dead']);
        Math.random() < 0.5 ? Sounds.impDeath1.play(1) : Sounds.impDeath2.play(1);
        this.hitbox.dispose();
      }

      monsterInstance.pushBack = function(frames) {
        this.moveFrames = frames;
        this.moveVector = this.hitbox.position.subtract(camera.globalPosition).normalize().scale(10);
      }
      // -------------------------------------------------------------------------


      monsterInstance.sprite.playAnimation(...monsterInstance.animations['walkForward']);

      monsterInstance.update = function() {
        if(!this.dead && this.moveFrames <= 0) {
          this.setMoveVector();
        }

        if(this.health < 0 && !this.dead) {
          this.die();
          return;
        }

        if(this.inPain && !this.dead) {
          Sounds.pain.attachToMesh(this.hitbox);
          Sounds.pain.play(0.7);
          this.sprite.playAnimation(...this.animations['hurt'], function() {
            this.sprite.playAnimation(...this.animations['walkForward']);
          }.bind(this));
          this.inPain = false;
        }

        


        for(let id in MapManager.list) {
          if(this.hitbox.intersectsMesh(MapManager.list[id], true) && MapManager.list[id].name == 'wall') {
            /*
            var arr = ['up', 'down', 'left', 'right', 'upLeft', 'upRight', 'downLeft', 'downRight'];
            var rand = arr[Math.floor(Math.random() * arr.length)];
            */
            var q = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(180));
              
              var m = new BABYLON.Matrix();
              q.toRotationMatrix(m);  
              var v2 = BABYLON.Vector3.TransformCoordinates(this.moveVector, m);
              this.moveFrames = 100;
              this.moveVector = v2;

            //this.setRandomMoveVector();
          }
        }


        //this.hitbox.position.y += this.moveVector.y;
        if(this.moveFrames > 0) {
          this.hitbox.position.x += this.moveVector.x * this.speed;
          this.hitbox.position.z += this.moveVector.z * this.speed;
          this.moveFrames--;
        }
      }

      



      // Add monster to list
      this.list[monsterInstance.id] = monsterInstance;
      return monsterInstance;
    }

  },
  update: function() {
    for(let id in this.list) {
      this.list[id].update();
    }
  }
}

/*
var MonsterManager = {
  init: function(assets) {
    this.materials = assets.materials;
    this.run();

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
      o.dir = new BABYLON.Vector3(0, -0.1, 0)

      // Hitbox stuff
      o.hitboxHeight = 3.7;
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
      
      

      // Sprite stuff
      o.sprite = new BABYLON.Sprite("imp", SpriteManagerImp);
      o.sprite.size = 5;
      
      //o.sprite.playAnimation(0, 3, true, 300);


      o.playAnimation = function(animationName) {
        const animations = {
          walkForward: [0, 3, true, 300],
          dead: [15, 19, false, 150],
          shootAndThenMove: [12, 14, false, 150, function() {
            o.fire();
            o.playAnimation('walkForward');
            o.hitbox.rotation.y = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1) * 100;
          }]
        };
        return o.sprite.playAnimation(...animations[animationName]);
      }

      o.getDirection = function() {
        return new BABYLON.Vector3(
          Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1),
          Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1),
          Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
        )
      }
      

      o.playAnimation('shootAndThenMove');

      // Sprite Actions
      o.shootFireball = function() {
        o.stopMoving();
        o.playAnimation('shootAndThenMove');
      }

      var ray = new BABYLON.Ray();
      var rayHelper = new BABYLON.RayHelper(ray);
      
      var localMeshDirection = new BABYLON.Vector3(0, 0, 1);
      var localMeshOrigin = o.hitbox.position
      var length = 20;
      
      rayHelper.attachToMesh(o.hitbox, localMeshDirection, localMeshOrigin, length);
      rayHelper.show(scene, new BABYLON.Color3(1, 1, 0.1));

      
      

      o.stopMoving = function() {
        o.vX = 0;
        o.vZ = 0;
      }

      o.die = function() {
        o.dead = true;
        o.playAnimation('dead');
        o.sprite.position.y -= 0.5;
        o.hitbox.dispose();
        Sounds.pain.play();
      }

      // Update
      o.update = function() {
        
        o.sprite.position = o.hitbox.position.clone();
        o.sprite.position.y += 0.2;
        //console.log(camera.position.subtract(o.hitbox.position).length());
        o.tick++;
        
        for(let id in mapManager.floors) {
          if(o.hitbox.intersectsMesh(mapManager.floors[id])) {
            //o.vX = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
            //o.vZ = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
            o.dir.y = 0;
          }
        }
        



        if(o.dead) {
          o.vX = 0;
          o.vZ = 0;
          return;
        }

        if(Math.random() < 0.01 && !o.dead) {
          //o.shootFireball();
          //o.hitbox.rotation.y = Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1) * 100;
          //var dir = o.getDirection();
          
        }
        
        
        
        //o.hitbox.locallyTranslate(new BABYLON.Vector3(0,0,0.05));
        o.hitbox.position.y += o.dir.y;


        

        
        
        
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
*/





export default MonsterManager;