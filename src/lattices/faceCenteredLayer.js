import {vec3} from '../gl-matrix';

//FCC cell layering
function FaceCenteredLayer(restHeight, sphere, totalLayerCount, layerIndex, color) {

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

    this._drawSphere = function(MV, prog, pos) {
      MV.pushMatrix();
      MV.translate(pos);
      gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
      sphere.draw(prog);
      MV.popMatrix();
    };

    this.draw = function(MV, prog) {
        if (this.hidden) return;

        MV.pushMatrix();

        gl.uniform3fv(prog.getHandle("kdFront"), color);

        for (let j = 0; j < 2; j++) {
          const triangleSideLength = 2*layerIndex - 3*j;
          const triangleVertexToCenterLength = (triangleSideLength/2) / Math.cos(Math.PI/6);
          for (let i = 0; i < 3; i++) {
            const radius = 2.0*triangleVertexToCenterLength;
            const pos = vec3.fromValues(radius*Math.cos(2*Math.PI*i/3 + Math.PI/6), curHeight, radius*Math.sin(2*Math.PI*i/3 + Math.PI/6));
            const nextPos = vec3.fromValues(radius*Math.cos(2*Math.PI*(i+1)/3 + Math.PI/6), curHeight, radius*Math.sin(2*Math.PI*(i+1)/3 + Math.PI/6));
            this._drawSphere(MV, prog, pos);

            const dirToNextPos = vec3.fromValues(0,0,0);
            vec3.subtract(dirToNextPos, nextPos, pos);

            for (let i = 0; i < triangleSideLength; i++) {
              let v = vec3.fromValues(0,0,0);
              const p = vec3.add(v, pos, vec3.scale(v, dirToNextPos, i/(triangleSideLength)));
              this._drawSphere(MV, prog, p);
            }
          }
        }

        gl.uniform1f(prog.getHandle("alpha"), 1.0);

        MV.popMatrix();
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
