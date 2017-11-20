import * as BABYLON from 'babylonjs';
import { camera, scene } from './globals';

const Utils = {
  getCameraRay: function() {
    return new BABYLON.Ray(camera.globalPosition, camera.getTarget().subtract(camera.globalPosition).normalize())
  },
  getCameraRayCastPickInfoWithOffset: function() {
    var target = camera.getTarget().clone(); 
    target.x += Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1) * 0.7;
    target.y += Math.random() * 0.05 * (Math.floor(Math.random()*2) == 1 ? 1 : -1) * 0.7;
    var ray = new BABYLON.Ray(camera.globalPosition, target.subtract(camera.globalPosition).normalize());
    var pickInfo = scene.pickWithRay(ray);
    return pickInfo;
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
  },
  getDirectionBetweenTwoVectors: function(start, end) {
    return start.subtract(end).normalize();
  }
}

export default Utils;

