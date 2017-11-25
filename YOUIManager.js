import * as GUI from 'babylonjs-gui';
import KeyboardManager from './KeyboardManager';
import Sounds from './sounds';
import Utils from './utils';
import MonsterManager from './MonsterManager';
import * as BABYLON from 'babylonjs';
import { scene, camera } from './globals';
import ParticleManager from './ParticleManager';
import DecalManager from './DecalManager';
import ProjectileManager from './ProjectileManager';

// Helper functions for YOUIManager Object

function parseNumbersToArrayOfNumbers(nums) 
{
  return nums.toString().split('').map(function(e) {
    return parseInt(e);
  });
}

function setNumbersImageDimensions(numbersImage, number) 
{
  numbersImage.sourceWidth = 18;
  numbersImage.sourceLeft = 1 + (17 * number);
  numbersImage.height = '9%';
  numbersImage.width = '6%';
  numbersImage.top = '40.5%';
}

function applyNumbersImageOffset(numbersImage, i, number, type) 
{
  if(type == 'ammo') {
    if(number >= 100) {
      numbersImage.left = (-43 + (5 * i)).toString() + '%';//'-20%';
    } else if(number < 10) {
      numbersImage.left = (-38 + (5 * i)).toString() + '%';//'-20%';
    } else {
      numbersImage.left = (-40.5 + (5 * i)).toString() + '%';//'-20%';
    }
  } 

  if(type == 'health') {
    if(number == 100) {
      numbersImage.left = (-20 + (5 * i)).toString() + '%';//'-20%';
    } else if(number < 10) {
      numbersImage.left = (-15.0 + (5 * i)).toString() + '%';//'-20%';
    } else {
      numbersImage.left = (-17.5 + (5 * i)).toString() + '%';//'-20%';
    }
  }

  if(type == 'armor') {
    if(number == 100) {
      numbersImage.left = (33.5 + (5 * i)).toString() + '%';//'-20%';
    } else if(number < 10) {
      numbersImage.left = (38.5 + (5 * i)).toString() + '%';//'-20%';
    } else {
      numbersImage.left = (36 + (5 * i)).toString() + '%';//'-20%';
    }
  }
}

// Gun Constructor

function createGunImage(gunName, sourceWidth, width, height, top) 
{
  var image = new GUI.Image(gunName, `sprites/${gunName}.png`);
  image.sourceWidth = sourceWidth;
  image.width = width + '%';
  image.height = height + '%';
  image.top = top + '%';
  image.isVisible = false;
  return image;
}

var Gun = {
  tick: 0,
  animationIndex: 0,
  moveTick: 0,
  stopMovingGun: function() 
  {
    this.moveTick = 0;
    var imageLeftInt = parseInt(this.gunImage.left.match(/(.+)px/)[1])
    if(imageLeftInt > 0) {
      imageLeftInt -= 1;
      this.gunImage.left = imageLeftInt;
    }
    if(imageLeftInt < 0) {
      imageLeftInt += 1;
      this.gunImage.left = imageLeftInt;
    }

    var imageTopInt = parseInt(this.gunImage.top.match(/(.+)%/)[1])
    var originalTop = parseInt(this.originalTop.match(/(.+)%/)[1])
    if(imageTopInt > originalTop) {
      imageTopInt -= 1;
      this.gunImage.top = imageTopInt + '%';
    }

    if(imageTopInt < originalTop) {
      imageTopInt += 1;
      this.gunImage.top = imageTopInt + '%';
    }
  },
  stopShooting: function() {

  },
  update: function() 
  {
    this.moveTick++;
    if(this.tick > 0) {
      this.tick--;
      if(this.tick % this.fireRate == 0) {
        this.animationIndex += 1
      }
      if(this.animationIndex > this.animationFrames.length - 1) {
        this.animationIndex = 0;
      }
    }
    
    this.gunImage.sourceLeft = this.animationFrames[this.animationIndex];
  }
}

function Shotgun() 
{
  // private variables
  var animationFrames = [375, 125, 250, 375, 500, 625, 750, 625, 500, 375];

  // public variables
  this.gunImage = createGunImage('shotgun', 114, 30, 70, 0);
  this.originalTop = '0%';
  this.fireRate = 7;
  this.pallets = 7;
  this.animationFrames = animationFrames;
  this.ammo = 100;

  // public methods
  this.init = function(assets) 
  {
    this.materials = assets.materials;
  }

  this.shoot = function() 
  {
    if(this.tick == 0 && this.ammo > 0) {
      Sounds.shotgun.play(0.8);
      this.ammo--;
      YOUIManager.showAmmo();
      this.tick = this.fireRate * animationFrames.length;
      for(let i = 0; i < this.pallets; i++) {
        var pickInfo = Utils.getCameraRayCastPickInfoWithOffset();
        var pickedMesh = pickInfo.pickedMesh;
        if(pickedMesh.name == 'imp') {
          MonsterManager.list[pickInfo.pickedMesh.id].getHurt(15, 10);
          MonsterManager.list[pickInfo.pickedMesh.id].emitBloodAt(pickInfo.pickedPoint);
        } else {
          DecalManager.createBulletHoleAt(pickInfo.pickedPoint, pickInfo.getNormal(false));
          /*
          var decalSize = new BABYLON.Vector3(0.1, 0.1, 0.1);
          var decal = BABYLON.MeshBuilder.CreateDecal("decal", pickInfo.pickedMesh, {position: pickInfo.pickedPoint, normal: pickInfo.getNormal(true), size: decalSize});
          decal.material = this.materials.bulletHoleMaterial;
          */
        }
      }
    }
  }
  this.moveGun = function() {
    this.gunImage.top = (0.05) * Math.sin(2 * (0.05 * this.moveTick)) + 0.05;
    this.gunImage.left = 300 * (0.1) * Math.sin(0.05 * this.moveTick);
  }
}

function Chaingun() 
{
  // private variables
  var animationFrames = [0, 114, 228];

  // public variables
  this.gunImage = createGunImage('chaingun', 114, 20, 50, 20);
  this.originalTop = '20%';
  this.fireRate = 3;
  this.pallets = 1;
  this.ammo = 600;

  // public methods
  this.init = function(assets) 
  {
    this.materials = assets.materials;
  }

  this.shoot = function() 
  {
    if(this.tick == 0 && this.ammo > 0) {
      Sounds.chaingun.play(0.5);
      this.ammo--;
      YOUIManager.showAmmo();
      this.tick = this.fireRate * animationFrames.length;
      for(let i = 0; i < this.pallets; i++) {
        var pickInfo = Utils.getCameraRayCastPickInfoWithOffset();
        var pickedMesh = pickInfo.pickedMesh;
        console.log(pickedMesh)
        if(pickedMesh.name == 'imp') {
          MonsterManager.list[pickInfo.pickedMesh.id].getHurt(15, 10);
          MonsterManager.list[pickInfo.pickedMesh.id].emitBloodAt(pickInfo.pickedPoint);
        } else {
          DecalManager.createBulletHoleAt(pickInfo.pickedPoint, pickInfo.getNormal(true));

        }
      }
    }
  }

  this.stopShooting = function() 
  {
    this.gunImage.sourceLeft = animationFrames[0]
  }

  this.moveGun = function() 
  {
    this.gunImage.top = (0.05) * Math.sin(2 * (0.05 * this.moveTick)) + 0.2;
    this.gunImage.left = 300 * (0.1) * Math.sin(0.05 * this.moveTick);
  }

  this.update = function() 
  { 
    this.moveTick++;
    if(this.tick > 0) {
      this.tick--;
      if(this.tick % this.fireRate == 0) {
        this.animationIndex += 1
      }
      if(this.animationIndex > animationFrames.length - 1) {
        this.animationIndex = 0;
      }
    }
    this.gunImage.sourceLeft = animationFrames[this.animationIndex];
  }
}

function RocketLauncher() 
{
  // private variables
  var animationFrames = [0, 120, 240, 360, 480, 600];

  // public variables
  this.gunImage = createGunImage('rocketlauncher', 120, 30, 70, 20);
  this.originalTop = '20%';
  this.fireRate = 7;
  this.pallets = 1;
  this.animationFrames = animationFrames;
  this.ammo = 999;

  // public methods
  this.init = function(assets) 
  {
    this.materials = assets.materials;
  }

  this.shoot = function() 
  {
    if(this.tick == 0 && this.ammo > 0) {
      Sounds.shoot_rocketlauncher.play(0.8);
      this.ammo--;
      YOUIManager.showAmmo();
      this.tick = this.fireRate * animationFrames.length;
      ProjectileManager.createRocket();
    }
  }
  this.moveGun = function() {
    this.gunImage.top = (0.05) * Math.sin(2 * (0.05 * this.moveTick)) + 0.3;
    this.gunImage.left = 300 * (0.1) * Math.sin(0.05 * this.moveTick);
  }
  this.stopShooting = function() {
    if(this.tick == 0) {
      this.gunImage.sourceLeft = animationFrames[5]
    }
  }

}

Shotgun.prototype = Gun;
Chaingun.prototype = Gun;
RocketLauncher.prototype = Gun;

var YOUIManager = new function() {

  // private variables
  var mGUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("hud"),
      healthContainer = new GUI.Rectangle(),
      armorContainer = new GUI.Rectangle(),
      ammoContainer = new GUI.Rectangle(); 

  // public variables
  this.index;
  this.tick;
  this.health = 100;
  this.armor = 0;
  this.ammo = 100;
  this.currentGun;
  this.moving;
  this.shooting;
  this.canShoot;
  this.guns = [];

  this.init = function(assets) 
  {
    this.guns.push(null, null, null, new Shotgun, new Chaingun, new RocketLauncher);
    this.initializeGuns(assets);
    

    this.currentGun = this.guns[3];
    this.showGun();
    this.showHud();
    this.showHealth();
    this.showAmmo();
    this.showArmor();
    this.showDoomGuy();

  }

  this.showHud = function() 
  {
    var hudImage = new GUI.Image("but", "textures/hud.png");
    hudImage.verticalAlignment = 1;
    hudImage.width = "100%";
    hudImage.height = "14.81%";
    mGUI.addControl(hudImage); 
  }

  this.showHealth = function() 
  {
    var healthArray = parseNumbersToArrayOfNumbers(this.health);
    for(let i = 0; i < healthArray.length; i++) {
      var numbersImage = new GUI.Image("numbersImage", "textures/doomnumbers.png");
      setNumbersImageDimensions(numbersImage, healthArray[i]);
      applyNumbersImageOffset(numbersImage, i, this.health, 'health');
      healthContainer.addControl(numbersImage);
    }
    mGUI.addControl(healthContainer);
  }

  this.showAmmo = function() 
  {
    mGUI.removeControl(ammoContainer);
    ammoContainer = new GUI.Rectangle()
    this.ammo = this.currentGun.ammo;
    var ammoArray = parseNumbersToArrayOfNumbers(this.ammo);
    for(let i = 0; i < ammoArray.length; i++) {
      var numbersImage = new GUI.Image("numbersImage", "textures/doomnumbers.png");
      setNumbersImageDimensions(numbersImage, ammoArray[i]);
      applyNumbersImageOffset(numbersImage, i, this.ammo, 'ammo');
      ammoContainer.addControl(numbersImage);
    }
    mGUI.addControl(ammoContainer);
  }

  this.showArmor = function() 
  {
    var armorArray = parseNumbersToArrayOfNumbers(this.armor);
    for(let i = 0; i < armorArray.length; i++) {
      var numbersImage = new GUI.Image("numbersImage", "textures/doomnumbers.png");
      setNumbersImageDimensions(numbersImage, armorArray[i]);
      applyNumbersImageOffset(numbersImage, i, this.armor, 'armor');
      armorContainer.addControl(numbersImage);
    }
    mGUI.addControl(armorContainer);
  }

  this.clearUI = function() {
    mGUI.removeControl(ammoContainer);
    ammoContainer = new GUI.Rectangle();
  }

  this.showDoomGuy = function() 
  {
    var doomGuyFace = new GUI.Image("doomGuyFace", "textures/doomface.png");
    doomGuyFace.height = "14.81%";
    doomGuyFace.width = '13%';
    doomGuyFace.left = '3.2%';
    doomGuyFace.verticalAlignment = 1;
    doomGuyFace.sourceWidth = 30;
    doomGuyFace.sourceLeft = 0;
    mGUI.addControl(doomGuyFace);
  }

  this.initializeGuns = function(assets) {
    this.guns.forEach(function(gun) {
      if(gun) {
        gun.init(assets);
        mGUI.addControl(gun.gunImage);
      }
    }.bind(this)); 
  }

  this.showGun = function() {
    this.currentGun.gunImage.isVisible = true; 
  }

  this.hideGun = function() {
    this.currentGun.gunImage.isVisible = false;
  }

  this.switchGuns = function(e) {
    // e is the number to switch to
    if(this.guns[e]) {
      this.currentGun.gunImage.isVisible = false; 
      this.currentGun = this.guns[e]; 
      this.ammo = this.currentGun.ammo;
      this.showAmmo();
      this.showGun();
    }
  }



  this.update = function() {
    

    this.guns.forEach(function(gun) {
      if(gun) {
        gun.update();
      }
    }.bind(this));

    

    if(this.shooting) {
      this.currentGun.shoot();
    } else {
      this.currentGun.stopShooting();
    }
    if(this.moving && !this.shooting) {
      this.currentGun.moveGun();
    } else {
      this.currentGun.stopMovingGun();
    }



  }







}




export default YOUIManager;
