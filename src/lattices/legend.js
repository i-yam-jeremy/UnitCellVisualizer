//the legend screen
//pretends it's a crystal too
import {vec3} from '../gl-matrix';

function Legend(sphere, colors) {
    this.getCellLayers = function() {
        //legend has no layering
    }

    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx, splitAmt) {
        //todo
        MV.pushMatrix();
        MV.translate(vec3.fromValues(0, 0, 0));
        this.drawCa(MV, prog);
        this.drawF(MV, prog);
        this.drawNa(MV, prog);
        this.drawCl(MV, prog);
        MV.popMatrix();
    };

    this.drawCa = function(MV, prog) {
        MV.pushMatrix();
        MV.translate(vec3.fromValues(0, 8, 0));
        MV.scale(.8);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["white"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();
    };

    this.drawF = function(MV, prog) {
        MV.pushMatrix();
        MV.translate(vec3.fromValues(0, 3, 0));
        MV.scale(1.2);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["orange"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();
    };

    this.drawNa = function(MV, prog) {
        MV.pushMatrix();
        MV.translate(vec3.fromValues(0, -3, 0));
        MV.scale(.7);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();
    };

    this.drawCl = function(MV, prog) {
        MV.pushMatrix();
        MV.translate(vec3.fromValues(0, -8, 0));
        MV.scale(1.3);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();
    };

    this.sphere = sphere;
    this.colors = colors;
    this.name = "Legend";
}

export {Legend};
