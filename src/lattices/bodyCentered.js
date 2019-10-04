import {Layer} from './layer.js';
import {UnitCell, UnitCellPos} from './unitCell.js';

function BodyCentered(eighth, half, sphere, colors) {

    this.prototype = new UnitCell(eighth, half, sphere, colors);

    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx, color) {
        if (center && alpha < 1.0) {
            gl.uniform1f(prog.getHandle("alpha"), 1.0);
        }

        if (center || alpha == 1.0) {
            if(color == 0) {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
            }
            else {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
            }
        } else {
            gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        }

        MV.pushMatrix();
        MV.translate(pos);

        if (bounds[0] != UnitCellPos.MIN && bounds[0] != UnitCellPos.MAX &&
            bounds[1] != UnitCellPos.MIN && bounds[1] != UnitCellPos.MAX &&
            bounds[2] != UnitCellPos.MIN && bounds[2] != UnitCellPos.MAX) {

            // Draw center atom
            MV.pushMatrix();
            MV.scale(this.scale);
            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
            sphere.draw(prog);
            MV.popMatrix();
        }

        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);

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
            if (bounds[2] != UnitCellPos.MAX) {
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
        MV.scale(this.scale);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);

        MV.popMatrix();
    };

    this.drawInspect = function(MV, prog, scale, inspctExp) {
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        MV.pushMatrix();
        MV.scale(scale);

        MV.pushMatrix();
        MV.translate(vec3.fromValues(-2, 0, 0));
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();

        MV.pushMatrix();
        MV.translate(vec3.fromValues(2, 0, 0));
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();

        MV.popMatrix();
    }

    this.drawCoord = function(MV, prog, scale) {
        MV.pushMatrix();
        MV.scale(scale);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);

        for(var i = -1.13; i < 2; i += 2.26) {
            for(var j = -1.13; j < 2; j += 2.26) {
                for(var k = -1.13; k < 2; k += 2.26) {
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

    this.getCellLayers = function() {
        if(layers == null) {
            layers = new Array();
            layers.push(new Layer(4,4, -3, 1.14942, 1.14942, colors["grey"], sphere));
            layers.push(new Layer(3,3, -2, 1.14942, 1.14942, colors["red"], sphere));
            layers.push(new Layer(4,4, -1, 1.14942, 1.14942, colors["grey"], sphere));
            layers.push(new Layer(3,3, 0, 1.14942, 1.14942, colors["red"], sphere));
            layers.push(new Layer(4,4, 1, 1.14942, 1.14942, colors["grey"], sphere));
            layers.push(new Layer(3,3, 2, 1.14942, 1.14942, colors["red"], sphere));
            layers.push(new Layer(4,4, 3, 1.14942, 1.14942, colors["grey"], sphere));
        }

        return layers;
    }

    this.drawSingle = function(MV, prog, scale) {
        MV.pushMatrix();
        MV.scale(scale);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);

        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        for(var i = -1.15; i < 2; i += 2.3) {
            for(var j = -1.15; j < 2; j += 2.3) {
                for(var k = -1.15; k < 2; k += 2.3) {
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

    this.name = "Body-Centered Cubic";
    this.scale = 0.87;
    var layers = null;
}

export {BodyCentered};
