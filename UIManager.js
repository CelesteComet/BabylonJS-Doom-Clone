import * as GUI from 'babylonjs-gui';
import KeyboardManager from './KeyboardManager';
import Sounds from './sounds';
import Utils from './utils';
import MonsterManager from './MonsterManager';
import * as BABYLON from 'babylonjs';
import { scene, camera } from './globals';
import ParticleManager from './ParticleManager';

var UIManager = {
  health: 10,
  healthContainer: new GUI.Rectangle(),
  armor: 10,
  armorContainer: new GUI.Rectangle(),
  ammo: 0,
  ammoContainer: new GUI.Rectangle(),
  GUI: GUI.AdvancedDynamicTexture.CreateFullscreenUI("hud"),
  index: 0,
  tick: 0,
  moving: false,
  shooting: false,
  canShoot: true,
  init: function(assets) {
    this.materials = assets.materials;
    console.log("Initalizing your arsenal of guns");
    for(let gunName in this.guns) {
      this.guns[gunName].init();
    }
    this.canSwitchGuns = true;
    this.bringOutCurrentGun('chaingun');

    var image = new GUI.Image("but", "textures/hud.png");
    image.verticalAlignment = 1;
    image.width = "100%";
    image.height = "14.81%";
    
    this.GUI.addControl(image);    
    this.display('armor');
    this.display('ammo');
    this.display('health');
    this.displayDoomGuyFace();    
  },
  guns: {
    chaingun: {
      image: new GUI.Image('chaingun', 'sprites/chaingun.png'),
      sourceWidth: 114,
      width: '20%',
      height: '50%',
      top: '20%',
      moveTick: 0,
      init: function() {
        var chainGunImage = this.image;
        chainGunImage.sourceWidth = 114;
        chainGunImage.width = '20%';
        chainGunImage.height = '50%';
        chainGunImage.top = '20%';
        UIManager.GUI.addControl(chainGunImage);
        chainGunImage.isVisible = false
        UIManager.currentGun = 'chaingun';
      },
      shoot: function() {

        var arr = [114, 228];
        
        
        UIManager.tick += 1;
        this.moveTick = 0;
        if(UIManager.tick % 7 == 0) {
          var pickInfo = Utils.getCameraRayCastPickInfoWithOffset();

          if(pickInfo && pickInfo.pickedMesh && pickInfo.pickedMesh.name == 'imp') {
            var decalSize = new BABYLON.Vector3(0.1, 0.1, 0.1);
            var decal = BABYLON.MeshBuilder.CreateDecal("decal", pickInfo.pickedMesh, {position: pickInfo.pickedPoint, normal: pickInfo.getNormal(true), size: decalSize});

            decal.material = UIManager.materials.bulletHoleMaterial;
            ParticleManager.emit('blood', pickInfo.pickedPoint);

            MonsterManager.list[pickInfo.pickedMesh.id].getHurt(1000);
          } else {
            ParticleManager.emit('bulletPuff', pickInfo.pickedPoint);
          }

          UIManager.index += 1;
          Sounds.chaingun.play(0.8);
        }

          
        if(UIManager.index > 1) {
          UIManager.index = 0;
        }
        UIManager.guns[UIManager.currentGun].image.sourceLeft = arr[UIManager.index]
      },
      stopShooting: function() {
        var arr = [0, 114, 228];
        UIManager.guns[UIManager.currentGun].image.sourceLeft = arr[0];
      },
      moveGun: function() {
        this.moveTick++;
        this.image.top = (0.05) * Math.sin(2 * (0.05 * this.moveTick)) + 0.3;
        this.image.left = 300 * (0.1) * Math.sin(0.05 * this.moveTick);
      },
      stopMovingGun: function() {
        
        var imageLeftInt = parseInt(this.image.left.match(/(.+)px/)[1])
        if(imageLeftInt > 0) {
          imageLeftInt -= 1;
          this.image.left = imageLeftInt;
        }
        if(imageLeftInt < 0) {
          imageLeftInt += 1;
          this.image.left = imageLeftInt;
        }

        var imageTopInt = parseInt(this.image.top.match(/(.+)%/)[1])
        var originalTop = parseInt(this.top.match(/(.+)%/)[1])
        if(imageTopInt > originalTop) {
          imageTopInt -= 1;
          this.image.top = imageTopInt + '%';
        }

        if(imageTopInt < originalTop) {
          imageTopInt += 1;
          this.image.top = imageTopInt + '%';
        }

      }
    },
    shotgun: {
      image: new GUI.Image('shotgun', 'sprites/shotgun.png'),
      sourceWidth: 114,
      width: '30%',
      height: '70%',
      top: '0%',
      moveTick: 0,
      canShoot: true,
      fireRate: 7,
      pallets: 7,
      init: function() {
        var shotgunImage = this.image;
        shotgunImage.sourceWidth = this.sourceWidth;
        shotgunImage.width = this.width
        shotgunImage.height = this.height;
        shotgunImage.top = this.top;
        UIManager.GUI.addControl(shotgunImage);
        shotgunImage.isVisible = false;
        UIManager.tick = 0;
      },
      shoot: function() {
        var arr = [375, 125, 250, 375, 500, 625, 750, 625, 500, 375];
        console.log(this.canShoot)
        if(this.canShoot) {
          Sounds.shotgun.play(0.8);
          this.canShoot = false;
          UIManager.canSwitchGuns = false;
          for(let i = 0; i < this.pallets; i++) {

            var pickInfo = Utils.getCameraRayCastPickInfoWithOffset();
            if(pickInfo.pickedMesh) {
              
              var decalSize = new BABYLON.Vector3(0.1, 0.1, 0.1);
              var decal = BABYLON.MeshBuilder.CreateDecal("decal", pickInfo.pickedMesh, {position: pickInfo.pickedPoint, normal: pickInfo.getNormal(true), size: decalSize});

              decal.material = UIManager.materials.bulletHoleMaterial;

              if(pickInfo && pickInfo.pickedMesh && pickInfo.pickedMesh.name == 'imp') {
                ParticleManager.emit('blood', pickInfo.pickedPoint, 100);
                // find the monster in the list, play the death animation, then dispose
                MonsterManager.list[pickInfo.pickedMesh.id].getHurt(15);
                //MonsterManager.list[pickInfo.pickedMesh.id].sprite.dispose();
              }
            }
          }
          UIManager.tick = arr.length * this.fireRate;
          UIManager.index = 0;
        }

        this.stopShooting();




        
        


          

        
      },
      stopShooting: function() {
        var arr = [375, 125, 250, 375, 500, 625, 750, 625, 500, 375];
        if(UIManager.tick > 0) {
          UIManager.tick -= 1;
          if(UIManager.tick % this.fireRate == 0) {
            UIManager.index += 1
          }
          if(UIManager.tick == 0) {
            UIManager.index = 0;
            UIManager.canSwitchGuns = true;
            this.canShoot = true;
          }
        }
        UIManager.guns[UIManager.currentGun].image.sourceLeft = arr[UIManager.index]
      },
      moveGun: function() {
        if(this.canShoot) {
          this.moveTick++;
          this.image.top = (0.05) * Math.sin(2 * (0.05 * this.moveTick)) + 0.05;
          this.image.left = 300 * (0.1) * Math.sin(0.05 * this.moveTick);
        }
      },
      stopMovingGun: function() {
        
        var imageLeftInt = parseInt(this.image.left.match(/(.+)px/)[1])
        if(imageLeftInt > 0) {
          imageLeftInt -= 1;
          this.image.left = imageLeftInt;
        }
        if(imageLeftInt < 0) {
          imageLeftInt += 1;
          this.image.left = imageLeftInt;
        }

        var imageTopInt = parseInt(this.image.top.match(/(.+)%/)[1])
        var originalTop = parseInt(this.top.match(/(.+)%/)[1])
        if(imageTopInt > originalTop) {
          imageTopInt -= 1;
          this.image.top = imageTopInt + '%';
        }

        if(imageTopInt < originalTop) {
          imageTopInt += 1;
          this.image.top = imageTopInt + '%';
        }

      }
    }
  },
  bringOutCurrentGun: function(gunName) {
    if(this.canSwitchGuns) {
      UIManager.tick = 0;
      UIManager.index = 0;
      // If we have a gun equipped
      if(this.currentGun) {
        // Set its visibily to false
        this.guns[this.currentGun].image.isVisible = false;
        // Set current gun to the new gun
        this.currentGun = gunName;
        this.guns[gunName].image.isVisible = true;
      } else {
        this.currentGun = gunName;
        this.guns[gunName].image.isVisible = true;
      }
    }

  },
  shootGun: function() {
    this.guns[this.currentGun].shoot();
  },
  stopShooting: function() {
    this.guns[this.currentGun].stopShooting();
  },
  moveGun: function() {
    this.guns[this.currentGun].moveGun();
  },
  stopMovingGun: function() {
    this.guns[this.currentGun].stopMovingGun();
  },
  display: function(type) {
    var array;

    if(type == 'health') {
      this.healthContainer = new GUI.Rectangle();
      array = this.health.toString().split('').map(function(e) {
        return parseInt(e);
      })
    }

    if(type == 'armor') {
      this.armorContainer = new GUI.Rectangle();
      array = this.armor.toString().split('').map(function(e) {
        return parseInt(e);
      })
    }

    if(type == 'ammo') {
      this.ammoContainer = new GUI.Rectangle();
      array = this.ammo.toString().split('').map(function(e) {
        return parseInt(e);
      })
    }

    
    for(let i = 0; i < array.length; i++) {
      var numbersImage = new GUI.Image("but", "textures/doomnumbers.png");
      numbersImage.sourceWidth = 18;
      numbersImage.sourceLeft = 1 + (17 * array[i]);
      numbersImage.height = '9%';
      numbersImage.width = '6%';

      
      if(type == 'health') {
        if(this.health == 100) {
          numbersImage.left = (-20 + (5 * i)).toString() + '%';//'-20%';
        } else if(this.health < 10) {
          numbersImage.left = (-15.0 + (5 * i)).toString() + '%';//'-20%';
        } else {
          numbersImage.left = (-17.5 + (5 * i)).toString() + '%';//'-20%';
        }
      }

      if(type == 'armor') {
        if(this.armor == 100) {
          numbersImage.left = (33.5 + (5 * i)).toString() + '%';//'-20%';
        } else if(this.armor < 10) {
          numbersImage.left = (38.5 + (5 * i)).toString() + '%';//'-20%';
        } else {
          numbersImage.left = (36 + (5 * i)).toString() + '%';//'-20%';
        }
      }

      if(type == 'ammo') {
        if(this.ammo >= 100) {
          numbersImage.left = (-43 + (5 * i)).toString() + '%';//'-20%';
        } else if(this.ammo < 10) {
          numbersImage.left = (-38 + (5 * i)).toString() + '%';//'-20%';
        } else {
          numbersImage.left = (-40.5 + (5 * i)).toString() + '%';//'-20%';
        }
      }

      numbersImage.top = '40.5%';
      if(type == 'health') {
        this.healthContainer.addControl(numbersImage);
      }

      if(type == 'armor') {
        this.armorContainer.addControl(numbersImage);
        
      }

      if(type == 'ammo') {
        this.ammoContainer.addControl(numbersImage);
        
      }
    }   
        this.GUI.addControl(this.ammoContainer)
        this.GUI.addControl(this.healthContainer)  
        this.GUI.addControl(this.armorContainer)  
  },
  takeDamage(n) {
    if(this.health > 0) {
      this.health -= n;
      if(this.health < 0) {
        this.health = 0;
      }
      this.healthContainer.dispose();
      this.display('health');
    }
  },
  reduceAmmo(n) {
    if(this.ammo > 0) {
      this.ammo -= n;
    }
    this.ammoContainer.dispose();
    this.display('ammo');
  },
  displayDoomGuyFace: function() {
    var doomGuyFace = new GUI.Image("doomGuyFace", "textures/doomface.png");
    doomGuyFace.height = "14.81%";
    doomGuyFace.width = '13%';
    doomGuyFace.left = '3.2%';
    doomGuyFace.verticalAlignment = 1;
    doomGuyFace.sourceWidth = 30;
    doomGuyFace.sourceLeft = 0;
    this.GUI.addControl(doomGuyFace);
  },
  update: function() {
    if(this.moving && !this.shooting) {
      this.moveGun();
    } else {
      this.stopMovingGun();
    }

    if(this.shooting) {
      this.shootGun();
    } else {
      this.stopShooting();
    }

    if(this.shooting && this.moving) {
      this.stopMovingGun();
    }
  }

}

export default UIManager;