import {vec3} from '../gl-matrix';
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

    this.draw = function(MV, prog) {
      for (const layer of layers) {
        if (!layer.isAtRest()) layer.rest();
        layer.draw(MV, prog);
      }
        /*MV.pushMatrix();
        MV.rotate(20, vec3.fromValues(0, 1, 0));
        gl.uniform3fv(prog.getHandle("kdFront"), colors['grey']);
        sixth.draw(prog);
        MV.popMatrix();*/
    }

    this.getCellLayers = function() {
        if(layers == null) {
            layers = new Array();
            // FIXME layers don't quite line up hexagonally (look at https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Flampx.tugraz.at%2F~hadley%2Fss1%2Fcrystalstructure%2Fstructures%2Fhcp%2Fabab.png&f=1&nofb=1 and compare)
            layers.push(new HCPLayer(HCPLayer.LayerType.A, -3, colors["grey"], sphere));
            layers.push(new HCPLayer(HCPLayer.LayerType.B, -1, colors["green"], sphere));
            /*layers.push(new HCPLayer(5, 0.0, 1.0, 1.0, colors["grey"], sphere));
            layers.push(new HCPLayer(4, 1.5, 1.0, 1.0, colors["green"], sphere));
            layers.push(new HCPLayer(5, 3.0, 1.0, 1.0, colors["grey"], sphere));*/
        }

        return layers;
    }

    var layers = null;
    this.name = "HCP";
}

export {HCP};
