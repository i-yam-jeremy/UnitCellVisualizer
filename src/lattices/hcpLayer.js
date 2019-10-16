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

  draw(MV, prog) {
    gl.uniform1f(prog.getHandle("alpha"), 1.0);
    gl.uniform3fv(prog.getHandle("kdFront"), this.color);

    this._drawSphere(MV, prog, vec3.fromValues(0, this.curHeight, 0));
    const radius = 2.0;
    for (let i = 0; i < 6; i++) {
      this._drawSphere(MV, prog,
        vec3.fromValues(radius*Math.cos(2*Math.PI*i/6), this.curHeight, radius*Math.sin(2*Math.PI*i/6)));
    }
  }

  isAtRest() {
    return this.atRest;
  }


}

HCPLayer.LayerType = {
  A: 'A',
  B: 'B'
};

export {HCPLayer};
