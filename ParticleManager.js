import * as BABYLON from 'babylonjs';
import { scene } from './globals';

const ParticleManager = {
  init: function(assets) {
    this.materials = assets.materials;
    this.run();
  },
  effectsProperties: {
    blood: {
      amount: 1000,
      particleTexture: new BABYLON.Texture("textures/flare.png", scene),
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
    },
    blueBlood: {
      amount: 1000,
      particleTexture: new BABYLON.Texture("textures/flare.png", scene),
      minSize: 0.1,
      maxSize: 0.3,
      emitRate: 6000,
      targetStopDuration: 1,
      maxEmitPower: 1,
      color1: new BABYLON.Color4(0, 0, 1, 1),
      color2: new BABYLON.Color4(0, 0, 1, 1),
      gravity: new BABYLON.Vector3(0, -150.81, 0),
      disposeOnStop: true,
      direction1:  new BABYLON.Vector3(-7, 8, 3),
      direction2: new BABYLON.Vector3(7, 8, -3),
      minLifeTime: 0.3,
      maxLifeTime: 1
    },
    bulletPuff: {
      amount: 10,
      particleTexture: new BABYLON.Texture("textures/flare.png", scene),
      minSize: 0.05,
      maxSize: 0.05,
      emitRate: 6000,
      targetStopDuration: 1,
      minEmitPower: 10,
      color1: new BABYLON.Color4(1, 1, 1, 1),
      color2: new BABYLON.Color4(1, 1, 1, 1),
      gravity: new BABYLON.Vector3(0, 0, 0),
      disposeOnStop: true,
      direction1:  new BABYLON.Vector3(0.5, 0.5, 0.5),
      direction2: new BABYLON.Vector3(-0.5, 0.5, -0.5),
      minLifeTime: 0.3,
      maxLifeTime: 1
    },
    rocketTrail: {
      amount: 5000,
      particleTexture: new BABYLON.Texture("textures/flare.png", scene),
      minSize: 0.4,
      maxSize: 0.5,
      emitRate: 500,
      targetStopDuration: 100,
      maxEmitPower: 10,
      color1: new BABYLON.Color4(1, 0, 0, 1),
      color2: new BABYLON.Color4(0.5, 0, 0, 1),
      gravity: new BABYLON.Vector3(0, 0, 0),
      disposeOnStop: false,
      direction1:  new BABYLON.Vector3(0, 0, 0),
      direction2: new BABYLON.Vector3(0, 0, 0),
      minLifeTime: 0.3,
      maxLifeTime: 1
    }
  },
  run: function() {
    for(let effectName in this.effectsProperties) {
      var props = this.effectsProperties[effectName];
      this[effectName] = new BABYLON.ParticleSystem("particles", props.amount, scene);

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
      this[effectName].minLifeTime = props.minLifeTime;
      this[effectName].maxLifeTime = props.maxLifeTime;

    }
  },
  emit: function(type, emitter, amount) {
    var clonedParticleSystem = this[type].clone();
    amount ? clonedParticleSystem._capacity = amount : 500
    clonedParticleSystem.emitter = emitter;
    clonedParticleSystem.start();
    return clonedParticleSystem;
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