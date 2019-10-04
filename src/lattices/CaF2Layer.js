import {vec3} from '../gl-matrix';

//Calcium fluoride cell layering
function CaF2Layer(rows, cols, restHeight, xexpansion, zexpansion, sphere, atom, even, color) {

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

        if(atom == "F") {

            for(var i = 0; i < rows; i++) {
                for(var j = 0; j < cols; j++) {

                    //draw a square of atoms at each index
                    var pos = vec3.fromValues(offset[0] + j*2*xexpansion, curHeight*xexpansion, offset[2] + i*2*zexpansion);
                    MV.pushMatrix();
                    MV.translate(pos);

                    for(var m = -1.25; m < 2; m += 2.5) {
                        for(var n = -1.25; n < 2; n += 2.5) {
                            MV.pushMatrix();
                            MV.translate(vec3.fromValues(m, 0, n));
                            MV.scale(1.2);
                            gl.uniform3fv(prog.getHandle("kdFront"), color);
                            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                            sphere.draw(prog);
                            MV.popMatrix();
                        }
                    }

                    MV.popMatrix();
                }
            }

        } else if (atom == "Ca") {

            for(var i = 0; i < rows; i++) {
                for(var j = 0; j < cols; j++) {
                    var modVal = (even ? 0 : 1);

                    //different layers decide whether even atoms are rendered or odd atoms
                    if((i + j) % 2 == modVal) {

                        var pos = vec3.fromValues(offset[0] + j*2*xexpansion, curHeight*xexpansion, offset[2] + i*2*zexpansion);
                        MV.pushMatrix();
                        MV.translate(pos);
                        MV.scale(.8);
                        gl.uniform3fv(prog.getHandle("kdFront"), color);
                        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                        sphere.draw(prog);
                        MV.popMatrix();
                    }
                }
            }

        } else {
            console.log("No layering exists for that atom");
        }

    };

    this.isAtRest = function() { return atRest; };

    var rows = rows;
    var cols = cols;
    var startHeight = 10.0;
    var restHeight = restHeight;
    var xexpansion = xexpansion;
    var zexpansion = zexpansion;
    var curHeight = 10.0;
    var speed = .1;
    var atRest = false;
    var color = color;
    var offset = vec3.fromValues(-(cols-1)*xexpansion, restHeight,-(rows-1)*zexpansion);
    var sphere = sphere;
    var flip = false;
    var calledFlip = false;
    var color1 = color1;
    var color2 = color2;
    var size1 = size1;
    var size2 = size2;
    var countTimes = 0;
}

export {CaF2Layer};
