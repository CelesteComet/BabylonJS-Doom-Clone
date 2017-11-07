import * as BABYLON from 'babylonjs';
import Node from './node';
import MapManager from './MapManager';
import MonsterManager from './MonsterManager';

function NodeGraph() {
  this.nodeSize = 1;
  
  this.graph = [];

  for(let i = 0; i < 50; i++) {
    var row = [];
    for(let j = 0; j < 50; j++) {
      row.push( new Node(new BABYLON.Vector3(1 * i, -19.5, 1 * j)) );
    }
    this.graph.push(row);
  }

  this.update = function() {
    this.graph.forEach(function(row) {
      row.forEach(function(e) {
        for(let id in MonsterManager.list) {
          if(e.mesh.intersectsMesh(MonsterManager.list[id].hitbox)) {
            
            e.mesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
          } else {
            e.mesh.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
          } 
        }
      })
    })
  }
}

export default NodeGraph;