import * as BABYLON from 'babylonjs';
import { camera, scene } from './globals';

const Utils = {
  getCameraRayCastPosition: function() {
    var ray = new BABYLON.Ray(camera.globalPosition, camera.getTarget().subtract(camera.globalPosition).normalize());
    var pickInfo = scene.pickWithRay(ray);
    return pickInfo.pickedPoint;
  },
  getCameraRayCastPickInfo: function() {
    var ray = new BABYLON.Ray(camera.globalPosition, camera.getTarget().subtract(camera.globalPosition).normalize());
    var pickInfo = scene.pickWithRay(ray);
    return pickInfo;
  }
}

export default Utils;