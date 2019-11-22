import {vec3} from '../gl-matrix';
import {FaceCenteredLayer} from './faceCenteredLayer.js';
import {UnitCell, UnitCellPos} from './unitCell.js';

function FaceCentered(eighth, half, sphere, colors) {

    this.prototype = new UnitCell(eighth, half, sphere, colors);

    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx, color) {

        this.color = color;

        if (center && alpha < 1.0) {
            gl.uniform1f(prog.getHandle("alpha"), 1.0);
        }

        MV.pushMatrix();
        MV.translate(pos);

        var x = ndx[0];
        var y = ndx[1];
        var z = ndx[2];

        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 12, this.type.half));           // 12

        if (bounds[0] >= UnitCellPos.ONEB4MIN && bounds[0] <= UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.ONEB4MIN && bounds[1] < UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.ONEB4MIN && bounds[2] < UnitCellPos.MAX) {  // depth
            this.drawHalf(MV, prog, 0, vec3.fromValues(0, 1.0, 0));
        }


        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 9, this.type.half));            // 9
        if (bounds[0] >= UnitCellPos.ONEB4MIN && bounds[0] < UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.ONEB4MIN && bounds[1] < UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.MIN && bounds[2] < UnitCellPos.MAX) { // depth
            this.drawHalf(MV, prog, 90, vec3.fromValues(0, 1.0, 0));
        }

        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 14, this.type.half));           // 14
        if (bounds[0] >= UnitCellPos.MIN && bounds[0] < UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.ONEB4MIN && bounds[1] < UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.ONEB4MIN && bounds[2] < UnitCellPos.MAX) { // depth
            this.drawHalf(MV, prog, 180, vec3.fromValues(0, 1.0, 0));
        }

        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 10, this.type.half));          // 10
        if (bounds[0] >= UnitCellPos.ONEB4MIN && bounds[0] < UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.ONEB4MIN && bounds[1] < UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.ONEB4MIN && bounds[2] <= UnitCellPos.MAX) {
            this.drawHalf(MV, prog, 270, vec3.fromValues(0, 1.0, 0));
        }

        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 11, this.type.half));          // 11
        if (bounds[0] >= UnitCellPos.ONEB4MIN && bounds[0] < UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.MIN && bounds[1] < UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.ONEB4MIN && bounds[2] < UnitCellPos.MAX) {
            this.drawHalf(MV, prog, -90, vec3.fromValues(0, 0, 1.0));
        }

        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 13, this.type.half));          // 13
        if (bounds[0] >= UnitCellPos.ONEB4MIN && bounds[0] < UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.ONEB4MIN && bounds[1] <= UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.ONEB4MIN && bounds[2] < UnitCellPos.MAX) {
            this.drawHalf(MV, prog, 90, vec3.fromValues(0, 0, 1.0));
        }

        if (bounds[1] != UnitCellPos.MIN) {

            if (bounds[2] != UnitCellPos.MIN) {
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 8, this.type.eighth));  // 8
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 0); }
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 7, this.type.eighth));  // 7
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 90); }
            }

            if (bounds[2] != UnitCellPos.MAX) {
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 3, this.type.eighth)); // 3
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 180); }
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 4, this.type.eighth)); // 4
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 270); }
            }
        }

        if (bounds[1] != UnitCellPos.MAX) {
            MV.pushMatrix();
            MV.rotate(90.0, vec3.fromValues(1.0, 0.0, 0.0));
            if (bounds[2] != UnitCellPos.MIN) {
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 5, this.type.eighth)); // 5
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 0); }
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 6, this.type.eighth)); // 6
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 90); }
            }

            MV.rotate(180.0, vec3.fromValues(1.0, 0.0, 0.0));
            if (bounds[2] != UnitCellPos.MAX) {
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 2, this.type.eighth)); // 2
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 180); }
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 1, this.type.eighth)); // 1
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 270); }
            }
            MV.popMatrix();
        }

        MV.popMatrix();

        gl.uniform1f(prog.getHandle("alpha"), alpha); // Make sure alpha is same as it was
    }

    this.whichColor = function(center, alpha, x, y, z, id, shape) {

        if(this.color == 0) {
            if (shape === this.type.half) {
                if(!center && alpha < 1.0) {
                    return colors["grey"];
                }
                return colors["green"];
            }
            else if(shape === this.type.eighth) {
                return colors["grey"];
            }
        }

        else {
            return colors["grey"];
        }
    }

    this.drawEighth = function(MV, prog, rot) {
        MV.pushMatrix();

        MV.rotate(rot, vec3.fromValues(0.0, 1.0, 0.0));
        MV.translate(vec3.fromValues(1.0, -1.0, -1.0));
        MV.scale(this.scale);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);

        MV.popMatrix();
    };

    this.drawHalf = function(MV, prog, rot, axis) {

        MV.pushMatrix();
        MV.rotate(rot, axis);
        MV.translate(vec3.fromValues(-1.0 * (1 - this.scale),0,0));
        MV.scale(this.scale);
        MV.translate(vec3.fromValues(-.01, 0, 0));
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        half.draw(prog);
        MV.popMatrix();
    };

    this.drawCoord = function(MV, prog, scale) {
        MV.pushMatrix();
        MV.scale(scale);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);

        for(var i = -1.35; i < 2; i += 2.7) {
            for(var j = -1.35; j < 2; j += 2.7) {
                MV.pushMatrix();
                MV.translate(vec3.fromValues(0, i, j));
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
        }

        for(var i = -1.4; i < 2; i+= 2.8) {
            MV.pushMatrix();
            MV.translate(vec3.fromValues(i, 0, 0));

            for(var j = -1.4; j < 2; j += 2.8) {
                MV.pushMatrix();
                MV.translate(vec3.fromValues(0, 0, j));
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }

            for(var k = -1.4; k < 2; k += 2.8) {
                MV.pushMatrix();
                MV.translate(vec3.fromValues(0, k, 0));
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }

            MV.popMatrix();
        }

        MV.popMatrix();
    }

    this.getCellLayers = function() {
        if(layers == null) {
            var s = 2;
            layers = new Array();

            layers.push(new FaceCenteredLayer(7, 7, -6, .7, .7, sphere, true, colors["grey"], colors["green"]));
            layers.push(new FaceCenteredLayer(7, 7, -4, .7, .7, sphere, false, colors["green"], colors["green"]));
            layers.push(new FaceCenteredLayer(7, 7, -2, .7, .7, sphere, true, colors["grey"], colors["green"]));
            layers.push(new FaceCenteredLayer(7, 7, 0, .7, .7, sphere, false, colors["green"], colors["green"]));
            layers.push(new FaceCenteredLayer(7, 7, 2, .7, .7, sphere, true, colors["grey"], colors["green"]));
            layers.push(new FaceCenteredLayer(7, 7, 4, .7, .7, sphere, false, colors["green"], colors["green"]));
            layers.push(new FaceCenteredLayer(7, 7, 6, .7, .7, sphere, true, colors["grey"], colors["green"]));
        }

        return layers;
    }

    this.drawSingle = function(MV, prog, scale) {
        MV.pushMatrix();
        MV.scale(scale);

        // draw top & bottom
        for(var layer = 0; layer < 2; layer++) {
            MV.pushMatrix();
            if(layer == 0) {
                MV.translate(vec3.fromValues(0, -1.3, 0));
            }
            else {
                MV.translate(vec3.fromValues(0, 1.3, 0));
            }

            gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
            for(var i = -1.3; i < 2; i += 2.6) {
                for(var j = -1.3; j < 2; j += 2.6) {
                    MV.pushMatrix();
                    MV.translate(vec3.fromValues(i, 0, j));
                    gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                    sphere.draw(prog);
                    MV.popMatrix();
                }
            }
            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
            gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
            sphere.draw(prog);
            MV.popMatrix();
        }

        // draw middle
        gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
        for(var i = 0; i < 2; i ++) {
            for(var j = -1.3; j < 2; j += 2.6) {
                MV.pushMatrix();
                if(i == 0) {
                    MV.translate(vec3.fromValues(0, 0, j));
                }
                else {
                    MV.translate(vec3.fromValues(j, 0, 0));
                }
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
        }

        MV.popMatrix();
    }

    this.name = "Face-Centered Cubic";
    this.scale = 0.71;
    this.color = false;
    var layers = null;
    this.type = {eighth : 0, half: 1};
}

export {FaceCentered};
