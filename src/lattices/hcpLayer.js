import {vec3} from '../gl-matrix';

class HCPLayer {

  constructor(layerType, restHeight, color, sphere) {
    this.layerType = layerType;
    this.restHeight = restHeight;
    this.color = color;
    this.sphere = sphere;
    this.startHeight = 7.0;
    this.curHeight = this.startHeight;
    this.speed = 0.05;
  }

  reset() {
    this.curHeight = this.startHeight;
    this.atRest = false;
  }

  update() {
    if (this.curHeight - this.speed > this.restHeight) {
      this.curHeight -= this.speed;
    } else {
      this.curHeight = this.restHeight;
      this.atRest = true;
    }
  }

  _drawSphere(MV, prog, pos) {
    MV.pushMatrix();
    MV.translate(pos);
    gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
    this.sphere.draw(prog);
    MV.popMatrix();
  }

  _drawSphereTriplet(MV, prog, pos) {
    for (let i = 0; i < 3; i++) {
      const radius = 1.0;
      let v = vec3.fromValues(pos[0],pos[1],pos[2]);
      this._drawSphere(MV, prog, vec3.add(v, v, vec3.fromValues(radius*Math.cos(2*Math.PI*i/3), 0, radius*Math.sin(2*Math.PI*i/3))));
    }
  }

  draw(MV, prog) {
    gl.uniform1f(prog.getHandle("alpha"), 1.0);
    gl.uniform3fv(prog.getHandle("kdFront"), this.color);

    if (this.layerType === HCPLayer.LayerType.A) {
      MV.pushMatrix();
      MV.translate(vec3.fromValues(0,0,-3));
      for (let i = 0; i < 9; i++) {
        if (i % 2 == 0) {
          const count = (i == 0 || i == 8) ? 1 : 7;
          const countOffset = Math.floor(count/2);
          for (let j = 0; j < count; j++) {
            this._drawSphere(MV, prog, vec3.fromValues(2*(j-countOffset), this.curHeight, 1.73*(i-2)));
          }
        }
        else {
          const count = (i == 1 || i == 7) ? 4 : 6;
          const countOffset = Math.floor(count/2);
          for (let j = 0; j < count; j++) {
            this._drawSphere(MV, prog, vec3.fromValues(2*(j-countOffset) + 1, this.curHeight, 1.73*(i-2)));
          }
        }
      }
      MV.popMatrix();
    }
    else { // Type B
      this._drawSphereTriplet(MV, prog, vec3.fromValues(0, this.curHeight, 0));
      for (let i = 0; i < 6; i++) {
        this._drawSphereTriplet(MV, prog, vec3.fromValues(3.46*Math.cos(1*Math.PI/2 + 2*Math.PI*i/6), this.curHeight,3.46*Math.sin(1*Math.PI/2 + 2*Math.PI*i/6), 1));
      }
      for (let i = 0; i < 12; i++) {
        const scale = (i % 2 == 0) ? 2 : 1.73;
        this._drawSphereTriplet(MV, prog, vec3.fromValues(scale*3.46*Math.cos(1*Math.PI/2 + 2*Math.PI*i/12), this.curHeight,scale*3.46*Math.sin(1*Math.PI/2 + 2*Math.PI*i/12), 1));
      }
    }
  }

  isAtRest() {
    return this.atRest;
  }

  rest() {
    this.atRest = true;
    this.curHeight = this.restHeight;
  }

}

HCPLayer.LayerType = {
  A: 'A',
  B: 'B'
};

export {HCPLayer};
