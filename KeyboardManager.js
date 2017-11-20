import { camera } from './globals';
import UIManager from './UIManager';

// 61 plus key

const KeyboardManager = {
  keys: {
    'leftClick': false,
    'plus': false,
    'w': false
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
        case 87: // W
          this.keys['w'] = false;
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
      UIManager.shooting = true;
    } else {
      UIManager.shooting = false;
    }

    if(this.keys['w']) {
      UIManager.moving = true;
    } else {
      UIManager.moving = false;
    }

  }
}

export default KeyboardManager;