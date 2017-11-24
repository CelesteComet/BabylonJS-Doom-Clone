import * as BABYLON from 'babylonjs';
import { scene, assetsManager } from './globals';
import opts from './options';
import game from './game';

const { verbose } = opts;

const assets = {
  materials: {}
};


const textures = {
  'wireFrame': { type: 'diffuse', fileName: 'woodenCrate.jpg' }, // change in the future
  'bulletHoleMaterial': { type: 'diffuse', fileName: 'impact.png' },
  'woodenCrate': { type: 'diffuse', fileName: 'woodenCrate.jpg' },
  'e1m1wall': { type: 'diffuse', fileName: 'e1m1wall.png' },
  'e1m1wallBump': { type: 'bump', for: 'e1m1wall', fileName: 'NormalMap.png' },
  'e1m1floor': { type: 'diffuse', fileName: 'e1m1floor.png' },
  'e1m1floorBump': { type: 'bump', for: 'e1m1floor', fileName: 'bump_e1m1floor.png' },
  'e1m1ceil': { type: 'diffuse', fileName: 'e1m1ceil.png' },
  'e1m1ceilBump': { type: 'bum[', for: 'e1m1ceil', fileName: 'bump_e1m1ceil.png' }
};

const numberOfTextures = Object.keys(textures).length;
let loadedTextures = 0;

for(let textureName in textures) {
  if(verbose) { console.log(`loading ${textureName}`) }
  var imageTask = assetsManager.addImageTask(textureName, 'textures/' + textures[textureName].fileName);
  imageTask.onSuccess = function(task) {
    if(verbose) { console.log(`loaded ${textureName}`); }
    loadedTextures++;
    if(textures[textureName].for) {
      console.log("ASD")
      assets.materials[textures[textureName].for].bumpTexture = new BABYLON.Texture('textures/' + textures[textureName].fileName);
    } else {
      assets.materials[textureName] = new BABYLON.StandardMaterial(textureName, scene);
      assets.materials[textureName][textures[textureName].type + 'Texture'] = new BABYLON.Texture('textures/' + textures[textureName].fileName);
    }
    if(loadedTextures == numberOfTextures) {
      assets.materials.bulletHoleMaterial.diffuseTexture.hasAlpha = true; 
      assets.materials.bulletHoleMaterial.zOffset = -2;
      assets.materials.wireFrame.wireframe = false;
      // Shotgun Material
      assets.materials.shotgunMaterial = new BABYLON.StandardMaterial(name, scene);
      var shotgunTexture = new BABYLON.Texture("sprites/shotgun.png", scene);
      shotgunTexture.uScale = 1/7;
      shotgunTexture.hasAlpha = true;
      assets.materials.shotgunMaterial.diffuseTexture = shotgunTexture;


    }
  }
};

assetsManager.onFinish = function() {
  game.init(assets);
}

assetsManager.load();
