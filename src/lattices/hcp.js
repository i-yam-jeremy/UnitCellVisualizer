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

      const radius = 2.0*this.expansion;
      const layerHeight = 1.5*expansion;

      for (let layerIndex = 0; layerIndex < 5; layerIndex++) {
        const layerOffset = layerIndex%2 == 1 ?
          vec3.fromValues(0.5*radius*Math.cos(2*Math.PI*1/4), (layerIndex-2)*layerHeight, 0.5*radius*Math.sin(2*Math.PI*1/4)):
          vec3.fromValues(0,0,0);
        let pos = vec3.fromValues(0,0,0);

        const color = layerIndex%2 == 1 ? colors["grey"] : colors["green"];
        gl.uniform3fv(prog.getHandle("kdFront"), color);

        for (let i = 0; i < 3; i++) {
          const hexagonCenter = vec3.fromValues(radius*Math.cos(2*Math.PI*i/3), 0, radius*Math.sin(2*Math.PI*i/3));
          this._drawHexagon(MV, prog, vec3.add(pos, hexagonCenter, layerOffset), radius);
        }
      }
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

    this._drawSphere = function(MV, prog, pos) {
      this._drawSixth(MV, prog, 0, 0, pos);
      this._drawSixth(MV, prog, 120, 0, pos);
      this._drawSixth(MV, prog, 240, 0, pos);
      this._drawSixth(MV, prog, 0, 180, pos);
      this._drawSixth(MV, prog, 120, 180, pos);
      this._drawSixth(MV, prog, 240, 180, pos);
      /*MV.pushMatrix();
      MV.translate(pos);
      gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
      sphere.draw(prog);
      MV.popMatrix();*/
    }

    this._drawHexagon = function(MV, prog, offset, radius) {
      let pos = vec3.fromValues(0,0,0);
      this._drawSphere(MV, prog, vec3.add(pos, offset, vec3.fromValues(0, 0, 0)));
      for (let i = 0; i < 6; i++) {
        const internalOffset = vec3.fromValues(radius*Math.cos(2*Math.PI*i/6), 0, radius*Math.sin(2*Math.PI*i/6));
        this._drawSphere(MV, prog, vec3.add(pos, offset, internalOffset));
      }
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
