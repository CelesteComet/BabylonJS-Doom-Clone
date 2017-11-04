import * as BABYLON from 'babylonjs';
import { scene } from './globals';

const Materials = {};

// put the Babylon name of the song as the key and the file name as the value
const textures = {
  'bulletHoleMaterial': { type: 'diffuse', fileName: 'impact.png' },
  'woodenCrate': { type: 'diffuse', fileName: 'woodenCrate.jpg' }
};

for(let textureName in textures) {
  Materials[textureName] = new BABYLON.StandardMaterial(textureName, scene);
  Materials[textureName][textures[textureName].type + 'Texture'] = new BABYLON.Texture('textures/' + textures[textureName].fileName);
};

Materials.bulletHoleMaterial.diffuseTexture.hasAlpha = true; 
Materials.bulletHoleMaterial.zOffset = -2;

export default Materials;






// Brick Material
/*
Materials.brickMaterial = new BABYLON.StandardMaterial(name, scene);
var brickTexture = new BABYLON.BrickProceduralTexture(name + "text", 512, scene);
brickTexture.numberOfBricksHeight = 60;
brickTexture.numberOfBricksWidth = 100;
Materials.brickMaterial.diffuseTexture = brickTexture;

// Grass Material
Materials.grassMaterial = new BABYLON.StandardMaterial(name + "bawl", scene);
var grassTexture = new BABYLON.GrassProceduralTexture(name + "textbawl", 256, scene);
Materials.grassMaterial.ambientTexture = grassTexture;
*/