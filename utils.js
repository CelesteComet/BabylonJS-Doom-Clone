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
    return -signed_angle; + Math.PI/2;
  },
  getDegreesBetweenTwoVectors: function(origin, point) {
    var degs = this.getRadiansBetweenTwoVectors(origin, point) * 180 / Math.PI;
    if(degs < 0) {
      degs += 360
    }
    return degs;
  },
  flipDirection: function(ObjectFacing, CameraRelativeToObject) {

    // left
    // down 
    var arr = ['down', 'downRight', 'right', 'upRight', 'up', 'upLeft', 'left', 'downLeft'];
    var o = {
      down: 0,
      downRight: 1,
      right: 2,
      upRight: 3,
      up: 4,
      upLeft: 5,
      left: 6,
      downLeft: 7
    };

    var s = o[ObjectFacing] - o[CameraRelativeToObject];
    if(s < 0) {
      return arr[arr.length - Math.abs(s)];
    } else {
      return arr[s];
    }
  },
  getRelativePosition: function(deg) {
    if(deg <= 30 && deg >= 0 || deg > 330 && deg <= 360) {
      return 'right';
    } else if(deg <= 60) {
      return 'downRight';
    } else if(deg <= 120) {
      return 'down';
    } else if(deg <= 150) {
      return 'downLeft';
    } else if(deg <= 210) {
      return 'left';
    } else if(deg <= 240) {
      return 'upLeft';
    } else if(deg <= 300) {
      return 'up';
    } else if(deg <= 330) {
      return 'upRight';
    }
  }
}

export default Utils;

