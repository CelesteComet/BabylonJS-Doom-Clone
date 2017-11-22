import { MapManager, vertex } from './MapManager';
import MonsterManager from './MonsterManager';
import { scene } from './globals';
import * as BABYLON from 'babylonjs';

function mapNode(i, j) {
  this.coordinates = [i, j];
  this.walls = [];
};

// Some Helpers
function convertEditorCoordinatesToMapNode(x, z, closest, map) {
  let mx = closest * Math.round(x/closest); // should be a function
  let mz = closest * Math.round(z/closest);
  return new vertex(mx, 0, mz);
}

function convertToNearest(vector, closest) {
  let x = closest * Math.round(vector.x/closest)/10;
  let y = closest * Math.round(vector.y/closest)/10;
  let z = closest * Math.round(vector.z/closest)/10;
  return new BABYLON.Vector3(x, y, -z);
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
    this.centers = 60;
    this.holdingMouse = false;

    this.createGrid();

    // Bind Event Listeners

    var saveButton = document.getElementById('saveMap');
    saveButton.addEventListener('click', function() {
      window.localStorage.setItem('map', JSON.stringify(MapManager.saved));
    })

    var saveButton = document.getElementById('deleteMap');
    saveButton.addEventListener('click', function() {
      window.localStorage.removeItem('map');
    })



    this.canvas.addEventListener('mousedown', function(e) {
      if(getSelectItem('mainSelect') == 'wall') {
        this.holdingMouse = true;
        this.startVertex = convertToNearest(new BABYLON.Vector3(e.offsetX, 5, e.offsetY), 30);
      }

    }.bind(this));

    this.canvas.addEventListener('mousemove', function(e) {
      if(this.holdingMouse && this.startVertex) {
        this.endVertex = convertToNearest(new BABYLON.Vector3(e.offsetX, 5, e.offsetY), 30);
      }
    }.bind(this))


    this.canvas.addEventListener('mouseup', function(e) {
      this.holdingMouse = false;
      if(getSelectItem('mainSelect') == 'wall') {
        MapManager.createWall(this.startVertex, this.endVertex, 10);
      }
      this.startVertex = null;
      this.endVertex = null;

    }.bind(this));

    this.canvas.addEventListener('click', function(e) {
      if(getSelectItem('mainSelect') == 'Imp') {
        let vertex = convertToNearest(new BABYLON.Vector3(e.offsetX, 5, e.offsetY), 30);
        let Imp = MonsterManager.create();
        
        Imp.hitbox.position = new BABYLON.Vector3(vertex.x, Imp.hitboxProps.height/2, vertex.z);

        Imp.sprite.position = Imp.hitbox.position;
        
      }
    }.bind(this));
  },
  createGrid: function () {
    // Create the map data array
    for(let i = 0; i < 90; i++) {
      let row = []
      for(let j = 0; j < 90; j++) {
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
          this.ctx.moveTo(wall.startVertex.x * 10, -wall.startVertex.z * 10);
          this.ctx.lineTo(wall.endVertex.x * 10, -wall.endVertex.z * 10);
          this.ctx.stroke();  
        }
      } 
      
    
  }

};

export default MapEditor;