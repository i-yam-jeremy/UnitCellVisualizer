import {OBJ} from './obj-loader.js';

function Shape()
{
    // Capture OBJ info
    this.loadMesh = function(objFileName) {

        OBJ.downloadMeshes({"obj" : objFileName}, this.init);
    };

    // Grab mesh data and generate data buffers
    this.init = function(mesh) {

        var obj = mesh.obj;

        eleBuf = obj.indices;
        posBuf = obj.verts;
        norBuf = obj.norms;

        posBufID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBufID);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posBuf), gl.STATIC_DRAW);

        norBufID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, norBufID);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norBuf), gl.STATIC_DRAW);

        eleBufID = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eleBufID);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(eleBuf), gl.STATIC_DRAW);

        loaded = true;
    };

    // Draw shape
    this.draw = function(prog) {

         // Enable and bind attributes to their respective data buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, posBufID);
gl.vertexAttribPointer(prog.getHandle("vertPos"), 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, norBufID);
        gl.vertexAttribPointer(prog.getHandle("vertNor"), 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eleBufID);

        gl.drawElements(gl.TRIANGLES, eleBuf.length, gl.UNSIGNED_SHORT, 0);
    };

    this.isLoaded = function() { return loaded; };

    var loaded = false;
    var eleBuf = new Array();
    var posBuf = new Array();
    var norBuf = new Array();
    var texBuf = new Array();
    var eleBufID;
    var posBufID;
    var norBufID;
    var texBufID;
}

export {Shape};
