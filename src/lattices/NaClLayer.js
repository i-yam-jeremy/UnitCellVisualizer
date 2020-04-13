import {vec3} from '../gl-matrix';

// a more robust Layer
// for NaCl
function NaClLayer(rows, cols, restHeight, xexpansion, zexpansion, color1, size1, color2, size2, sphere) {

    this.reset = function() {
        curHeight = startHeight;
        currSplitAmt = splitAmt;
        atRest = false;
    };

    this.update = function(height, split, i) {
      this.hidden = (height === this.startHeight && i !== 0);
      if (height === this.restHeight && split === 0) {
        this.atRest = true;
      }
      curHeight = height;
      currSplitAmt = split;
    };

    this.draw = function(MV, prog) {
        if (this.hidden) return;

        gl.uniform1f(prog.getHandle("alpha"), 1.0);

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {

                var pos = vec3.fromValues(offset[0] + j*2*xexpansion, curHeight*xexpansion, offset[2] + i*2*zexpansion);

                MV.pushMatrix();
                //even spheres draw on the left
                if((i + j) % 2 == 0 && flip) {
                    MV.translate(vec3.fromValues(-1 * currSplitAmt, 0, 0));
                } else if ((i + j) % 2 == 0 && !flip) {
                    MV.translate(vec3.fromValues(currSplitAmt, 0, 0));
                } else if (flip) {
                    MV.translate(vec3.fromValues(currSplitAmt, 0, 0));
                } else {
                    MV.translate(vec3.fromValues(-1 * currSplitAmt, 0, 0));
                }

                MV.translate(pos);

                //even spheres get the first scale
                if((i + j) % 2 == 0) {
                    MV.scale(size1);
                    gl.uniform3fv(prog.getHandle("kdFront"), color1);
                } else {
                    MV.scale(size2);
                    gl.uniform3fv(prog.getHandle("kdFront"), color2);
                }

                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
        }

    };

    this.isAtRest = function() { return atRest; };

    this.flip = function() {
        flip = !flip;
        calledFlip = true;
    }

    this.notCalledFlip = function() {return !calledFlip;}

    var rows = rows;
    var cols = cols;
    var startHeight = 10.0;
    this.startHeight = startHeight;
    var restHeight = restHeight;
    this.restHeight = restHeight;
    var xexpansion = xexpansion;
    var zexpansion = zexpansion;
    var curHeight = startHeight;
    var speed = .1;
    var atRest = false;
    var color = color;
    var offset = vec3.fromValues(-(cols-1)*xexpansion, restHeight,-(rows-1)*zexpansion);
    var sphere = sphere;
    var flip = false;
    var calledFlip = false;
    var color1 = color1;
    var color2 = color2;
    var size1 = size1;
    var size2 = size2;
    var countTimes = 0;
    var splitAmt = 10;
    this.splitAmt = splitAmt;
    var currSplitAmt = splitAmt;
    this.hidden = false;
}

export {NaClLayer};
