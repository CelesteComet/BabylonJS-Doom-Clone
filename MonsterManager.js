import * as BABYLON from 'babylonjs';
import { scene, camera } from './globals';
import ProjectileManager from './ProjectileManager';
import Sounds from './sounds';
import opts from './options';
import { MapManager } from './MapManager';
import Utils from './utils';
import SpriteManager from './SpriteManager';
import ParticleManager from './ParticleManager';

const { debug } = opts;

var monsters = {
  'cacodemon': {
    'hitboxProps': {
      height: 3,
      width: 2,
      depth: 2
    },
    'hitbox': BABYLON.MeshBuilder.CreateBox('imp', 
        { height: 3,
          width: 2,
          depth: 2
        }, scene),
    'animations': {
      'hurt': [0, 0, true, 300],
      'dead': [0, 0, true, 300],
      'down': [0, 0, true, 300]
    },
    'sounds': {
      'hurt': Sounds[`hurt_${'cacodemon'}`],
      'death': Sounds[`death_${'cacodemon'}`]
    },
    'blood': {

    },
    includeFlight: function(vector) {
      if(Math.random() < 0.5) {
        vector.y = 1;
      } else {
        vector.y = -1;
      }
      return vector;
    }
  }
}

// Hide the original meshes
for (let name in monsters) {
  monsters[name].hitbox.position.y -= 100 * Math.random();
  monsters[name].hitbox.position.x += 100 * Math.random();
}



var MonsterManager = {
  init: function(assets) {
    this.materials = assets.materials;
    monsters.cacodemon.hitbox.material = new BABYLON.StandardMaterial('asd', scene);//this.materials.wireFrame;
    monsters.cacodemon.hitbox.material.alpha = 0//+ opts.debug;    
    this.run();
  },
  run: function() {
    this.list = {};
    this.create = function(name) {
      var monsterType = monsters[name];
      console.log("Creating a monster")
    
      var monsterInstance = {};
      monsterInstance.id = Math.random();

      // Set monster state to 0 for inactive
      monsterInstance.state = 0

      // Set monster game properties
      // -------------------------------------------------------------------------
      monsterInstance.health = 100;
      monsterInstance.speed = 0.08;
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
      monsterInstance.currentMoveAnimation = 'down';
      // -------------------------------------------------------------------------

      // Set monster hitbox properties
      // -------------------------------------------------------------------------
      monsterInstance.hitboxProps = monsterType.hitboxProps;
/*
      {
        height: 3,
        depth: 1,
        width: 1
      }
      */
      // -------------------------------------------------------------------------

      // Create monster hitbox
      // -------------------------------------------------------------------------
      monsterInstance.hitbox = monsterType.hitbox.createInstance();
      monsterInstance.hitbox.name = 'imp'
      /*
      const { height, depth, width } = monsterInstance.hitboxProps;
      monsterInstance.hitbox = BABYLON.MeshBuilder.CreateBox('imp', 
        { height,
          width,
          depth
        }, scene);
      */
      // Give hitbox the same ID as the monster object
      monsterInstance.hitbox.id = monsterInstance.id;
      // Add material to monster hitbox
      //monsterInstance.hitbox.material = this.materials.wireFrame;
      //monsterInstance.hitbox.material.alpha = + opts.debug;
      // -------------------------------------------------------------------------


      // Create monster sprite
      // -------------------------------------------------------------------------
      monsterInstance.sprite = new BABYLON.Sprite("cacodemonSprite", SpriteManager.Cacodemon);
      monsterInstance.sprite.size = 4;
      // Set sprite position 
      monsterInstance.sprite.position = monsterInstance.hitbox.position;
      // -------------------------------------------------------------------------

      // Set monster animations
      // -------------------------------------------------------------------------
      // Animation properties are an array that is spread to fit the sprite.animation arguments
      // The playAnimation function is a wrapper to allow 0 to 0 frame animations 
      monsterInstance.playAnimation = function(_from, to, bool, length, cb) {
        if(cb || (_from !== to )) {
          this.sprite.playAnimation(_from, to, bool, length, cb);
        } else {
          this.sprite.cellIndex = _from;
          this.sprite.stopAnimation();
        }

      }
      monsterInstance.animations = {
        'hurt': [9, 10, true, 300],
        'dead': [10, 15, false, 200],
        'down': [0, 0, true, 300],
        'up': [4, 4, true, 300],
        'upRight': [5, 5, true, 300],
        'right': [6, 6, true, 300],
        'downRight': [8, 8, true, 300],
        'left': [7, 7, true, 300],
        'upLeft': [3, 3, true, 300],
        'downLeft': [1, 1, true, 300]
      }

    /*
      {
        'walkForward': [0, 3, true, 300],
        'dead': [15, 19, false, 150],
        'hurt': [24, 25, false, 150]
      };
*/
      
      
      // Monster can move, fire balls, can be in a state of pain... and die.
      // -------------------------------------------------------------------------
      monsterInstance.setMoveVector = function() {
        if(Math.random() < 0.7) {
          this.setRandomMoveVector();
          return;
        }
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
          if(monsterType.includeFlight) {
            this.moveVector = monsterType.includeFlight(this.moveVector);
          }

          this.moveVector = this.moves[direction];
          this.currentMoveAnimation = direction;
        // compare each vector to get distance 
      }

      monsterInstance.setRandomMoveVector = function() {
        this.moveFrames = 50;
        var arr = ['up', 'down', 'left', 'right', 'upLeft', 'upRight', 'downLeft', 'downRight'];
        var rand = arr[Math.floor(Math.random() * arr.length)];
        this.moveVector = this.moves[rand];
        this.currentMoveAnimation = rand;
        if(monsterType.includeFlight) {
          this.moveVector = monsterType.includeFlight(this.moveVector);
        }
      }

      monsterInstance.fire = function() {

      }

      monsterInstance.emitBloodAt = function(pos) {
        // can accept a pos
        var particleSystem = ParticleManager.emit('blueBlood', this.hitbox, 40);
      }

      monsterInstance.getHurt = function(pain, pushBack) {
        monsterInstance.pushBack(pushBack);
        this.inPain = true;
        this.painStarted = true;
        this.health -= pain;
      }

      monsterInstance.die = function() {
        this.dead = true;

        this.playAnimation(...this.animations['dead']);
        Math.random() < 0.5 ? monsterType.sounds.death.play(1) : monsterType.sounds.death.play(1);
        //this.hitbox.dispose();
      }

      monsterInstance.pushBack = function(power) {
        this.moveVector = this.hitbox.position.subtract(camera.globalPosition).normalize().scale(power);
      }
      // -------------------------------------------------------------------------

      monsterInstance.getAnimation = function(name) {

      }

      //monsterInstance.playAnimation(...monsterInstance.animations['down']);
      monsterInstance.hitbox.checkCollisions = true;
      monsterInstance.hitbox.ellipsoid = new BABYLON.Vector3(1, monsterInstance.hitboxProps.height/2/2, 1);
      monsterInstance.hitbox.onCollide = function(mesh) {
        if(mesh.name == 'wall') {
          monsterInstance.setRandomMoveVector();
        }
        if(mesh.name == 'imp') {
        }
            //console.log("COLLIDING WITH " + mesh.name)
      }

      monsterInstance.update = function() {
        // Set sprite position to that of hitbox
        monsterInstance.sprite.position = monsterInstance.hitbox.position;
        // Set animation
        if(!this.inPain && !this.dead) {
          var degs = Utils.getDegreesBetweenTwoVectors(this.hitbox.position, camera.position);
          var relativePosition = Utils.getRelativePosition(degs)
          var monsterDirection = Utils.flipDirection(this.currentMoveAnimation, relativePosition);
          this.playAnimation(...this.animations[monsterDirection]);
        }


        if(this.health < 0 && !this.dead) {
          this.die();
          return;
        }

        if(this.dead) {
          monsterInstance.moveVector = new BABYLON.Vector3(0, -4, 0);
          monsterInstance.moveFrames = 1000;
          this.hitbox.onCollide = function(mesh) {
            if(mesh.name == 'ground') {
              monsterInstance.hitbox.dispose();
            }
          }
        }



        if(this.painStarted && this.inPain && !this.dead) {
          monsterType.sounds.hurt.attachToMesh(this.hitbox);
          monsterType.sounds.hurt.play(0.7);
          this.sprite.playAnimation(9, 10, false, 300, function() {
            this.inPain = false;
          }.bind(this));
          this.painStarted = false;
          /*
          this.playAnimation(...this.animations['hurt'], function() {
            this.inPain = false;
          }.bind(this));
          */
        }

        if(!this.dead && this.moveFrames <= 0 && !this.inPain) {
          this.setMoveVector();
        }

        if(this.moveFrames > 0 || this.inPain) {
          this.hitbox.moveWithCollisions(this.moveVector.scale(0.06));
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