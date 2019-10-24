import {vec3, mat4} from '../gl-matrix';
import {HCPLayer} from './hcpLayer.js';
import {UnitCell, UnitCellPos} from './unitCell.js';

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function HCP(eighth, sixth, half, sphere, colors) {

    this.prototype = new UnitCell(eighth, half, sphere, colors);

    this.sixth = sixth;
    this.sphere = sphere;
    this.colors = colors;
    this.expansion = 1.0;
    this.frame = 0;

    this.draw = function(MV, prog, _pos, alpha, center, bounds, ndx, color, expansion) {
      this.expansion = expansion;

      gl.uniform1f(prog.getHandle("alpha"), 1.0);

      this._drawUnitCell(MV, prog, vec3.fromValues(0,0,0));
      for (let i = 0; i < 6; i++) {
        this._drawUnitCell(MV, prog, vec3.fromValues(3.46*Math.cos(1*Math.PI/2 + 2*Math.PI*i/6),0,3.46*Math.sin(1*Math.PI/2 + 2*Math.PI*i/6)));
      }


      this._drawUnitCell(MV, prog, vec3.fromValues(0,3,0));
      for (let i = 0; i < 6; i++) {
        this._drawUnitCell(MV, prog, vec3.fromValues(3.46*Math.cos(1*Math.PI/2 + 2*Math.PI*i/6),3,3.46*Math.sin(1*Math.PI/2 + 2*Math.PI*i/6)));
      }
    }

    this._drawUnitCell = function(MV, prog, pos) {
      MV.pushMatrix();
      MV.translate(pos);

      gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
      for (let i = 0; i < 3; i++) {
        const radius = 1.0;
        this._drawSphere(MV, prog, vec3.fromValues(radius*Math.cos(2*Math.PI*i/3), 0, radius*Math.sin(2*Math.PI*i/3)));
      }

      gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
      for (let i = 0; i < 6; i++) {
        const radius = 2.0;
        this._drawSixth(MV, prog, -60*i + 150, 180, vec3.fromValues(radius*Math.cos(2*Math.PI*i/6), 1.5, radius*Math.sin(2*Math.PI*i/6)));
      }
      for (let i = 0; i < 6; i++) {
        const radius = 2.0;
        this._drawSixth(MV, prog, -60*i + 30, 0, vec3.fromValues(radius*Math.cos(2*Math.PI*i/6), -1.5, radius*Math.sin(2*Math.PI*i/6)));
      }
      this._drawHalfSphere(MV, prog, 180, vec3.fromValues(0, 1.5, 0));
      this._drawHalfSphere(MV, prog, 0, vec3.fromValues(0, -1.5, 0));

      MV.popMatrix();
    }

    this._drawSixth = function(MV, prog, rotY, rotZ, pos) {
      MV.pushMatrix();
      MV.translate(pos);
      MV.rotate(rotY, vec3.fromValues(0, 1, 0));
      MV.rotate(rotZ, vec3.fromValues(0, 0, 1));
      MV.translate(vec3.fromValues(-0.33*(this.expansion-1), 0.33*(this.expansion-1), 0));
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
            /*layers.push(new HCPLayer(HCPLayer.LayerType.B, -1.5, colors["green"], sphere));
            layers.push(new HCPLayer(HCPLayer.LayerType.A,  0, colors["grey"], sphere));
            layers.push(new HCPLayer(HCPLayer.LayerType.B,  1.5, colors["green"], sphere));
            layers.push(new HCPLayer(HCPLayer.LayerType.A,  3, colors["grey"], sphere));*/
        }

        return layers;
    }

    var layers = null;
    this.name = "HCP";
}

export {HCP};
