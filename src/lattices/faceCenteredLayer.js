import {vec3} from '../gl-matrix';

function v(x, y, z) {
  return vec3.fromValues(1.4*x,1.4*y,1.4*z);
}

const allSpheres = [];
for (let y = 0; y < 4; y++) {
  for (let x = 0; x < 4; x++) {
    for (let z = 0; z < 4; z++) {
      allSpheres.push(v(2*x, 2*y, 2*z));
    }
  }
}

const layers = [
  [v(5,0,0)],
  [v(3,0,0), v(4,1,0), v(5,2,0), v(5,1,1), v(5,0,2), v(4,0,1)],
  [v(1,0,0), v(2,1,0), v(3,2,0), v(4,3,0), v(5,4,0), v(5,3,1), v(5,2,2), v(5,1,3), v(5,0,4)],
  [v(-1,0,0), v(0,1,0), v(1,2,0), v(2,3,0), v(3,4,0), v(4,5,0), v(5,6,0), v(5,5,1), v(5,4,2), v(5,3,3), v(5,2,4), v(5,1,5), v(5,0,6)],
  [v(-1,2,0), v(0,3,0), v(1,4,0), v(2,5,0), v(3,6,0), v(5,6,2), v(5,5,3), v(5,4,4), v(5,3,5), v(5,2,6)],
  [v(-1,4,0), v(0,5,0), v(1,6,0), v(5,6,4), v(5,5,5), v(5,4,6)],
  [v(-1,4,0)],
  [],
  [],
  []
];

//FCC cell layering
function FaceCenteredLayer(restHeight, sphere, totalLayerCount, layerIndex, color, expan) {

    this.reset = function() {
        curHeight = startHeight;
        atRest = false;
    };

    this.update = function(t, i) {
      this.hidden = (t === this.startHeight && i !== 0);
      if (t === this.restHeight) {
        this.atRest = true;
      }
      curHeight = t;
    };

    let logged = 0;

    this._drawSphere = function(MV, prog, pos) {
      MV.pushMatrix();
      MV.translate(pos);
      gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
      sphere.draw(prog);
      MV.popMatrix();

      gl.uniform1f(prog.getHandle("alpha"), 1.0);
    };

    this.draw = function(MV, prog) {
        //if (this.hidden) return;

        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        gl.uniform3fv(prog.getHandle("kdFront"), color);

        for (const pos of layers[layerIndex]) {
          this._drawSphere(MV, prog, pos);
        }
    };

    this.isAtRest = function() { return atRest; };

    this.startHeight = 10.0;
    this.restHeight = restHeight;
    var curHeight = 10.0;
    var speed = .1;
    var atRest = false;
    var color = color;
    var offset = vec3.fromValues(0, restHeight ,0);
    var sphere = sphere;
    var flip = false;
    var calledFlip = false;
    var size1 = size1;
    var size2 = size2;
    var countTimes = 0;
    this.hidden = true;
}

export {FaceCenteredLayer};
