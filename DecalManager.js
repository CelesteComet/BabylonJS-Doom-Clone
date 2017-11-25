import * as BABYLON from 'babylonjs';
import { scene } from './globals';


var DecalManager = new function() {
  // private variables
  var bulletHoles = [];
  var bulletHoleIndex = 0;
  // public methods
  this.init = function(assets) 
  {
    this.materials = assets.materials;
    this.run();
  }

  this.run = function() 

  {
    var hiddenPosition = new BABYLON.Vector3(0, -30, 0);
    var decalSize = new BABYLON.Vector3(0.1, 0.1, 0.1);
    var decalMesh = BABYLON.MeshBuilder.CreatePlane("decalMesh", {size:0.1}, scene);
    decalMesh.isPickable = false;
    decalMesh.position = hiddenPosition;
    decalMesh.material = this.materials.test;
    //decalMesh.material.bumpTexture = new BABYLON.Texture('textures/NormalMap.png')
    //decalMesh.material.diffuseTexture.hasAlpha = true;
    //decalMesh.material.alpha = 1;
    for (var i = 0; i < 50; i++) {
      var bulletHoleInstance = decalMesh.createInstance();
      bulletHoleInstance.isPickable = false;
      bulletHoles.push(bulletHoleInstance);
    }
  }

  this.createBulletHoleAt = function(pos, normal) 
  {

    bulletHoles[bulletHoleIndex].position = pos;
    bulletHoles[bulletHoleIndex].lookAt(bulletHoles[bulletHoleIndex].position.add(normal));
    bulletHoleIndex++;
    if(bulletHoleIndex > bulletHoles.length - 1) {
      bulletHoleIndex = 0;
    }
  }
}

export default DecalManager;