import * as BABYLON from 'babylonjs';
import { scene, engine, canvas, camera, cambox } from './globals';
import Utils from './utils';
import Sounds from './sounds';
import options from './options';
import showAxis from './axis'
import MonsterManager from './MonsterManager';
import ProjectileManager from './ProjectileManager';
import MapEditor from './MapEditor';
import UIManager from './UIManager';
import KeyboardManager from './KeyboardManager';
import ParticleManager from './ParticleManager';


import { MapManager } from './MapManager';
import { vertex } from './MapManager';
console.log(vertex)
var game = {
  init: function(assets) {
    console.log("Initializing the game");

    if(options.showAxis) { showAxis(10) }

    console.log("Initialzing assets");
    var Materials = assets.materials;

    console.log("Initializing Monster Manager");
    ParticleManager.init(assets);
    MonsterManager.init(assets);
    MapManager.init(assets);
    UIManager.init(assets);
    MapEditor.init();
    KeyboardManager.init();

    

    console.log("Adding beautiful lights");
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

    console.log("Adding a beautiful floor");

    for(var i = 0; i < 1; i++) {
        let Imp = MonsterManager.create('cacodemon');
        var mvertex = new vertex(Math.random() * 50, Imp.hitboxProps.height/2, Math.random() * 50);
        Imp.hitbox.position = new BABYLON.Vector3(mvertex.x, Imp.hitboxProps.height/2, -mvertex.z);

        //Imp.sprite.position = Imp.hitbox.position;
    }

    //var a = MapManager.createWall(new vertex(0, 0, 0), new vertex(10, 0, 0), 10);
    
    

    //var music = new BABYLON.Sound("Music", "sounds/e2m1.mp3", scene, null, { loop: true, autoplay: true });

      
    var tick = 0;
    console.log("Running the engine loop");
    var fpsLabel = document.getElementById("fpsLabel");
    engine.runRenderLoop(function(){
      tick++;
      if(tick % 100 == 0) {
        if(options.hell) {
          let Imp = MonsterManager.create('cacodemon');
          var mvertex = new vertex(Math.random() * 50, Imp.hitboxProps.height/2, Math.random() * 50);
          Imp.hitbox.position = new BABYLON.Vector3(mvertex.x, Imp.hitboxProps.height/2, -mvertex.z);
          Imp.sprite.position = Imp.hitbox.position;
        }

      }
      MapEditor.update();
      KeyboardManager.update();
      MonsterManager.update();
      ProjectileManager.update();
      UIManager.update();
      cambox.position = camera.position;
      cambox.rotation = camera.rotation;
      scene.render();
      
    fpsLabel.innerHTML = engine.getFps().toFixed() + " fps";
    });
  }
};

export default game;