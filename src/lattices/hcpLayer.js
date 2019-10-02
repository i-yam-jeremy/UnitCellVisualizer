function HCPLayer(rows, restHeight, xexpansion, zexpansion, color, sphere) {

    this.reset = function() {
        curHeight = startHeight;
        atRest = false;
    };

    this.update = function() {
        if (curHeight - speed > restHeight) {
            curHeight -= speed;
        } else {
            curHeight = restHeight;
            atRest = true;
        }
    };

    this.draw = function(MV, prog) {

        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        gl.uniform3fv(prog.getHandle("kdFront"), color);

        const middleRow = (rows-1)/2;

        for (var i = 0; i < rows; i++) {
            const distFromMidRow = Math.abs(i-middleRow);
            const rowLength = rows - distFromMidRow;
            for (var j = 0; j < rowLength; j++) {
                const rowOffset = distFromMidRow*xexpansion;

                var pos = vec3.fromValues(offset[0] + j*2*xexpansion + rowOffset, curHeight*xexpansion, offset[2] + i*2*zexpansion);

                MV.pushMatrix();
                MV.translate(pos);
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
        }

    };

    this.isAtRest = function() { return atRest; };

    var rows = rows;
    var startHeight = 7.0;
    var restHeight = restHeight;
    var xexpansion = xexpansion;
    var zexpansion = zexpansion;
    var curHeight = 7.0;
    var speed = .05;
    var atRest = false;
    var color = color;
    var offset = vec3.fromValues(-(rows-1)*xexpansion, restHeight,-(rows-1)*zexpansion);
    var sphere = sphere;
}
