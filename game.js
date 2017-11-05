import * as BABYLON from 'babylonjs';
import { scene, engine, canvas, camera, cambox } from './globals';
import Utils from './utils';
import Sounds from './sounds';
import MonsterManager from './MonsterManager';
import WeaponsManager from './WeaponsManager';
import ProjectileManager from './ProjectileManager';
import MapManager from './MapManager';


var game = {
  init: function(assets) {
    console.log("Initializing the game");

    console.log("Initialzing assets");
    var Materials = assets.materials;

    console.log("Initializing Monster Manager");
    MonsterManager.init(assets);
    WeaponsManager.init(assets);
    MapManager.init(assets);
    

    console.log("Adding beautiful lights");
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

    console.log("Adding a beautiful floor");
    var ground = BABYLON.Mesh.CreateGround('ground1', 300, 300, 0, scene);
    ground.checkCollisions = true;



    // create some monsters
    for(var i = 0; i < 0; i++) {
      var m = MonsterManager.create();
      m.hitbox.position.x += i * 5;
    }

    console.log("Running the engine loop");
    engine.runRenderLoop(function(){
      MonsterManager.update();
      WeaponsManager.update();
      ProjectileManager.update();
      MapManager.update();
      cambox.position = camera.position;
      cambox.rotation = camera.rotation;
      scene.render();
    });
  }
};

export default game;