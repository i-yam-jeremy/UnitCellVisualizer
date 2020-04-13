import {vec3} from '../gl-matrix';
import {Layer} from './layer.js';
import {UnitCell, UnitCellPos} from './unitCell.js';

function SimpleCubic(eighth, half, sphere, colors) {

    this.prototype = new UnitCell(eighth, half, sphere, colors);

    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx, color) {
        if (center && alpha < 1.0) {
            gl.uniform1f(prog.getHandle("alpha"), 1.0);
            if(color == 0) {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["blue"]);
            }
            else {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
            }
        } else {
            gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        }

        MV.pushMatrix();
        MV.translate(pos);

        if (bounds[1] != UnitCellPos.MIN) {

            if (bounds[2] != UnitCellPos.MIN) {

                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 0); }
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 90); }
            }

            if (bounds[2] != UnitCellPos.MAX) {
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 180); }
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 270); }
            }
        }

        if (bounds[1] != UnitCellPos.MAX) {

            MV.pushMatrix();
            MV.rotate(90.0, vec3.fromValues(1.0, 0.0, 0.0));

            if (bounds[2] != UnitCellPos.MIN) {
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 0); }
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 90); }
            }

            MV.rotate(180.0, vec3.fromValues(1.0, 0.0, 0.0));

            if (bounds[2] != UnitCellPos.MAX){
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 180); }
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 270); }
            }

            MV.popMatrix();
        }

        MV.popMatrix();

        gl.uniform1f(prog.getHandle("alpha"), alpha); // Make sure alpha is same as it was
    };

    this.drawEighth = function(MV, prog, rot) {
        MV.pushMatrix();

        MV.rotate(rot, vec3.fromValues(0.0, 1.0, 0.0));
        MV.translate(vec3.fromValues(1.0, -1.0, -1.0));
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);

        MV.popMatrix();
    };

    this.drawCoord = function(MV, prog, scale) {
        MV.pushMatrix();
        MV.scale(scale);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);

        for(var i = 0; i < 3; i++) {
            for(var j = -2; j < 5; j += 4) {
                MV.pushMatrix();
                if(i == 0) {
                    MV.translate(vec3.fromValues(j, 0, 0));
                }
                else if (i == 1) {
                    MV.translate(vec3.fromValues(0, j, 0));
                }
                else {
                    MV.translate(vec3.fromValues(0, 0, j));
                }
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
        }

        MV.popMatrix();
    }

    this.getCellLayers = function() {
        if(layers == null) {
            layers = new Array();
            layers.push(new Layer(4,4, -3, 1.0, 1.0, colors["grey"], sphere));
            layers.push(new Layer(4,4, -1, 1.0, 1.0, colors["grey"], sphere));
            layers.push(new Layer(4,4, 1, 1.0, 1.0, colors["grey"], sphere));
            layers.push(new Layer(4,4, 3, 1.0, 1.0, colors["grey"], sphere));
        }

        return layers;
    }

    this.drawSingle = function(MV, prog, scale) {
        MV.pushMatrix();
        MV.scale(scale);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);

        for(var i = -1; i < 2; i += 2) {
            for(var j = -1; j < 2; j += 2) {
                for(var k = -1; k < 2; k += 2) {
                    MV.pushMatrix();
                    MV.translate(vec3.fromValues(i, j, k));
                    gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                    sphere.draw(prog);
                    MV.popMatrix();
                }
            }
        }

        MV.popMatrix();
    }

    this.name = "Simple Cubic";
    var layers = null;
}

export {SimpleCubic};
