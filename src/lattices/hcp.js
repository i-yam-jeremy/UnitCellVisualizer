import {vec3, mat4} from '../gl-matrix';
import {HCPLayer} from './hcpLayer.js';
import {UnitCell, UnitCellPos} from './unitCell.js';
import {Scene} from '../UI';
import {HCPHighlightType} from './hcpHighlightType.js';

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
  ring2Mask[i][j] represents the jth sixths on the top and bottom of the
    unit cell with indexInRing=i in ring 2.
  Iff ring2Mask[i][j] is 1, the sixth should be drawn.
*/
const ring2Mask = [
  [0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 1, 1],
];

function HCP(eighth, sixth, half, sphere, colors) {

    this.prototype = new UnitCell(eighth, half, sphere, colors);

    this.sixth = sixth;
    this.sphere = sphere;
    this.colors = colors;
    this.frame = 0;

    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx, color) {
      const indexInRing = ndx[0];
      const level = ndx[1];
      const ring = ndx[2];

      if (!Scene.hcpRingsVisible[ring] || !Scene.hcpLevelsVisible[level]) {
        return;
      }

      if (Scene.hcpHighlightType === HCPHighlightType.HORIZONTAL) {
        if (level === 1 && (ring === 0 || (ring === 1 && indexInRing === 2))) {
          gl.uniform1f(prog.getHandle("alpha"), 1.0);
        }
        else {
          gl.uniform1f(prog.getHandle("alpha"), 0.25);
        }
      }
      else if (Scene.hcpHighlightType === HCPHighlightType.VERTICAL) {
        if (ring === 0 && (level === 0 || level === 1)) {
          gl.uniform1f(prog.getHandle("alpha"), 1.0);
        }
        else {
          gl.uniform1f(prog.getHandle("alpha"), 0.25);
        }
      }

      this._drawUnitCell(MV, prog, indexInRing, level, ring, pos);
    }

    this._drawUnitCell = function(MV, prog, indexInRing, level, ring, pos) {
      MV.pushMatrix();
      MV.translate(pos);


      gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
      if (level !== -1 && level !== 2) {
        for (let i = 0; i < 3; i++) {
          const radius = 1.0;
          this._drawSphere(MV, prog, vec3.fromValues(radius*Math.cos(2*Math.PI*i/3), 0, radius*Math.sin(2*Math.PI*i/3)));
        }
      }

      gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
      if (level !== 2) {
        for (let i = 0; i < 6; i++) {
          if (ring === 2 && ring2Mask[indexInRing][i] !== 1) continue;
          const radius = 2.0;
          this._drawSixth(MV, prog, -60*i + 150, 180, vec3.fromValues(radius*Math.cos(2*Math.PI*i/6), 1.5, radius*Math.sin(2*Math.PI*i/6)));
        }
      }
      if (level !== -1) {
        for (let i = 0; i < 6; i++) {
          if (ring === 2 && ring2Mask[indexInRing][i] !== 1) continue;
          const radius = 2.0;
          this._drawSixth(MV, prog, -60*i + 30, 0, vec3.fromValues(radius*Math.cos(2*Math.PI*i/6), -1.5, radius*Math.sin(2*Math.PI*i/6)));
        }
      }
      if (level !== 2) {
        this._drawHalfSphere(MV, prog, 180, vec3.fromValues(0, 1.5, 0));
      }
      if (level !== -1) {
        this._drawHalfSphere(MV, prog, 0, vec3.fromValues(0, -1.5, 0));
      }

      MV.popMatrix();
    }

    this._drawSixth = function(MV, prog, rotY, rotZ, pos) {
      MV.pushMatrix();
      MV.translate(pos);
      MV.rotate(rotY, vec3.fromValues(0, 1, 0));
      MV.rotate(rotZ, vec3.fromValues(0, 0, 1));
      gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
      sixth.draw(prog);
      MV.popMatrix();
    }

    this._drawHalfSphere = function(MV, prog, rotZ, pos) {
      this._drawSixth(MV, prog, 0, rotZ, pos);
      this._drawSixth(MV, prog, 120, rotZ, pos);
      this._drawSixth(MV, prog, 240, rotZ, pos);
    }

    this._drawSphere = function(MV, prog, pos) {
      this._drawHalfSphere(MV, prog, 0, pos);
      this._drawHalfSphere(MV, prog, 180, pos);
    }

    this.getCellLayers = function() {
        if(layers == null) {
            layers = new Array();
            layers.push(new HCPLayer(HCPLayer.LayerType.A, 7, colors["grey"], sphere));
            layers.push(new HCPLayer(HCPLayer.LayerType.B, -1.5, colors["green"], sphere));
            layers.push(new HCPLayer(HCPLayer.LayerType.A,  0, colors["grey"], sphere));
            layers.push(new HCPLayer(HCPLayer.LayerType.B,  1.5, colors["green"], sphere));
            layers.push(new HCPLayer(HCPLayer.LayerType.A,  3, colors["grey"], sphere));
        }

        return layers;
    }

    var layers = null;
    this.name = "HCP";
}

export {HCP};
