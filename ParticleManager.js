import * as BABYLON from 'babylonjs';
import { scene } from './globals';

const ParticleManager = {
  init: function(assets) {
    this.materials = assets.materials;
    this.run();
  },
  effectsProperties: {
    blood: {
      particleTexture: new BABYLON.Texture("textures/Flare.png", scene),
      minSize: 0.1,
      maxSize: 0.3,
      emitRate: 6000,
      targetStopDuration: 1,
      maxEmitPower: 1,
      color1: new BABYLON.Color4(0.1, 0, 0, 1),
      color2: new BABYLON.Color4(0.1, 0, 0, 1),
      gravity: new BABYLON.Vector3(0, -150.81, 0),
      disposeOnStop: true,
      direction1:  new BABYLON.Vector3(-7, 8, 3),
      direction2: new BABYLON.Vector3(7, 8, -3)
    }
  },
  run: function() {
    for(let effectName in this.effectsProperties) {
      var props = this.effectsProperties[effectName];
      this[effectName] = new BABYLON.ParticleSystem("particles", 1000, scene);

      // this[effectName] is now a ParticleSystem object and needs to be configured
      this[effectName].particleTexture = props.particleTexture;
      this[effectName].minSize = props.minSize;
      this[effectName].maxSize = props.maxSize;
      this[effectName].emitRate = props.emitRate;
      this[effectName].targetStopDuration = props.targetStopDuration;
      this[effectName].maxEmitPower = props.maxEmitPower;
      this[effectName].color1 = props.color1;
      this[effectName].color2 = props.color2;
      this[effectName].gravity = props.gravity;
      this[effectName].disposeOnStop = props.disposeOnStop;
      this[effectName].direction1 = props.direction1;
      this[effectName].direction2 = props.direction2;
    }
  },
  emit: function(type, emitter) {
    var clonedParticleSystem = this[type].clone();
    clonedParticleSystem.emitter = emitter;
    clonedParticleSystem.start();
  }
}

export default ParticleManager;
/*
var particleSystem = new BABYLON.ParticleSystem("particles", 400, scene);
particleSystem.particleTexture = new BABYLON.Texture("textures/Flare.png", scene);
particleSystem.emitter = pickInfo.pickedPoint;
particleSystem.minSize = 0.1;
particleSystem.maxSize = 0.3;
particleSystem.emitRate = 6000;
particleSystem.targetStopDuration = 1;
particleSystem.minEmitPower = 1;
particleSystem.maxEmitPower = 1;
particleSystem.color1 = new BABYLON.Color4(0.1, 0, 0, 1);
particleSystem.color2 = new BABYLON.Color4(0.1, 0, 0, 1);
particleSystem.gravity = new BABYLON.Vector3(0, -150.81, 0);
particleSystem.disposeOnStop = true;
particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
particleSystem.start()
*/