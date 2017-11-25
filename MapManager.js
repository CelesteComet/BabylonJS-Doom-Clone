import * as BABYLON from 'babylonjs';
import { scene } from './globals';

var bustomMesh = new BABYLON.Mesh("wall", scene);

var MapManager = {
  list: {},
  saved: [],
  init: function(assets) {
    this.materials = assets.materials;
    this.run();

    if(localStorage.getItem('map')) {
      this.saved = JSON.parse(window.localStorage.getItem('map'));
      this.saved.forEach(function(wall) {
        var a = wall[0];
        var b = wall[1];
        MapManager.createWall(new BABYLON.Vector3(a.x, a.y,a.z), new BABYLON.Vector3(b.x, b.y, b.z), 5);
      })
    }

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 500, height: 500, subdivsions: 1}, scene);
    ground.checkCollisions = true;
    ground.material = MapManager.materials.e1m1floor;
    ground.material.diffuseTexture.uScale = 500;
    ground.material.diffuseTexture.vScale = 500;
    //ground.material.bumpTexture.uScale = 500;
    //ground.material.bumpTexture.vScale = 500;
    ground.setPivotMatrix(BABYLON.Matrix.Translation(50/2, 0, 50/2));
    ground.id = Math.random()
    MapManager.list[ground.id] = ground;
/*
    var ceiling = BABYLON.MeshBuilder.CreateBox("gd", {width: 500, height: 500, subdivsions: 1}, scene);
    ceiling.checkCollisions = false;
    ceiling.rotation.x = Math.PI/2;
    ceiling.position.y += 35;
    ceiling.material = MapManager.materials.e1m1ceil;
    ceiling.material.diffuseTexture.uScale = 500;
    ceiling.material.diffuseTexture.vScale = 500;
    ceiling.material.bumpTexture.uScale = 500;
    ceiling.material.bumpTexture.vScale = 500;
    ceiling.setPivotMatrix(BABYLON.Matrix.Translation(50/2, 0, 50/2));
    ceiling.id = Math.random()
*/
    //var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 0, -3), scene);
  },
  run: function() {

  },
  createWall: function(startVertex, endVertex, height) {
    console.log('start', startVertex)
    console.log('end', endVertex)
    this.saved.push([startVertex, endVertex])
    // Clone custom mesh 
    var wallInstance = bustomMesh.clone('wall');

    // Give wallInstance an id 
    wallInstance.id = Math.random();

    // Create custom mesh positions from vertices
    var {x, y, z} = startVertex;
    var positions = [
      x, height, z, x, 0, z, endVertex.x, 0, endVertex.z,
      x, height, z, endVertex.x, 0, endVertex.z, endVertex.x, height, endVertex.z
    ];

    // Create indices for each of the vertex positions
    var indices = [0, 1, 2, 3, 4, 5];

    // Calculate normals
    var normals = [];
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);

    // Create UVS for textures
    var uvs = [0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1];

    // Create vertexData object to apply to the custom mesh, uses positions and indices
    var vertexData = new BABYLON.VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    // Apply vertexData to custom mesh
    vertexData.applyToMesh(wallInstance);    

    // Find length between vertices
    var length = Math.sqrt(Math.pow(endVertex.x - startVertex.x, 2) + Math.pow(endVertex.z - startVertex.z, 2));

    // Expose startVertex and endVertex objects for map drawing
    wallInstance.startVertex = startVertex;
    wallInstance.endVertex = endVertex;

    wallInstance.material = this.materials.e1m1wall.clone();
    wallInstance.material.diffuseTexture.uScale = length/4;
    wallInstance.material.diffuseTexture.vScale = 2;
    //wallInstance.material.bumpTexture.uScale = length/4;
    //wallInstance.material.bumpTexture.vScale = 2;
    wallInstance.material.backFaceCulling = true;

    wallInstance.checkCollisions = true;

    //showNormals(wallInstance, 5, null, scene);
    this.list[wallInstance.id] = wallInstance;  

    return wallInstance;
  }

}

function vertex(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
}

function showNormals(mesh, size, color, sc) {
  var normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
  var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);      
  color = color || BABYLON.Color3.White();
  sc = sc || scene;
  size = size || 1;

  var lines = [];
  for (var i = 0; i < normals.length; i += 3) {
      var v1 = BABYLON.Vector3.FromArray(positions, i);
      var v2 = v1.add(BABYLON.Vector3.FromArray(normals, i).scaleInPlace(size));
      lines.push([v1.add(mesh.position), v2.add(mesh.position)]);
  }
  var normalLines = BABYLON.MeshBuilder.CreateLineSystem("normalLines", {lines: lines}, sc);
  normalLines.color = color;
  return normalLines;
}

  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial; 



















export { vertex, MapManager }



