import {vertexShaderSrc, fragmentShaderSrc} from './shader.js';

function Program(vertexShaderID, fragmentShaderID) {

    // Returns the id of the vertex shader
    this.getVertexShaderFileName = function() { return vertexShaderID; }

    // Returns the id of the fragment shader
    this.getFragmentShaderFileName = function() { return fragmentShaderID; }

    // Return whether or not the ShaderProgram has been loaded yet
    this.isLoaded = function() { return loaded; }

    // Returns the program ID of this ShaderProgram
    this.getID = function() { return pid; }

    // Load the ShaderProgram
    this.load = function() {

        // Retrieve shaders from src
        var vertexShader = this.getShader(vertexShaderSrc, gl.VERTEX_SHADER)
        var fragmentShader = this.getShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);

        // Create shader's ProgramID
        this.pid = gl.createProgram();

        // Attach shaders to ProgramID
        gl.attachShader(this.pid, vertexShader);
        gl.attachShader(this.pid, fragmentShader);

        // Link program
        gl.linkProgram(this.pid);

        if (!gl.getProgramParameter(this.pid, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(pid));
            alert("Could not initialize shaders " + this.vertexShaderID
                  + " and " + this.fragmentShaderID);
        }

        // Recognition of proper load
        loaded = true;
    }

    // Retrieve a handle by name
    this.getHandle = function(handleName) {
        if (loaded) {
                return handles[handleName];
        }

        alert("ShaderProgram not loaded, handle undefined");
        return null;
    }


    // Adds a handle to the shader such as attribute/uniform
    this.addHandle = function(handleName, type) {

        if (!handles[handleName]){
            switch (type){
            case 'attribute':
                handles[handleName] = gl.getAttribLocation(this.pid,
                                                          handleName);
                gl.enableVertexAttribArray(handles[handleName]);

                break;
            case 'uniform':
                handles[handleName] = gl.getUniformLocation(this.pid,
                                                           handleName);
                break;
            default:
                DEBUG("Invalid handle type: " + type +
                      " for handle " + handleName);
                return;
            }
            if (handles[handleName] < 0){
                console.log("Handle " + handleName + " loaded incorrectly. "
                            + "Handle does not exist or is not optmized "
                            + "(i.e. You are not using it on the shader)");
                return;
            }
        }
    }

    // Grabs shader from source file
    this.getShader = function(shaderSrc, type) {

        var shader = gl.createShader(type);
        gl.shaderSource(shader, shaderSrc);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    this.bind = function() {
        gl.useProgram(this.pid);
    }

    this.unbind = function() {
        //gl.useProgram(0);
    }

    var handles = {}
    var vertexShaderID = vertexShaderID;
    var fragmentShaderID = fragmentShaderID;
    var loaded = false;
    var pid;
}

export {Program};
