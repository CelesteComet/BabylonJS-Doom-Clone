import * as BABYLON from 'babylonjs';
import { camera, scene } from './globals';

const Utils = {
  getCameraRay: function() {
    return new BABYLON.Ray(camera.globalPosition, camera.getTarget().subtract(camera.globalPosition).normalize())
  },
  getCameraRayCastPosition: function() {
    var ray = new BABYLON.Ray(camera.globalPosition, camera.getTarget().subtract(camera.globalPosition).normalize());
    var pickInfo = scene.pickWithRay(ray);
    return pickInfo.pickedPoint;
  },
  getCameraRayCastPickInfo: function() {
    var ray = new BABYLON.Ray(camera.globalPosition, camera.getTarget().subtract(camera.globalPosition).normalize());
    var pickInfo = scene.pickWithRay(ray);
    return pickInfo;
  },
  getNearestRound(num, nearest) {
    var diff = num % nearest;
    var nearest = num - diff;
    return nearest;
  },
  getCameraFrontBy() {
    var dir = camera.getTarget().subtract(camera.globalPosition).normalize();
    return dir.scaleInPlace(3);
  }
}

export default Utils;

