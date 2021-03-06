import { camera } from './globals';
import UIManager from './UIManager';
import YOUIManager from './YOUIManager';

// 61 plus key

const KeyboardManager = {
  keys: {
    'leftClick': false,
    'plus': false,
    'w': false,
    'a': false,
    's': false,
    'd': false
  },
  init: function() {
    // Attach eventhandlers to the render canvas
    var renderCanvas = document.getElementById('renderCanvas')
    renderCanvas.addEventListener('mousedown', function() {
      this.keys['leftClick'] = true;
    }.bind(this));
    renderCanvas.addEventListener('mouseup', function() {
      this.keys['leftClick'] = false;
    }.bind(this));

    renderCanvas.addEventListener('keydown', function(e) {
      switch(e.keyCode) {
        case 187: // +
          camera.applyGravity = true;
          break;
        case 87: // W
          this.keys['w'] = true;
          break;
        case 65: 
          this.keys['a'] = true;
          break;
        case 83: 
          this.keys['s'] = true;
          break;
        case 68:
          this.keys['d'] = true;
          break;
        case 51: // 3
          YOUIManager.switchGuns(3);
          break;
        case 52: // 4 
          YOUIManager.switchGuns(4);
          break;
        case 53: // 5
          YOUIManager.switchGuns(5);
          break;
        default: 
          break;
      }
    }.bind(this));

    renderCanvas.addEventListener('keyup', function(e) {
      console.log(e.keyCode);
      switch(e.keyCode) {
        case 61:
          camera.applyGravity = true;
          break;
        case 87: 
          this.keys['w'] = false;
          break;
        case 65: 
          this.keys['a'] = false;
          break;
        case 83: 
          this.keys['s'] = false;
          break;
        case 68:
          this.keys['d'] = false;
          break;
        default: 
          break;
      }
    }.bind(this));
  },
  /*
  bindKey: function(key, cb) {
    switch(key) {
      case 'leftClick':
        window.addEventListener('mousedown', function() {
          this.keys['leftClick'] = true;

        }.bind(this));
        window.addEventListener('mouseup', function() {
          this.keys['leftClick'] = false;
        }.bind(this));
        break;
      default:
        break;
    }
  },
  */
  update: function() {

    if(this.keys.leftClick) {
      YOUIManager.shooting = true;
      UIManager.shooting = true;
    } else {
      UIManager.shooting = false;
      YOUIManager.shooting = false;
    }

    // Check each movement key to see if it is moving
    const { w, a, s, d } = this.keys;
    if(w || a || s || d) {
      YOUIManager.moving = true;
    } else {
      YOUIManager.moving = false;
    }

  }
}

export default KeyboardManager;