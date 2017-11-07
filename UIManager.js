import * as GUI from 'babylonjs-gui';

var UIManager = {
  health: 10,
  healthContainer: new GUI.Rectangle(),
  armor: 10,
  armorContainer: new GUI.Rectangle(),
  ammo: 0,
  ammoContainer: new GUI.Rectangle(),
  GUI: GUI.AdvancedDynamicTexture.CreateFullscreenUI("hud"),
  init: function() {
    
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
  }

}

export default UIManager;