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

        const layerTypeOffsets = [
          vec3.fromValues(-1,0,-0.5),
          vec3.fromValues(0,0,0),
          vec3.fromValues(0,0,-1)
        ];

        MV.pushMatrix();
        MV.rotate(45, vec3.fromValues(0, 0, 1));
        MV.rotate(45, vec3.fromValues(1, 0, 0));
        MV.translate(layerTypeOffsets[layerIndex%3]);

        this._drawSphereTriplet(MV, prog, vec3.fromValues(0, curHeight, 0));
        for (let i = 0; i < 6; i++) {
          this._drawSphereTriplet(MV, prog, vec3.fromValues(3.46*Math.cos(1*Math.PI/2 + 2*Math.PI*i/6), curHeight,3.46*Math.sin(1*Math.PI/2 + 2*Math.PI*i/6), 1));
        }
        for (let i = 0; i < 12; i++) {
          const scale = (i % 2 == 0) ? 2 : 1.73;
          this._drawSphereTriplet(MV, prog, vec3.fromValues(scale*3.46*Math.cos(1*Math.PI/2 + 2*Math.PI*i/12), curHeight,scale*3.46*Math.sin(1*Math.PI/2 + 2*Math.PI*i/12), 1));
        }
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
