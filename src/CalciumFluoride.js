function CalciumFluoride(eighth, half, sphere, colors) {
    
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
        MV.scale(.44);
        
        //draw:---
        this.drawFCluster(MV, prog, center, alpha);
        
        if(bounds[0] != UnitCellPos.ONEB4MIN) {
            //draw: L--
            this.drawCaHalf(MV, prog, true, false, false, false, false, center, alpha);
            
            if(bounds[1] != UnitCellPos.ONEB4MIN) {
                //draw: LB-, -B-
                this.drawCaHalf(MV, prog, false, true, true, false, false, center, alpha);
                
                if(bounds[2] != UnitCellPos.ONEB4MIN) {
                    //draw: LBF, L-F, -BF, --F
                    this.drawCaHalf(MV, prog, false, false, true, true, true, center, alpha);
                    this.drawCaEighth(MV, prog, 90, false);
                }
                if(bounds[2] != UnitCellPos.ONEB4MAX) {
                    //draw: LBK, L-K, -BK, --K
                    this.drawCaHalf(MV, prog, false, false, false, true, false, center, alpha);
                    this.drawCaEighth(MV, prog, 180, false);
                }
            }
            if(bounds[1] != UnitCellPos.ONEB4MAX) {
                //draw: LT-, -T-
                this.drawCaHalf(MV, prog, false, true, false, false, false, center, alpha);
                
                if(bounds[2] != UnitCellPos.ONEB4MIN) {
                    //draw: L-F, LTF, --F, -TF
                    this.drawCaHalf(MV, prog, false, false, true, true, true, center, alpha);
                    this.drawCaEighth(MV, prog, 180, true, center, alpha);
                    
                }
                if(bounds[2] != UnitCellPos.ONEB4MAX) {
                    //draw: L-K, LTK, --K, -TK
                    this.drawCaHalf(MV, prog, false, false, false, true, false, center, alpha);
                    this.drawCaEighth(MV, prog, 90, true, center, alpha);
                    
                }
            }
        }
        
        if(bounds[0] != UnitCellPos.ONEB4MAX) {
            //draw: R--
            this.drawCaHalf(MV, prog, false, false, false, false, false, center, alpha);
            
            if(bounds[1] != UnitCellPos.ONEB4MIN) {
                //draw: -B-, RB-
                this.drawCaHalf(MV, prog, false, true, true, false, false, center, alpha);
                
                if(bounds[2] != UnitCellPos.ONEB4MIN) {
                    //draw: -BF, --F, RBF, R-F
                    this.drawCaHalf(MV, prog, false, false, true, true, true, center, alpha);
                    this.drawCaEighth(MV, prog, 0, false, center, alpha);
                    
                }
                if(bounds[2] != UnitCellPos.ONEB4MAX) {
                    //draw: -BK, --K, RBK, R-K
                    this.drawCaHalf(MV, prog, false, false, false, true, false, center, alpha);
                    this.drawCaEighth(MV, prog, 270, false, center, alpha);
                    
                }
            }
            if(bounds[1] != UnitCellPos.ONEB4MAX) {
                //draw: -T-, RT-
                this.drawCaHalf(MV, prog, false, true, false, false, false, center, alpha);
                
                if(bounds[2] != UnitCellPos.ONEB4MIN) {
                    //draw: --F, -TF, R-F, RTF
                    this.drawCaHalf(MV, prog, false, false, true, true, true, center, alpha);
                    this.drawCaEighth(MV, prog, 270, true, center, alpha);
                    
                }
                if(bounds[2] != UnitCellPos.ONEB4MAX) {
                    //draw: --K, -TK, R-K, RTK
                    this.drawCaHalf(MV, prog, false, false, false, true, false, center, alpha);
                    this.drawCaEighth(MV, prog, 0, true, center, alpha);
                }
            }
        }
    
        MV.popMatrix();

        gl.uniform1f(prog.getHandle("alpha"), alpha); // Make sure alpha is same as it was 
    };
    
    //used for testing
    //draws one unit cell
    this.drawCell = function(MV, prog) {
        //draw F cluster
        this.drawFCluster(MV, prog);
        
        //draw the 8 Ca corners
        this.drawCaEighth(MV, prog, 0, false);
        this.drawCaEighth(MV, prog, 90, false);
        this.drawCaEighth(MV, prog, 180, false);
        this.drawCaEighth(MV, prog, 270, false);
        this.drawCaEighth(MV, prog, 0, true);
        this.drawCaEighth(MV, prog, 90, true);
        this.drawCaEighth(MV, prog, 180, true);
        this.drawCaEighth(MV, prog, 270, true);
        
        //draw the 6 Ca faces
        this.drawCaHalf(MV, prog, false, false, false, false, false);
        this.drawCaHalf(MV, prog, true, false, false, false, false);
        this.drawCaHalf(MV, prog, false, true, false, false, false);
        this.drawCaHalf(MV, prog, false, false, false, true, false);
        this.drawCaHalf(MV, prog, false, false, true, true, true);
        this.drawCaHalf(MV, prog, false, true, true, false, false);
    }
    
    this.drawFCluster = function(MV, prog, center, alpha) {
        
        if(alpha < 1 && !center) {
            gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        } else {
            gl.uniform3fv(prog.getHandle("kdFront"), colors["orange"]);
        }
        
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
    }
    
    this.drawCaEighth = function(MV, prog, rot, flipY, center, alpha) {
        
        if(alpha < 1 && !center) {
            gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        } else {
            gl.uniform3fv(prog.getHandle("kdFront"), colors["white"]);
        }
        
        MV.pushMatrix();
        
        if (flipY) {
            MV.rotate(180, vec3.fromValues(1, 0, 0));
        }
        MV.rotate(rot, vec3.fromValues(0, 1, 0));
        MV.translate(vec3.fromValues(2.3, -2.3, -2.3));
        
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);
        MV.popMatrix();
    }
    
    this.drawCaHalf = function(MV, prog, flipX, onY, flipY, onZ, flipZ, center, alpha) {
        
        if(alpha < 1 && !center) {
            gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        } else {
            gl.uniform3fv(prog.getHandle("kdFront"), colors["white"]);
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
        
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        half.draw(prog);
        MV.popMatrix();
    }
    
    this.drawInspect = function(MV, prog, scale, inspctExp) {
        // todo - fix inspect view to use expansion
        MV.pushMatrix();
        MV.scale(.47);
        MV.scale(scale);
        
        for(var i = -6.5; i < 7; i += 4) {
        
            gl.uniform3fv(prog.getHandle("kdFront"), colors["white"]);
            MV.pushMatrix();
            MV.translate(vec3.fromValues(-4, i, 0));
            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
            sphere.draw(prog);
            MV.popMatrix();

            gl.uniform3fv(prog.getHandle("kdFront"), colors["orange"]);
            MV.pushMatrix();
            MV.translate(vec3.fromValues(0, i, 0));
            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
            sphere.draw(prog);
            MV.translate(vec3.fromValues(4, 0, 0));
            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
            sphere.draw(prog);
            MV.popMatrix();
        }
        
        MV.popMatrix();
    }
    
    this.drawCoord = function(MV, prog, scale) {
        
        MV.pushMatrix();
        MV.scale(scale);
        
        //draw left (calcium centered)
        MV.pushMatrix();
        MV.translate(vec3.fromValues(-4, 0, 0));
        gl.uniform3fv(prog.getHandle("kdFront"), colors["white"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["orange"]);
        
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
        
        //draw right (fluoride centered)
        MV.pushMatrix();
        MV.translate(vec3.fromValues(4, 0, 0));
        gl.uniform3fv(prog.getHandle("kdFront"), colors["orange"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["white"]);
        
        for(var i = -1.13; i < 2; i += 2.26) {
            for(var j = -1.13; j < 2; j += 2.26) {
                MV.pushMatrix();
                if(i > 0) {
                    MV.translate(vec3.fromValues(i, j, j));
                }
                else {
                    MV.translate(vec3.fromValues(i, j, -j));
                }
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
        }
        MV.popMatrix();
        
        MV.popMatrix();
    }
    
    this.getCellLayers = function() {
        if(layers == null) {
            layers = new Array();
            layers.push(new CaF2Layer(3, 3, -2.5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
            layers.push(new CaF2Layer(5, 5, -4.2, 1.15, 1.15, sphere, "Ca", false, colors["white"]));
            layers.push(new CaF2Layer(3, 3, -1.5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
            layers.push(new CaF2Layer(5, 5, -2.2, 1.15, 1.15, sphere, "Ca", true, colors["white"]));
            layers.push(new CaF2Layer(3, 3, -.5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
            layers.push(new CaF2Layer(5, 5, -.2, 1.15, 1.15, sphere, "Ca", false, colors["white"]));
            layers.push(new CaF2Layer(3, 3, .5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
            layers.push(new CaF2Layer(5, 5, 2.2, 1.15, 1.15, sphere, "Ca", true, colors["white"]));
            layers.push(new CaF2Layer(3, 3, 1.5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
            layers.push(new CaF2Layer(5, 5, 4.2, 1.15, 1.15, sphere, "Ca", false, colors["white"]));
            layers.push(new CaF2Layer(3, 3, 2.5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
        }
        
        return layers;
    }
    
    this.name = "Calcium Fluoride";
    var layers = null;
}
