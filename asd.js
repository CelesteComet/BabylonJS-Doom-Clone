import * as BABYLON from 'babylonjs';
import { scene, camera } from './globals';
import Utils from './utils';
import MonsterManager from './MonsterManager';


const MapManager = {
  scaling: ['x', 'y', 'z'],
  scalingIndex: 0,
  init: function(assets) {
    this.materials = assets.materials;
    this.list = {};
    this.active = false;
    window.addEventListener('keydown', function(e) {
      if(e.keyCode == 187) { 
        if(!this.active) {
          this.run(); 
        } else {
          this.stop();
        }
      }
    }.bind(this))

    var ground = BABYLON.MeshBuilder.CreateGround("gd", {width: 300, height: 300, subdivsions: 4}, scene);
    ground.material = new BABYLON.StandardMaterial('s', scene); 
    ground.material = assets.materials.woodenCrate;
    ground.position = new BABYLON.Vector3(0, -20, 0);
    ground.checkCollisions = true;
    ground.id = Math.random();
    ground.computeWorldMatrix(true);
    this.list[ground.id] = ground;

    var wall = this.build(20,1,20);
    wall.position.y -= 20;
    var wall = wall.clone()
    wall.position.x += 20;
    var ceil = this.build(1, 20, 20);
    ceil.position.x += 10;
    ceil.position.y -= 10.5;
    var wall = wall.clone();
    wall.rotation = new BABYLON.Vector3(0, 1.5 * Math.PI, 0);
    wall.position.x -= 10;




  },
  run: function() {
    camera.applyGravity = false;
    this.deleteMode = false;
    window.addEventListener('click', function(e) {
      if(this.active) {
        if(this.deleteMode) {
          var pickInfo = Utils.getCameraRayCastPickInfo();
          if(pickInfo.pickedMesh) {
            pickInfo.pickedMesh.dispose();
          }
        } else {
          var mesh = this.create();
          mesh.id = Math.random();
          mesh.position = this.guideBox.position;
          this.list[mesh.id] = mesh;
        }
      }
    }.bind(this))

    window.addEventListener('keyup', function(e) {
      var self = this; 
      if(e.keyCode == 219) {

        this.guideBox.scaling[this.scaling[this.scalingIndex]] += 0.5;
      } // +

      if(e.keyCode == 221) {
        if(this.guideBox.scaling[this.scaling[this.scalingIndex]] > 0.5) {
          this.guideBox.scaling[this.scaling[this.scalingIndex]] -= 0.5;
        }
      }

      if(e.keyCode == 220) {
        this.scalingIndex++;
        if(this.scalingIndex >= this.scaling.length) {
          this.scalingIndex = 0;
        }
      }
      if(e.keyCode == 191) {
        var m = MonsterManager.create();
        m.hitbox.position = this.guideBox.position;
        m.sprite.position = this.guideBox.position;
      } //?)

      if(e.keyCode == 189) {
        this.turnOnDeleteMode();
      }
    }.bind(this))
    this.active = true;
    this.guideBox = BABYLON.MeshBuilder.CreateBox('pointerPlane', {height: 1, width: 1, depth: 1}, scene);
    this.guideBox.isPickable = false;
    this.guideBox.material = this.materials.wireFrame;
      

    this.pointerPlane = {
      mesh: BABYLON.MeshBuilder.CreateBox('pointerPlane', {height: 1, width: 1, depth: 0.1}, scene),
    }

    

    this.pointerPlane.mesh.position.z += 14;
    this.pointerPlane.mesh.material = this.materials.wireFrame.clone();
    //this.pointerPlane.mesh.material.alpha = 0;
    this.pointerPlane.mesh.parent = camera;
  },
  stop: function() {
    camera.applyGravity = true;
    this.active = false;
    this.guideBox.dispose();
    this.pointerPlane.mesh.dispose();
  },
  update: function() {  

    if(this.active && Utils.getCameraRayCastPosition()) {
      var pos = Utils.getCameraRayCastPosition();
      var x = Utils.getNearestRound(pos.x, 0.5);
      var y = Utils.getNearestRound(pos.y, 0.5);
      var z = Utils.getNearestRound(pos.z, 0.5);
      this.guideBox.position = new BABYLON.Vector3(x, y, z);
    }
  },
  create: function() {
    var id = Math.random();
    var width = this.guideBox.scaling.x;
    var height = this.guideBox.scaling.y;
    var depth = this.guideBox.scaling.z;
    return BABYLON.MeshBuilder.CreateBox(`${id}`, {height: height, width: width, depth: depth}, scene);
  },
  turnOnDeleteMode: function() {
    this.deleteMode = true;
    this.pointerPlane.mesh.dispose();
    this.pointerPlane = null;
  },
  build: function(height, width, depth) {
    var id = Math.random();
    var box = BABYLON.MeshBuilder.CreateBox(`${id}`, {height: height, width: width, depth: depth}, scene);
    this.list[id] = box;
    return box;
  }
}







export default MapManager;