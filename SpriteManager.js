import * as BABYLON from 'babylonjs';
import { scene } from './globals';

var SpriteManager = {
  Imp: new BABYLON.SpriteManager("SpriteManagerImp", "sprites/imp.png", 10000, 70, scene),
  Cacodemon: new BABYLON.SpriteManager("SpriteManagerCacodemon", "sprites/cacodemon.png", 1000, 100, scene),
  Explosion: new BABYLON.SpriteManager("SpriteManagerExplosion", "sprites/explosion.png", 20, 120, scene),
  Rocket: new BABYLON.SpriteManager("SpriteManagerRocket", "sprites/playerRocket.png", 500, 55, scene)
};

export default SpriteManager;

