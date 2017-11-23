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
  },
  getRadiansBetweenTwoVectors: function(origin, point) {
    // Returns radian angle with respect to X-Z plane, useful to rotate an object to view a certain point
    var signed_angle = Math.atan2(point.z - origin.z, point.x - origin.x);
    return -signed_angle + Math.PI/2;
  },
  flipDirection: function(d) {
    var o = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
      upRight: 'downLeft',
      upLeft: 'downRight',
      downRight: 'upLeft',
      downLeft: 'upRight'
    }
    return o[d];
  }
}

export default Utils;

