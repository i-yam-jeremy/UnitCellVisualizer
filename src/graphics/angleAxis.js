import {vec3, mat3} from '../gl-matrix';

function AngleAxis(angle, axis) {

    this.toRotationMatrix = function() {

        var res = mat3.create();
        var sin_axis  = vec3.create();
        vec3.scale(sin_axis, axis, Math.sin(angle));

        var c = Math.cos(angle);

        var cos1_axis =  vec3.create();
        vec3.scale(cos1_axis, axis, 1.0 - c);

        var tmp = cos1_axis[0] * axis[1];

        res[3] = tmp - sin_axis[2];
        res[1] = tmp + sin_axis[2];

        tmp = cos1_axis[0] * axis[2];
        res[6] = tmp + sin_axis[1];
        res[2] = tmp - sin_axis[1];

        tmp = cos1_axis[1] * axis[2];
        res[7] = tmp - sin_axis[0];
        res[5] = tmp + sin_axis[0];

        res[0] = cos1_axis[0] * axis[0] + c;
        res[4] = cos1_axis[1] * axis[1] + c;
        res[8] = cos1_axis[2] * axis[2] + c;

        return res;
    };

    var angle = angle;
    var axis = axis;
}

export {AngleAxis};
