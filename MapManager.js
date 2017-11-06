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
  }
}





export default MapManager;