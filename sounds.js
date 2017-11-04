import * as BABYLON from 'babylonjs';
import { scene } from './globals';

const Sounds = {};

// put the Babylon name of the song as the key and the file name as the value
const soundFileNames = {
  'shotgunBlast': 'shotgunBlast.wav',
  'pain': 'pain.wav',
  'doomGuyInPain': 'doomguyinpain.wav'
}

for(let name in soundFileNames) {
  Sounds[name] = new BABYLON.Sound(name, `sounds/${soundFileNames[name]}`, scene);
}  

export default Sounds;