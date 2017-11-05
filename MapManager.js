import * as BABYLON from 'babylonjs';
import { scene, camera } from './globals';
import Utils from './utils';

const MapManager = {
  init: function(assets) {
    this.materials = assets.materials;
    this.list = {};
    this.active = false;
    this.run();
    this.stop();
  },
  run: function() {
    this.active = true;
    this.guideBox = BABYLON.MeshBuilder.CreateBox('pointerPlane', {height: 1, width: 1, depth: 1}, scene);
    this.guideBox.isPickable = false;
    this.guideBox.material = this.materials.wireFrame;
      

    this.pointerPlane = {
      mesh: BABYLON.MeshBuilder.CreateBox('pointerPlane', {height: 1, width: 1, depth: 0.1}, scene),
    }

    

    this.pointerPlane.mesh.position.z += 7;
    this.pointerPlane.mesh.material = this.materials.wireFrame.clone();
    this.pointerPlane.mesh.material.alpha = 0;
    this.pointerPlane.mesh.parent = camera;
  },
  stop: function() {
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
  }
}





export default MapManager;