function BodyCentered(eighth, half, sphere, colors, inspect) {

    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx, splitAmt) {
        if (center && alpha < 1.0) { 
            gl.uniform1f(prog.getHandle("alpha"), 1.0);
        } 

        if (center || alpha == 1.0) {
            gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
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
        //console.log('BCC inspect');
        //MV.pushMatrix();
        //MV.scale(scale);
        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        
        MV.pushMatrix();
        MV.translate(vec3.fromValues(-inspctExp/20 - 0.15, 0, 0));
        this.inspect.drawEighth(MV, prog, 0, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.inspect.drawEighth(MV, prog, 90, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.inspect.drawEighth(MV, prog, 180, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.inspect.drawEighth(MV, prog, 270, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.pushMatrix();
        MV.rotate(90.0, vec3.fromValues(1.0, 0.0, 0.0));
        this.inspect.drawEighth(MV, prog, 0, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.inspect.drawEighth(MV, prog, 90, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.rotate(180.0, vec3.fromValues(1.0, 0.0, 0.0));
        
        this.inspect.drawEighth(MV, prog, 180, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.inspect.drawEighth(MV, prog, 270, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.popMatrix();    
        MV.popMatrix();

        gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
        
        MV.pushMatrix();
        MV.translate(vec3.fromValues(.15,0,0));
        MV.scale(scale);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();
        //MV.popMatrix();
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
    
    this.name = "Body-Centered Cubic";
    this.scale = 0.87;
    this.inspect = inspect;
    var layers = null;
}