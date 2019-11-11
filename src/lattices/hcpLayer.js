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

  _drawHexagon(MV, prog, offset, radius) {
    let pos = vec3.fromValues(0,0,0);
    this._drawSphere(MV, prog, vec3.add(pos, offset, vec3.fromValues(0, this.curHeight, 0)));
    for (let i = 0; i < 6; i++) {
      const internalOffset = vec3.fromValues(radius*Math.cos(2*Math.PI*i/6), this.curHeight, radius*Math.sin(2*Math.PI*i/6));
      this._drawSphere(MV, prog, vec3.add(pos, offset, internalOffset));
    }
  }

  draw(MV, prog) {
    gl.uniform1f(prog.getHandle("alpha"), 1.0);
    gl.uniform3fv(prog.getHandle("kdFront"), this.color);

    const radius = 2.0;

    const layerOffset = this.layerType === HCPLayer.LayerType.A ?
      vec3.fromValues(0.5*radius*Math.cos(2*Math.PI*1/4), 0, 0.5*radius*Math.sin(2*Math.PI*1/4)):
      vec3.fromValues(0,0,0);
    let pos = vec3.fromValues(0,0,0);

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
