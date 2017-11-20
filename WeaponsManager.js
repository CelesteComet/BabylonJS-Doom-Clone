import * as BABYLON from 'babylonjs';
import { scene, camera, cambox } from './globals';
import opts from './options';
import Sounds from './sounds';
import Utils from './utils';
import MonsterManager from './MonsterManager';
import UIManager from './UIManager';
import KeyboardManager from './KeyboardManager';

const { debug } = opts;
    // create the user interface including the gun


var WeaponsManager = {
  weapons: {},
  init: function(assets) {
    this.materials = assets.materials;
    this.run();
  },
  run: function() {
    this.weapons['shotgun'] = this.initShotgun();
  },
  initShotgun: function() {

    var shotgun = {
      ammo: 50,
      pallets: 5,
      timer: 0,
      offset: 0,
      waveTick: 0,
      canShoot: true,
      animationFrame: [0,1,2,3,4,5,6,5,4],
      mesh: BABYLON.MeshBuilder.CreatePlane('weapon', {width: 1}, scene),
      shoot: function() {
        shotgun.ammo--;
        UIManager.reduceAmmo(1);
        Sounds.shotgunBlast.play();
        this.timer = 55;
        //var pickInfo = Utils.getCameraRayCastPickInfo();
        for(let i = 0; i < this.pallets; i++) {

          var pickInfo = Utils.getCameraRayCastPickInfoWithOffset();
          if(pickInfo.pickedMesh) {
            var decalSize = new BABYLON.Vector3(0.1, 0.1, 0.1);
            var decal = BABYLON.MeshBuilder.CreateDecal("decal", pickInfo.pickedMesh, {position: pickInfo.pickedPoint, normal: pickInfo.getNormal(true), size: decalSize});

            decal.material = WeaponsManager.materials.bulletHoleMaterial;
            if(pickInfo && pickInfo.pickedMesh && pickInfo.pickedMesh.name == 'imp') {
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
              // find the monster in the list, play the death animation, then dispose
              MonsterManager.list[pickInfo.pickedMesh.id].die();
              //MonsterManager.list[pickInfo.pickedMesh.id].sprite.dispose();
            }
          }
        }
        /*
        
        if(pickInfo.pickedMesh) {
          var decalSize = new BABYLON.Vector3(0.1, 0.1, 0.1);
          var decal = BABYLON.MeshBuilder.CreateDecal("decal", pickInfo.pickedMesh, {position: pickInfo.pickedPoint, normal: pickInfo.getNormal(true), size: decalSize});
          decal.material = WeaponsManager.materials.bulletHoleMaterial;
          if(pickInfo && pickInfo.pickedMesh && pickInfo.pickedMesh.name == 'imp') {
            // find the monster in the list, play the death animation, then dispose
            MonsterManager.list[pickInfo.pickedMesh.id].die();
            //MonsterManager.list[pickInfo.pickedMesh.id].sprite.dispose();
          }
        }
        */
      },
      hasAmmo: function() {
        return shotgun.ammo >= 1;
      },
      update: function() {
        this.currentPosition = cambox.absolutePosition.clone();

        if(this.currentPosition.x != this.previousPosition.x) {
          this.waveTick++;
          this.mesh.position.y = (1/50) * Math.sin(this.waveTick * 0.3) - 0.115;
          this.mesh.position.x = (1/100) * Math.cos(this.waveTick * 0.2) 
        } else {
          //console.log("stop")
        }
        this.previousPosition = this.currentPosition;
        if(this.timer > 0) {
          this.canShoot = false;
          this.timer--;
        }

        if(this.timer % 6 == 0) {
          this.mesh.material.diffuseTexture.uOffset = this.animationFrame[this.offset]/7;
          this.offset++;
        }

        if(this.timer == 0) {
          this.offset = 0;
          this.canShoot = true;
          this.mesh.material.diffuseTexture.uOffset = this.animationFrame[3]/7;
        }
      }
    }

    shotgun.mesh.material = this.materials.shotgunMaterial;
    shotgun.mesh.position.z += 2;
    shotgun.mesh.position.y -= 0.115;
    shotgun.mesh.isPickable = false;
    shotgun.mesh.parent = cambox;
    shotgun.mesh.material.hasAlpha = true;
    shotgun.mesh.material.alpha = 1;

    shotgun.previousPosition = cambox.absolutePosition.clone();

    // Set UI Manager to show shotgun ammo
    UIManager.ammo = shotgun.ammo;


    return shotgun;
  }, 
  update: function() {
    for(let weaponName in this.weapons) {
      this.weapons[weaponName].update();
    }
  }
}

export default WeaponsManager;
