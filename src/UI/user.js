import * as $ from 'jquery';
import {Scene} from './scene.js';
import {ViewMode} from './viewMode.js';

var User = {

    mouseDown : false,
    first : true,
    ctrl : false,
    crystalSelector : null,
    dispSelector : null,

    setup: function(dispSelector, crystalSelector, camera) {
        this.crystalSelector = crystalSelector;
        this.dispSelector = dispSelector;
        var canvas = document.getElementById("canvas");

        canvas.onmousedown = function(e) {
            User.mouseDown = true;
        };

        canvas.onmouseup = function(e) {
            User.mouseDown = false;
            User.first = true;
        };

        canvas.onmousemove = function(e) {

            if (User.mouseDown) {
                camera.mouseMoved(e.clientX, e.clientY, User.first, User.ctrl);

                if (User.first) {
                    User.first = false;
                }
            }
        };

        canvas.onwheel = function(e) {

            if(e.shiftKey) {
                //wheel up - expand
                if(e.deltaY < 0) {
                    Scene.expand();
                }
                //wheel down - contract
                //if(e.deltaY < 0) {
                else {
                    Scene.contract();
                }
            } else {
                //wheel up - zoom in
                if(e.deltaY < 0) {
                    camera.zoomIn();
                }
                //wheel down - zoom out
                else {
                    camera.zoomOut();
                }
            }
        }

        window.AAA = 5;

        $(document).keydown(function(e) {

            window.shift = e.shiftKey;

            // deactivated key controls while I sort out the new UI
            switch(e.which) {

	        case 'E'.charCodeAt(0): // left
                    Scene.expand();
                    break;

	        case 'C'.charCodeAt(0): // right
                    Scene.contract();
                    break;
                    
	        case 'T'.charCodeAt(0):
                    if (Scene.viewMode === ViewMode.UNIT_CELL) {
                      Scene.toggleTranslucency();
                    } else {
                      alert('You must be in Unit Cell view mode to toggle transluceny. Use the radio button in the bottom left of the view and select Unit Cell.');
                    }
                    break;

                case 'N'.charCodeAt(0):
                    Scene.toggleColor();
                    break;

                case 17:
                    User.ctrl = true;
                    break;
//
	        default: return; // exit this handler for other keys
            }

            e.preventDefault(); // prevent the default action (scroll / move caret)
        });

        $(document).keyup(function(e) {

            if (e.which == 17) {
                User.ctrl = false;
            }
//            else if(e.which == 16) {
//                User.shift = false;
//            }
        });
    },
};

export {User};
