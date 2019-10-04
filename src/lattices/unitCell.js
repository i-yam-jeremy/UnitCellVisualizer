var UnitCellPos = { MIN : 0, ONEB4MIN : 1, MIDDLE : 2, ONEB4MAX : 3, MAX : 4 };

function UnitCell(eighth, half, sphere, colors) {

    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx) {}; // ABSTRACT

    this.drawInspect = function(MV, prog, scale, inspctExp) {}; // ABSTRACT

    this.drawCoord = function(MV, prog, scale) {}; // ABSTRACT

    this.drawSingle = function(MV, prog, scale) {}; //ABSTRACT

    this.drawEighth = function(MV, prog, rot) {
        MV.pushMatrix();

        MV.rotate(rot, vec3.fromValues(0.0, 1.0, 0.0));
        MV.translate(vec3.fromValues(1.0, -1.0, -1.0));
        MV.scale(scale);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);

        MV.popMatrix();
    };

    this.drawHalf = function(MV, prog, rot, axis) {
        MV.pushMatrix();
        MV.rotate(rot, axis);
        MV.translate(vec3.fromValues(-1.0,0,0)*(1-scale));
        MV.scale(scale);
        MV.translate(vec3.fromValues(-.01, 0, 0));
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        half.draw(prog);

        MV.popMatrix();
    };

    var eighth = eighth;
    var half = half;
    var sphere = sphere;
    var colors = colors;
    var scale = 1.0;
}

export {UnitCell, UnitCellPos};
