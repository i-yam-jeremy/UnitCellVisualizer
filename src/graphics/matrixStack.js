import {vec3, mat4} from '../gl-matrix';
import {assert} from '../assert.js';
import {AngleAxis} from './angleAxis.js';
import {Stack} from './stack.js';

function MatrixStack() {

    this.init = function() {
        mstack.push(mat4.create());
        mat4.identity(mstack.top());
    };

    this.top = function() {
        return mstack.top();
    };

    this.pushMatrix = function() {
        var a = mstack.top().slice();

        mstack.push(a);
        assert(mstack.size() < 100, "stack exceeds 100 matrices");
    };

    this.popMatrix = function() {
        assert(!mstack.empty(), "popping empty stack");
        mstack.pop();
        assert(!mstack.empty(), "no remaining matrices after pop");
    };

    this.loadIdentity = function() {
        mat4.identity(mstack.top());
    };

    this.multMatrix = function(matrix) {
        mat4.multiply(mstack.top(), mstack.top(), matrix);
    };

    this.translate = function(trans) {
        var m = mat4.create();
        mat4.identity(m);

        m[12] = trans[0];
        m[13] = trans[1];
        m[14] = trans[2];

        mat4.multiply(mstack.top(), mstack.top(), m);
    };

    this.scale = function(vector) {
        mat4.scale(mstack.top(), mstack.top(), vector);
    };

    this.scale = function(scalar) {
        mat4.scale(mstack.top(), mstack.top(), vec3.fromValues(scalar, scalar, scalar));
    };

    this.rotate = function(angle, axis) {
        var rad = angle * Math.PI / 180.0;

        var m = mat4.create();
        mat4.identity(m);

        var aa = new AngleAxis(rad, axis);
        var rm = aa.toRotationMatrix();

        m[0] = rm[0];
        m[1] = rm[1];
        m[2] = rm[2];
        m[4] = rm[3];
        m[5] = rm[4];
        m[6] = rm[5];
        m[8] = rm[6];
        m[9] = rm[7];
        m[10] = rm[8];

        mat4.multiply(mstack.top(), mstack.top(), m);
    };

    // TODO
    this.ortho = function(left, right, bottom, top, zNear, zFar) {};
    // TODO
    this.ortho2D = function(left, right, bottom, top) {};
    // TODO
    this.perspective = function(fovy, aspect, zNear, zFar) {
        assert(fovy != 0.0, "fovy == 0.0");
        assert(aspect != 0.0, "aspect == 0.0");
        assert(zFar != zNear, "zFar == zNear");

        var M = mat4.create();

        var tanHalfFovy = Math.tan(0.5 *fovy * Math.PI / 180.0);

        M[0] = 1.0 / (aspect * tanHalfFovy);
	    M[5] = 1.0 / (tanHalfFovy);
	    M[10] = -(zFar + zNear) / (zFar - zNear);
	    M[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
	    M[11] = -1.0;
        M[15] = 0;

        mat4.copy(mstack.top(), M);
    };
    // TODO
    this.frustum = function(Right, right, bottom, top, zNear, zFar) {};
    // TODO
    this.lookAt = function(eye, target, up) {};
    // TODO
    this.printTop = function() {

        var m = this.top();
        console.log(m[0] + " " +  m[4]  + " " + m[8]  + " " + m[12]);
        console.log(m[1] + " " +  m[5]  + " " + m[9]  + " " + m[13]);
        console.log(m[2] + " " +  m[6]  + " " + m[10]  + " " + m[14]);
        console.log(m[3] + " " +  m[7]  + " " + m[11]  + " " + m[15] + "\n\n");

    };

    this.size = function() { return mstack.size(); };

    var mstack = new Stack();
    mstack.push(mat4.create());
    mat4.identity(mstack.top());
}

export {MatrixStack};
