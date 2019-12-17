import {vec3} from '../gl-matrix';

function v(x, y, z) {
  return vec3.fromValues(1.4*x - 1.4*3, 1.4*y - 1.4*3, 1.4*z - 1.4*3);
}

const allSpheres = [];
/*for (let y = 0; y < 4; y++) {
  for (let x = 0; x < 4; x++) {
    for (let z = 0; z < 4; z++) {
      allSpheres.push(v(2*x, 2*y, 2*z));
    }
  }
}*/

for (let y = 0; y < 3; y++) {
  for (let x = 0; x < 3; x++) {
    for (let z = 0; z < 4; z++) {
      allSpheres.push(v(2*x, 2*y, 2*z));
    }
  }
}

for (let y = 0; y < 4; y++) {
  for (let x = 0; x < 3; x++) {
    for (let z = 0; z < 3; z++) {
      allSpheres.push(v(2*x, 2*y-1, 2*z+1));
    }
  }
}

for (let y = 0; y < 3; y++) {
  for (let x = 0; x < 4; x++) {
    for (let z = 0; z < 3; z++) {
      allSpheres.push(v(2*x-1, 2*y, 2*z+1));
    }
  }
}

const layers = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
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

        for (const pos of /*layers[layerIndex]*/allSpheres) {
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
