import {vec3} from '../gl-matrix';

const spherePositionsByLayer = (() => {
  function v(x, y, z) {
    return vec3.fromValues(1.4*x - 1.4*3, 1.4*y - 1.4*3, 1.4*z - 1.4*3);
  }

  let allSpheres = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      for (let z = 0; z < 4; z++) {
        allSpheres.push(v(2*x-1, 2*y-1, 2*z));
      }
    }
  }

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

  let layers = [
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

  const planeNormal = vec3.fromValues(1,1,1);
  for (let i = 0; i < 10; i++) {
    const pointOnPlane = vec3.fromValues(2.8*(i+1) - 1.4*3,-1.4*3,-1.4*3);
    const d = -vec3.dot(planeNormal, pointOnPlane);
    for (const pos of allSpheres) {
      if (Math.abs(vec3.dot(planeNormal, pos) - d) < 0.01) {
        layers[9-i].push(pos);
      }
    }
  }

  return layers;
})();

//FCC cell layering
function FaceCenteredLayer(sphere, totalLayerCount, layerIndex, color, expan) {

    this.update = function(t, i) {
      this.hidden = (t === this.startHeight && i !== 0);
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
        if (this.hidden) return;

        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        gl.uniform3fv(prog.getHandle("kdFront"), color);

        MV.pushMatrix();
        MV.translate(vec3.fromValues(curHeight, curHeight, curHeight));
        for (const pos of spherePositionsByLayer[layerIndex]) {
          this._drawSphere(MV, prog, pos);
        }
        MV.popMatrix();
    };

    this.startHeight = 10.0;
    this.restHeight = 0;
    var curHeight = 10.0;
    var speed = .1;
    var atRest = false;
    var color = color;
    var offset = vec3.fromValues(0, 0 ,0);
    var sphere = sphere;
    var flip = false;
    var calledFlip = false;
    var size1 = size1;
    var size2 = size2;
    var countTimes = 0;
    this.hidden = true;
}

export {FaceCenteredLayer};
