import {vec3} from '../gl-matrix';
import {NaClLayer} from './NaClLayer.js';
import {UnitCell, UnitCellPos} from './unitCell.js';

function SodiumChloride(eighth, half, sphere, colors) {

    this.prototype = new UnitCell(eighth, half, sphere, colors);

    //only need to render a 3 by 3 area
    //reduces lag - this cell is more complex
    this.inDrawDist = function(bounds) {
        return bounds[0] != UnitCellPos.MIN && bounds[0] != UnitCellPos.MAX &&
               bounds[1] != UnitCellPos.MIN && bounds[1] != UnitCellPos.MAX &&
               bounds[2] != UnitCellPos.MIN && bounds[2] != UnitCellPos.MAX;
    }

    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx, color) {
        if(this.inDrawDist(bounds)) {
            this.drawUnit(MV, prog, pos, alpha, center, bounds, ndx, color);
        }
    }

    this.drawUnit = function(MV, prog, pos, alpha, center, bounds, ndx, color) {

        if(center && alpha < 1) {
            gl.uniform1f(prog.getHandle("alpha"), 1.0);
        }
        MV.pushMatrix();
        MV.translate(pos);

        //cell generation code makes a 2 by 2 by 2 cell
        //need a 1 by 1 by 1 cell
        MV.scale(.51);

        //draw:---
        this.drawClAtom(MV, prog, center, alpha, color);

        if(bounds[0] != UnitCellPos.ONEB4MIN) {
            //draw: L--
            this.drawNaHalf(MV, prog, true, false, false, false, false, center, alpha, color);

            if(bounds[1] != UnitCellPos.ONEB4MIN) {
                //draw: LB-, -B-
                this.drawClFourth(MV, prog, 270, false, 270, center, alpha, color);
                this.drawNaHalf(MV, prog, false, true, true, false, false, center, alpha, color);

                if(bounds[2] != UnitCellPos.ONEB4MIN) {
                    //draw: LBF, L-F, -BF, --F
                    this.drawClFourth(MV, prog, 180, true, 0, center, alpha, color);
                    this.drawClFourth(MV, prog, 270, true, 0, center, alpha, color);
                    this.drawNaHalf(MV, prog, false, false, true, true, true, center, alpha, color);
                    this.drawNaEighth(MV, prog, 90, false, center, alpha, color);
                }
                if(bounds[2] != UnitCellPos.ONEB4MAX) {
                    //draw: LBK, L-K, -BK, --K
                    this.drawClFourth(MV, prog, 180, false, 0, center, alpha, color);
                    this.drawClFourth(MV, prog, 270, false, 0, center, alpha, color);
                    this.drawNaHalf(MV, prog, false, false, false, true, false, center, alpha, color);
                    this.drawNaEighth(MV, prog, 180, false, center, alpha, color);
                }
            }
            if(bounds[1] != UnitCellPos.ONEB4MAX) {
                //draw: LT-, -T-
                this.drawClFourth(MV, prog, 90, false, 270, center, alpha, color);
                this.drawNaHalf(MV, prog, false, true, false, false, false, center, alpha, color);

                if(bounds[2] != UnitCellPos.ONEB4MIN) {
                    //draw: L-F, LTF, --F, -TF
                    this.drawNaHalf(MV, prog, false, false, true, true, true, center, alpha, color);
                    this.drawClFourth(MV, prog, 90, true, 0, center, alpha, color);
                    this.drawClFourth(MV, prog, 180, true, 0, center, alpha, color);
                    this.drawNaEighth(MV, prog, 180, true, center, alpha, color);

                }
                if(bounds[2] != UnitCellPos.ONEB4MAX) {
                    //draw: L-K, LTK, --K, -TK
                    this.drawNaHalf(MV, prog, false, false, false, true, false, center, alpha, color);
                    this.drawClFourth(MV, prog, 90, false, 0, center, alpha, color);
                    this.drawClFourth(MV, prog, 180, false, 0, center, alpha, color);
                    this.drawNaEighth(MV, prog, 90, true, center, alpha, color);

                }
            }
        }

        if(bounds[0] != UnitCellPos.ONEB4MAX) {
            //draw: R--
            this.drawNaHalf(MV, prog, false, false, false, false, false, center, alpha, color);

            if(bounds[1] != UnitCellPos.ONEB4MIN) {
                //draw: -B-, RB-
                this.drawNaHalf(MV, prog, false, true, true, false, false, center, alpha, color);
                this.drawClFourth(MV, prog, 270, false, 90, center, alpha, color);

                if(bounds[2] != UnitCellPos.ONEB4MIN) {
                    //draw: -BF, --F, RBF, R-F
                    this.drawNaHalf(MV, prog, false, false, true, true, true, center, alpha, color);
                    this.drawClFourth(MV, prog, 270, true, 0, center, alpha, color);
                    this.drawClFourth(MV, prog, 0, true, 0, center, alpha, color);
                    this.drawNaEighth(MV, prog, 0, false, center, alpha, color);

                }
                if(bounds[2] != UnitCellPos.ONEB4MAX) {
                    //draw: -BK, --K, RBK, R-K
                    this.drawNaHalf(MV, prog, false, false, false, true, false, center, alpha, color);
                    this.drawClFourth(MV, prog, 270, false, 0, center, alpha, color);
                    this.drawClFourth(MV, prog, 0, false, 0, center, alpha, color);
                    this.drawNaEighth(MV, prog, 270, false, center, alpha, color);

                }
            }
            if(bounds[1] != UnitCellPos.ONEB4MAX) {
                //draw: -T-, RT-
                this.drawNaHalf(MV, prog, false, true, false, false, false, center, alpha, color);
                this.drawClFourth(MV, prog, 90, false, 90, center, alpha, color);

                if(bounds[2] != UnitCellPos.ONEB4MIN) {
                    //draw: --F, -TF, R-F, RTF
                    this.drawNaHalf(MV, prog, false, false, true, true, true, center, alpha, color);
                    this.drawClFourth(MV, prog, 90, true, 0, center, alpha, color);
                    this.drawClFourth(MV, prog, 0, true, 0, center, alpha, color);
                    this.drawNaEighth(MV, prog, 270, true, center, alpha, color);

                }
                if(bounds[2] != UnitCellPos.ONEB4MAX) {
                    //draw: --K, -TK, R-K, RTK
                    this.drawNaHalf(MV, prog, false, false, false, true, false, center, alpha, color);
                    this.drawClFourth(MV, prog, 90, false, 0, center, alpha, color);
                    this.drawClFourth(MV, prog, 0, false, 0, center, alpha, color);
                    this.drawNaEighth(MV, prog, 0, true, center, alpha, color);
                }
            }
        }

        MV.popMatrix();
        gl.uniform1f(prog.getHandle("alpha"), alpha); //reset alpha
    };

    this.drawClFourth = function(MV, prog, rot, flipX, rotY, center, alpha, color) {

        if(color != 1) {
            if(alpha < 1 && !center) {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
            } else {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
            }

            MV.pushMatrix();
            MV.rotate(rotY, vec3.fromValues(0, 1, 0));
            MV.rotate(rot, vec3.fromValues(0, 0, 1));
            if(flipX) {
                MV.rotate(180, vec3.fromValues(1, 0, 0));
            }
            MV.pushMatrix();

            MV.translate(vec3.fromValues(2, 0, 2));
            MV.rotate(-90, vec3.fromValues(0, 1, 0));
            MV.scale(1.3);
            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
            eighth.draw(prog);
            MV.popMatrix();

            MV.pushMatrix();
            MV.translate(vec3.fromValues(2, 0, 2));
            MV.rotate(-90, vec3.fromValues(1, 0, 0));
            MV.rotate(-90, vec3.fromValues(0, 1, 0));
            MV.scale(1.3);
            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
            eighth.draw(prog);
            MV.popMatrix();
            MV.popMatrix();
        }

    }

    this.drawNaEighth = function(MV, prog, rot, flipY, center, alpha, color) {

        if(color != 2) {
            if(alpha < 1 && !center) {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
            } else {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);
            }

            MV.pushMatrix();

            if (flipY) {
                MV.rotate(180, vec3.fromValues(1, 0, 0));
            }
            MV.rotate(rot, vec3.fromValues(0, 1, 0));
            MV.translate(vec3.fromValues(2, -2, -2));
            MV.scale(.7);

            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
            eighth.draw(prog);
            MV.popMatrix();
        }
    }

    this.drawClAtom = function(MV, prog, center, alpha, color) {

        if(color != 1) {
            if(alpha < 1 && !center) {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
            } else {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["forestGreen"]);
            }

            MV.pushMatrix();
            MV.scale(1.3);
            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
            sphere.draw(prog);
            MV.popMatrix();
        }
    }

    //pass param for which face to orient on
    //as well as another param that reflects it
    this.drawNaHalf = function(MV, prog, flipX, onY, flipY, onZ, flipZ, center, alpha, color) {
        if(color != 2) {
            if(alpha < 1 && !center) {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
            } else {
                gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);
            }

            MV.pushMatrix();

            if(flipX) {
                MV.rotate(180, vec3.fromValues(0, 1, 0));
            }
            if(onY) {
                if(flipY) {
                    MV.rotate(180, vec3.fromValues(1, 0, 0));
                }
                MV.rotate(90, vec3.fromValues(0, 0, 1));
            }
            if(onZ) {
                if(flipZ) {
                    MV.rotate(180, vec3.fromValues(0, 1, 0));
                }
                MV.rotate(-90, vec3.fromValues(0, 1, 0));
            }
            MV.translate(vec3.fromValues(1.3, 0, 0));
            MV.rotate(180, vec3.fromValues(0, 1, 0));
            MV.scale(.7);

            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
            half.draw(prog);
            MV.popMatrix();
        }
    }

    //generates just one cell
    //not called, just here in case I need it
    this.drawCell = function(MV, prog) {
        //corner Cl atoms
        this.drawNaEighth(MV, prog, 0, false);
        this.drawNaEighth(MV, prog, 90, false);
        this.drawNaEighth(MV, prog, 180, false);
        this.drawNaEighth(MV, prog, 270, false);
        this.drawNaEighth(MV, prog, 0, true);
        this.drawNaEighth(MV, prog, 90, true);
        this.drawNaEighth(MV, prog, 180, true);
        this.drawNaEighth(MV, prog, 270, true);

        //Cl faces
        this.drawNaHalf(MV, prog, false, false, false, false, false);
        this.drawNaHalf(MV, prog, true, false, false, false, false);
        this.drawNaHalf(MV, prog, false, true, false, false, false);
        this.drawNaHalf(MV, prog, false, false, false, true, false);
        this.drawNaHalf(MV, prog, false, false, true, true, true);
        this.drawNaHalf(MV, prog, false, true, true, false, false);

        //Na quarters
        this.drawClFourth(MV, prog, 0, false, 0);
        this.drawClFourth(MV, prog, 90, false, 0);
        this.drawClFourth(MV, prog, 90, false, 90);
        this.drawClFourth(MV, prog, 90, false, 270);
        this.drawClFourth(MV, prog, 180, false, 0);
        this.drawClFourth(MV, prog, 270, false, 0);
        this.drawClFourth(MV, prog, 270, false, 90);
        this.drawClFourth(MV, prog, 270, false, 270);
        this.drawClFourth(MV, prog, 0, true, 0);
        this.drawClFourth(MV, prog, 90, true, 0);
        this.drawClFourth(MV, prog, 180, true, 0);
        this.drawClFourth(MV, prog, 270, true, 0);

        //center Cl atom
        this.drawClAtom(MV, prog);
    }

    this.drawCoord = function(MV, prog, scale) {
        MV.pushMatrix();
        MV.scale(scale);

        // draw left coordination view (chlorine centered)
        MV.pushMatrix();
        MV.translate(vec3.fromValues(-4, 0, 0));

        // draw center chlorine
        MV.pushMatrix();
        MV.scale(1.3);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();

        // draw surrounding sodiums
        MV.pushMatrix();
        MV.scale(.7);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);

        for(var i = 0; i < 3; i++) {
            for(var j = -2.8; j < 5; j += 5.6) {
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

        MV.popMatrix();

        // draw right coordination (sodium centered)
        MV.pushMatrix();
        MV.translate(vec3.fromValues(4, 0, 0));

        // draw center sodium
        MV.pushMatrix();
        MV.scale(.7);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();

        // draw surrounding chlorines
        MV.pushMatrix();
        MV.scale(1.3);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);

        for(var i = 0; i < 3; i++) {
            for(var j = -1.5; j < 4; j += 3) {
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

        MV.popMatrix();

        MV.popMatrix();
    }

    this.getCellLayers = function() {
        if(layers == null) {
            layers = new Array();
            layers.push(new NaClLayer(5, 5, -4, 1.0, 1.0, colors["green"], 1.3, colors["purple"], .7, sphere));
            layers.push(new NaClLayer(5, 5, -2, 1.0, 1.0, colors["purple"], .7, colors["green"], 1.3, sphere));
            layers.push(new NaClLayer(5, 5, 0, 1.0, 1.0, colors["green"], 1.3, colors["purple"], .7, sphere));
            layers.push(new NaClLayer(5, 5, 2, 1.0, 1.0, colors["purple"], .7, colors["green"], 1.3, sphere));
            layers.push(new NaClLayer(5, 5, 4, 1.0, 1.0, colors["green"], 1.3, colors["purple"], .7, sphere));
        }

        return layers;
    }

    this.drawSingle = function(MV, prog, scale) {
        MV.pushMatrix();
        MV.scale(scale);
        for(var i = -2; i < 4; i += 2) {
            for(var j = -2; j < 4; j += 2) {
                for(var k = -2; k < 4; k += 2) {
                    MV.pushMatrix();
                    MV.translate(vec3.fromValues(i, j, k));
                    if((i != 0 && j != 0 && k != 0) || (i == 0 && j == 0 && k != 0)
                        || (i == 0 && j != 0 && k == 0) || (i != 0 && j == 0 && k == 0)) {

                        gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);
                        MV.scale(.7);
                    }
                    else {
                        if(i == 0 && j == 0 && k == 0) {
                            gl.uniform3fv(prog.getHandle("kdFront"), colors["forestGreen"]);
                        }
                        else {
                            gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
                        }
                        MV.scale(1.3);
                    }
                    gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                    sphere.draw(prog);
                    MV.popMatrix();
                }
            }
        }
        MV.popMatrix();
    }

    this.name = "Sodium Chloride";
    var layers = null;
}

export {SodiumChloride};
