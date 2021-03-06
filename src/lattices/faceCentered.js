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

        const planeNormal = vec3.fromValues(1,1,1);
        for (let i = 0; i < 14; i++) {
          const pointOnPlane = vec3.fromValues(i,0,0);
          const d = vec3.dot(planeNormal, pointOnPlane);
          if (Math.abs(vec3.dot(planeNormal, ndx) - d) < 0.0001) {
            this.layerOffset = i;
          }
        }

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
          if (!center && alpha < 1.0) return colors["grey"];
          // 1 is topmost layer
          const layerMap = [[1], [2,4,5,9,11,14], [3,6,8,10,12,13], [7]];
          let layerOffsetIndex;
          for (let i = 0; i < layerMap.length; i++) {
            if (layerMap[i].indexOf(id) != -1) {
              layerOffsetIndex = i;
              break;
            }
          }
          return layerColors[Math.abs(this.layerOffset-layerOffsetIndex)%3];

        return colors["grey"];
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

            const c = [colors["grey"], colors["red"], colors["blue"]];
            const totalLayerCount = 10;
            for (let i = 0; i < totalLayerCount; i++) {
              layers.push(new FaceCenteredLayer(sphere, totalLayerCount, i, c[i%3]));
            }
        }

        return layers;
    }

    this._drawSphere = function(MV, prog, pos, colorName) {
      gl.uniform3fv(prog.getHandle("kdFront"), colors[colorName]);
      MV.pushMatrix();
      MV.translate(pos);
      gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
      sphere.draw(prog);
      MV.popMatrix();

      gl.uniform1f(prog.getHandle("alpha"), 1.0);
    };

    this.drawSingle = function(MV, prog, scale) {
        MV.pushMatrix();
        MV.scale(scale);

        this._drawSphere(MV, prog, vec3.fromValues(-1.3, -1.3, -1.3), "grey");

        this._drawSphere(MV, prog, vec3.fromValues(-1.3, -1.3, 1.3), "red");
        this._drawSphere(MV, prog, vec3.fromValues(1.3, -1.3, -1.3), "red");
        this._drawSphere(MV, prog, vec3.fromValues(-1.3, 1.3, -1.3), "red");
        this._drawSphere(MV, prog, vec3.fromValues(0, 0, -1.3), "red");
        this._drawSphere(MV, prog, vec3.fromValues(-1.3, 0, 0), "red");
        this._drawSphere(MV, prog, vec3.fromValues(0, -1.3, 0), "red");

        this._drawSphere(MV, prog, vec3.fromValues(1.3, -1.3, 1.3), "blue");
        this._drawSphere(MV, prog, vec3.fromValues(-1.3, 1.3, 1.3), "blue");
        this._drawSphere(MV, prog, vec3.fromValues(1.3, 1.3, -1.3), "blue");
        this._drawSphere(MV, prog, vec3.fromValues(1.3, 0, 0), "blue");
        this._drawSphere(MV, prog, vec3.fromValues(0, 0, 1.3), "blue");
        this._drawSphere(MV, prog, vec3.fromValues(0, 1.3, 0), "blue");

        this._drawSphere(MV, prog, vec3.fromValues(1.3, 1.3, 1.3), "grey");
    }

    this.name = "Face-Centered Cubic";
    this.scale = 0.71;
    this.color = false;
    var layers = null;
    var layerColors = [colors["grey"], colors["red"], colors["blue"]];
    this.type = {eighth : 0, half: 1};
}

export {FaceCentered};
