import { MapManager, vertex } from './MapManager';
import MonsterManager from './MonsterManager';
import * as BABYLON from 'babylonjs';

function mapNode(i, j) {
  this.coordinates = [i, j];
  this.walls = [];
};

// Some Helpers
function convertEditorCoordinatesToMapNode(x, z, closest, map) {
  let mx = closest * Math.round(x/closest); // should be a function
  let mz = closest * Math.round(z/closest);
  return new vertex(mx/30, 0, mz/30);
}


function getSelectItem(id) {
  return document.getElementById(id).value;
}

const MapEditor = {
  init: function() {
    this.canvas = document.getElementById('mapEditor');
    this.ctx = this.canvas.getContext('2d');
    this.map = [];
    this.startVertex;
    this.endVertex;
    this.centers = 30;
    this.holdingMouse = false;

    this.createGrid();




    // Bind event listeners

    // [0,0]   [0,5]

    this.canvas.addEventListener('mousedown', function(e) {
      if(getSelectItem('mainSelect') == 'wall') {
        this.holdingMouse = true;
        this.startVertex = convertEditorCoordinatesToMapNode(e.offsetX, -e.offsetY, this.centers, this.map)
      }

    }.bind(this));

    this.canvas.addEventListener('mousemove', function(e) {
      if(this.holdingMouse && this.startVertex) {
        this.endVertex = convertEditorCoordinatesToMapNode(e.offsetX, -e.offsetY, this.centers, this.map)
      }
    }.bind(this))


    this.canvas.addEventListener('mouseup', function(e) {
      this.holdingMouse = false;
      if(getSelectItem('mainSelect') == 'wall') {
        mapManager.createWall(this.startVertex, this.endVertex, 10);
      }
      this.startVertex = null;
      this.endVertex = null;

    }.bind(this));

    this.canvas.addEventListener('click', function(e) {
      if(getSelectItem('mainSelect') == 'Imp') {
        let vertex = convertEditorCoordinatesToMapNode(e.offsetX, e.offsetY, this.centers, this.map)
        let Imp = MonsterManager.create();
        console.log(Imp)
        Imp.hitbox.position = new BABYLON.Vector3(vertex.x, Imp.hitboxProps.height/2, -vertex.z);

        Imp.sprite.position = Imp.hitbox.position;
        Imp.hitbox.computeWorldMatrix();
      }
    }.bind(this));
  },
  createGrid: function () {
    // Create the map data array
    for(let i = 0; i < 100; i++) {
      let row = []
      for(let j = 0; j < 100; j++) {
        this.ctx.fillRect(i * 30, j * 30, 5, 5);
      }
      this.map.push(row);
    }
  },
  update: function() {
    
      this.ctx.clearRect(0,0,1000,1000)
      this.createGrid();
      if(this.startVertex && this.endVertex) {
         this.ctx.beginPath()
         this.ctx.moveTo(this.startVertex.x, this.startVertex.y);
         this.ctx.lineTo(this.endVertex.x, this.endVertex.y);
         this.ctx.stroke();
      }
      for(var id in MapManager.list) {
        var wall = MapManager.list[id];
        if(wall.name == 'wall') {
          this.ctx.beginPath()
          this.ctx.moveTo(wall.startVertex.x * 30, -wall.startVertex.z * 30);
          this.ctx.lineTo(wall.endVertex.x * 30, -wall.endVertex.z * 30);
          this.ctx.stroke();  
        }
      } 
      
    
  }

};

export default MapEditor;