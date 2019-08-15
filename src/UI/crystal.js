var CrystalType = {SIMPLE : 0, BODY : 1, FACE : 2 , NaCl : 3, CaF2: 4, LEGEND : 5, HCP : 6};

function Crystal(type, eighth, sixth, half, sphere, colors) {

    this.init = function() {
        this.initCellPositions();
        
        switch (type) {
            
            case CrystalType.SIMPLE :
                unit = new SimpleCubic(eighth, half, sphere, colors);
            break;

            case CrystalType.BODY :
                unit = new BodyCentered(eighth, half, sphere, colors);
            break;

            case CrystalType.FACE :
                unit = new FaceCentered(eighth, half, sphere, colors);
            break;
            
            case CrystalType.NaCl :
                unit = new SodiumChloride(eighth, half, sphere, colors);
            break;
            
            case CrystalType.CaF2:
                unit = new CalciumFluoride(eighth, half, sphere, colors);
            break;
            
            case CrystalType.LEGEND:
                unit = new Legend(sphere, colors);
            break;
            
            case CrystalType.HCP:
                unit = new HCP(eighth, sixth, half, sphere, colors);
            break;
        }
        
        layers = unit.getCellLayers(color);
    };
    
    this.getName = function() {
        return unit.name;
    };


    this.draw = function(MV, prog) {
        if (inspecting) {
            this.drawInspect(MV, prog);
        } else if(dispCoord) {
            this.drawCoordView(MV, prog);
        }
        // legend has no layering animation for obvious reasons
        else if (layersDraw && type != CrystalType.LEGEND) {
            this.drawLayers(MV, prog);
        }
        else if(drawSingle && type != CrystalType.LEGEND) {
            this.drawSingle(MV, prog);
        } 
        else {
            this.drawCells(MV, prog);
        }
        
        return this.getName();
    };
    
    this.expand = function() {
        if (inspecting && inspctExp < 0.6) {
            inspctExp += .2; 
        } else if (expansion < 4.0) {
                expansion += .2; 
        }
    };
    
    this.contract = function() {
        if (inspecting &&inspctExp > 0.2) {
            inspctExp -= .2; 
        }
        else if (expansion > 1.0) {
            expansion -= .2; 
        }
    };
    
    this.activateTranslucency = function() {
        // legend has no translucency view
        if(type != CrystalType.LEGEND) {
            translucent = true;
            layersDraw = false;
            inspecting = false;
            dispCoord = false;
            drawSingle = false;
        }
    };
    
    this.activateInspection = function() {
        // legend has no inspection view
        if(type != CrystalType.LEGEND) {
            inspctExp = 0.0;
            inspecting = true;
            translucent = false;
            layersDraw = false;
            dispCoord = false;
            drawSingle = false;
        }
    };
    
    this.activateCoordView = function() {
        // legend has no coordination view
        if(type != CrystalType.LEGEND) {
            dispCoord = true;
            translucent = false;
            layersDraw = false;
            inspecting = false;
            drawSingle = false;
        }
    };
    
    this.activateSingle = function() {
        if(type != CrystalType.LEGEND) {
            dispCoord = false;
            translucent = false;
            layersDraw = false;
            inspecting = false;
            drawSingle = true;
        }
    }
    
    this.setDrawLayers = function() {
        this.toggleLayers();
        layersDraw = true;
    };

    this.toggleLayers = function() {
        // legend has no layers to toggle on/off
         if (type != CrystalType.LEGEND) {
             dispCoord = false;
             translucent = false;
             inspecting = false;
             drawSingle = false;
             layersDraw = !layersDraw;
             
             for (var i = 0; i < layers.length; i++) {
                 layers[i].reset();
             }
             
             expansion = 1.0;
             inspctExp = 1.0;
         }
    };
    
    var Cell = function(bounds, pos, ndx) {
        
        this.distance = 0.0;
        this.bounds = bounds;
        this.pos = pos;
        this.ndx = ndx;
    };

    this.drawCells = function(MV, prog) {

        this.sortCells(MV.top());
        
        if (translucent) {
            alpha = .25;
        } else {
            alpha = 1.0;
        }

        gl.uniform1f(prog.getHandle("alpha"), alpha);
        
        MV.pushMatrix();
        MV.scale(scale);
        
        //this is one unit cell (ie what shows up when translucency is toggled)
        unit.draw(MV, prog, vec3.fromValues(0,0,0), alpha, true, vec3.fromValues(2,2,2), vec3.fromValues(2,2,2), Scene.color); 
        
        //used for expanding/contracting
        for (var i = 0; i < cells.length; i++) {
            var v = vec3.fromValues(cells[i].pos[0], cells[i].pos[1], cells[i].pos[2]);
            // Vector for cell positioning
            var bounds = cells[i].bounds;

            //console.log(bounds);
            var ndx = cells[i].ndx;
            vec3.scale(v, v, expansion); // Adjust cell positioning by any expansion
          
            //this is the whole model as it appears on the screen
            unit.draw(MV, prog, v, alpha, false, bounds, ndx, Scene.color);
        }
        
        MV.popMatrix();
    };
    
    this.drawLayers = function(MV, prog) {

        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        MV.pushMatrix();
        MV.scale(scale);
        
        if (type == CrystalType.BODY) {
            MV.scale(0.87);
        } else if (type == CrystalType.FACE) {
            MV.scale(0.71);
        } else if (type == CrystalType.NaCl) {
            MV.scale(.51);
        } else if(type == CrystalType.CaF2) {
            MV.scale(.44);
        }

        for (var i = 0; i < layers.length; i++) {

            layers[i].draw(MV, prog);
            
            // If layer still has more to fall, drop layer further and exit loop
            if (!layers[i].isAtRest()) {
                layers[i].update();
                break;
            }
            
            //if current layer is at rest, flip the next layer
            //only for NaCl
            //may be a better way to do this logistically
            if(type == CrystalType.NaCl && layers[i].isAtRest() && i < layers.length - 1
                    && layers[i + 1].notCalledFlip() && i % 2 == 0) {
                layers[i + 1].flip();
            }

            // If last layer has fallen and settled, switch to other model for expand/contract effects
            if (layers[i] == layers[layers.length - 1] && layers[i].isAtRest()) {
                this.toggleLayers();
            }
        }
        
        MV.popMatrix();
    };

    this.drawInspect = function(MV, prog) {
        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        unit.drawInspect(MV, prog, scale, inspctExp);
    };
    
    this.drawSingle = function(MV, prog) {
        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        unit.drawSingle(MV, prog, scale);
    }

    this.initCellPositions = function() {

        var midi = cols/2;
        var midj = rows/2;
        var midk = height/2;

        // Offset
        var o = vec3.fromValues(-(cols-1), -(height-1), -(rows-1));

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                for (var k = 0; k < height; k++) {
                    if (i != midi || j != midj || k != midk) {
                        
                        var x = UnitCellPos.MIDDLE;
                        var y = UnitCellPos.MIDDLE;
                        var z = UnitCellPos.MIDDLE;

                        if (i == 0) { x = UnitCellPos.MIN; }
                        if (i == rows-1) { x = UnitCellPos.MAX; }
                        if (i == rows-2) { x = UnitCellPos.ONEB4MAX; }
                        if (i == 1) { x = UnitCellPos.ONEB4MIN; }
                        
                        if (j == 0) { y = UnitCellPos.MIN; }
                        if (j == cols-1) { y = UnitCellPos.MAX; }
                        if (j == cols-2) { y = UnitCellPos.ONEB4MAX; }
                        if (j == 1) { y = UnitCellPos.ONEB4MIN; }


                        if (k == 0) { z = UnitCellPos.MIN; }
                        if (k == height-1) { z = UnitCellPos.MAX; }
                        if (k == height-2) { z = UnitCellPos.ONEB4MAX; }
                        if (k == 1) { z = UnitCellPos.ONEB4MIN; }

                        var bounds = vec3.fromValues(y, z, x);
                        var pos = vec4.fromValues(o[0] + j*2, o[1] + k*2, o[2] + i*2 , 1);
                        var ndx = vec3.fromValues(i, j, k);

                        var c = new Cell(bounds, pos, ndx);

                        cells.push(c);
                    }
                }
            }
        }
    };
    
    this.calcCellDistance = function(m, v) {
        
        var v2 = vec3.create();
        
        v2[0] = m[0]*v[0] + m[4]*v[1] + m[8]*v[2] + m[12]*v[3];
        v2[1] = m[1]*v[0] + m[5]*v[1] + m[9]*v[2] + m[13]*v[3];
        v2[2] = m[2]*v[0] + m[6]*v[1] + m[10]*v[2] + m[14]*v[3];
 
        
        return v2[0]*v2[0] + v2[1]*v2[1] + v2[2]*v2[2];
    };
    
    this.sortCells = function(viewMatrix) {
        
        // Calculate distance of each cell to the camera
        for (var i = 0; i < cells.length; i++) {
            cells[i].distance = this.calcCellDistance(viewMatrix, cells[i].pos);
        }
        
        // Sort cells in descending order by their distance
        cells.sort(this.sortAlg);                //TODO
    };
    
    this.sortAlg = function(a, b) {
        return b.distance - a.distance; // Might have to switch !!!!!!!!!!!!
    };
    
    this.drawEighth = function(MV, prog, rot, translate) {  
        MV.pushMatrix();
        MV.rotate(rot, vec3.fromValues(0.0, 1.0, 0.0));
        MV.scale(scale);
        MV.translate(translate);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);
        
        MV.popMatrix();
    };
    
    this.drawHalf = function(MV, prog, rot, translate) {
        MV.pushMatrix();
        MV.scale(scale);
        MV.rotate(rot, vec3.fromValues(0, 1, 0));
        MV.translate(translate);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        half.draw(prog);
        
        MV.popMatrix();
    };
    
    this.drawCoordView = function(MV, prog) {
        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        unit.drawCoord(MV, prog, scale);
    }
    
    this.goToLattice = function() {
        if(type != CrystalType.LEGEND) {
            dispCoord = false;
            translucent = false;
            inspecting = false;
        }
    }
    
    var type = type;
    var rows = 5;
    var cols = 5;
    var height = 5;
    var scale = .1;
    var expansion = 1.0;
    var inspctExp = 0;
    var translucent = false;
    var layersDraw = true;
    var inspecting = false;
    var dispCoord = false;
    var drawSingle = false;
    var unit;
    var eighth = eighth;
    var half = half;
    var sphere = sphere;
    var colors = colors;
    var cells = new Array();
    var layers;
}
