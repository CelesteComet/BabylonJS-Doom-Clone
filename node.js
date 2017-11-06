import * as BABYLON from 'babylonjs';
import { scene } from './globals';


function Node(vector3) {
  this.position = vector3;
  
  this.mesh = BABYLON.MeshBuilder.CreateBox('pathNode', {height: 1, width: 1, depth: 1}, scene);
  this.mesh.material = new BABYLON.StandardMaterial('coloredPathNode', scene);
  //this.mesh.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
  this.mesh.material.wireframe = true;
  this.mesh.position = this.position;

}

export default Node;