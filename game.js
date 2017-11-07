import * as BABYLON from 'babylonjs';
import { scene, engine, canvas, camera, cambox } from './globals';
import Utils from './utils';
import Sounds from './sounds';
import MonsterManager from './MonsterManager';
import WeaponsManager from './WeaponsManager';
import ProjectileManager from './ProjectileManager';
import MapManager from './MapManager';
import UIManager from './UIManager';
import NodeGraph from './NodeGraph';


var game = {
  init: function(assets) {
    console.log("Initializing the game");

    console.log("Initialzing assets");
    var Materials = assets.materials;

    console.log("Initializing Monster Manager");
    MonsterManager.init(assets);
    WeaponsManager.init(assets);
    MapManager.init(assets);
    UIManager.init();
    

    console.log("Adding beautiful lights");
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);



    var nodeGraph = new NodeGraph;

    // create some monsters
    for(var i = 0; i < 1; i++) {
        var m = MonsterManager.create();
        m.hitbox.position = new BABYLON.Vector3(30, -19, 30)
        m.sprite.position = m.hitbox.position;

    }

    console.log("Running the engine loop");
    engine.runRenderLoop(function(){
      nodeGraph.update();
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