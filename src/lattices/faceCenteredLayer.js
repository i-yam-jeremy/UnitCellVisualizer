import {vec3} from '../gl-matrix';

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
      const centerOfRotation = vec3.fromValues(0,0,0);
      let actualPos = vec3.fromValues(pos[0], restHeight, pos[2]);
      vec3.add(actualPos, actualPos, layerOffset);
      vec3.rotateZ(actualPos, actualPos, centerOfRotation, Math.PI/4);
      vec3.rotateX(actualPos, actualPos, centerOfRotation, Math.PI/4);
      /*if (actualPos[0] > window.AAA || actualPos[0] < -window.AAA ||
          actualPos[1] > window.AAA || actualPos[1] < -window.AAA ||
          actualPos[2] > window.AAA || actualPos[2] < -window.AAA)
          return;//gl.uniform1f(prog.getHandle("alpha"), 0.25);*/
      /*if (logged < 30) {
        console.log('FCC', actualPos, pos);
        logged++;
      }*/

      MV.pushMatrix();
      MV.translate(vec3.add(pos, pos, layerOffset));
      gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
      sphere.draw(prog);
      MV.popMatrix();

      gl.uniform1f(prog.getHandle("alpha"), 1.0);
    };

    this._drawSphereTriplet = function(MV, prog, pos) {
      for (let i = 0; i < 3; i++) {
        const radius = 1.15;
        let v = vec3.fromValues(pos[0],pos[1],pos[2]);
        this._drawSphere(MV, prog, vec3.add(v, v, vec3.fromValues(radius*Math.cos(2*Math.PI*i/3 + Math.PI/6), 0, radius*Math.sin(2*Math.PI*i/3 + Math.PI/6))));
      }
    };

    this.draw = function(MV, prog) {
        if (this.hidden) return;

        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        gl.uniform3fv(prog.getHandle("kdFront"), color);

        MV.pushMatrix();
        /*MV.rotate(45, vec3.fromValues(0, 0, 1));
        MV.rotate(45, vec3.fromValues(1, 0, 0));
        MV.translate(layerOffset);*/

        /*for (let y = 0; y < 20; y++) {
          for (let x = 0; x < 20; x++) {
            this._drawSphere(MV, prog, vec3.fromValues(1.73*(x-10), curHeight, 2*(y-10) - x%2));
          }
        }*/

        /*MV.popMatrix();

        MV.pushMatrix();
        MV.translate(layerOffset);
        for (let x = 0; x < 10; x++) {
          this._drawSphere(MV, prog, vec3.fromValues(2*x, 0, 0));
        }
        for (let y = 0; y < 10; y++) {
          this._drawSphere(MV, prog, vec3.fromValues(0, 2*y, 0));
        }
        for (let z = 0; z < 10; z++) {
          this._drawSphere(MV, prog, vec3.fromValues(0, 0, 2*z));
        }*/
        this._drawSphereTriplet(MV, prog, vec3.fromValues(0, curHeight, 0));
        for (let i = 0; i < 6; i++) {
          this._drawSphereTriplet(MV, prog, vec3.fromValues(3.46*Math.cos(1*Math.PI/2 + 2*Math.PI*i/6), curHeight,3.46*Math.sin(1*Math.PI/2 + 2*Math.PI*i/6), 1));
        }
        /*for (let i = 0; i < 12; i++) {
          const scale = (i % 2 == 0) ? 2 : 1.73;
          this._drawSphereTriplet(MV, prog, vec3.fromValues(scale*3.46*Math.cos(1*Math.PI/2 + 2*Math.PI*i/12), curHeight,scale*3.46*Math.sin(1*Math.PI/2 + 2*Math.PI*i/12), 1));
        }
        for (let i = 0; i < 24; i++) {
          const scale = 2 * ((i % 2 == 0) ? 2 : 1.73);
          this._drawSphereTriplet(MV, prog, vec3.fromValues(scale*3.46*Math.cos(1*Math.PI/2 + 2*Math.PI*i/24), curHeight,scale*3.46*Math.sin(1*Math.PI/2 + 2*Math.PI*i/24), 1));
        }*/
        MV.popMatrix();
    };

    const layerTypeOffsets = [
      vec3.fromValues(-1,0,0.66),
      vec3.fromValues(0,0,0),
      vec3.fromValues(1,0,-0.66)
    ];

    this.isAtRest = function() { return atRest; };

    this.startHeight = 10.0;
    this.restHeight = restHeight;
    var layerOffset = layerTypeOffsets[layerIndex%3];
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
