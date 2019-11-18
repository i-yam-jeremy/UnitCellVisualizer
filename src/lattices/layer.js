import {vec3} from '../gl-matrix';

function Layer(rows, cols, restHeight, xexpansion, zexpansion, color, sphere) {

    this.reset = function() {
        curHeight = this.startHeight;
        atRest = false;
    };

    this.update = function(t, i) {
      this.hidden = (t === this.startHeight && i !== 0);
      console.log('a', t, this.startHeight);
      if (t === this.restHeight) {
        this.atRest = true;
      }
      curHeight = t;
    };

    this.draw = function(MV, prog) {
        if (this.hidden) return;

        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        gl.uniform3fv(prog.getHandle("kdFront"), color);



        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {

                var pos = vec3.fromValues(offset[0] + j*2*xexpansion, curHeight*xexpansion, offset[2] + i*2*zexpansion);

                MV.pushMatrix();
                MV.translate(pos);
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
        }

    };

    this.isAtRest = function() { return atRest; };

    var rows = rows;
    var cols = cols;
    this.startHeight = 7.0;
    this.restHeight = restHeight;
    var xexpansion = xexpansion;
    var zexpansion = zexpansion;
    var curHeight = 7.0;
    var speed = .05;
    var atRest = false;
    var color = color;
    var offset = vec3.fromValues(-(cols-1)*xexpansion, restHeight,-(rows-1)*zexpansion);
    var sphere = sphere;
    this.hidden = true;
}

export {Layer};
