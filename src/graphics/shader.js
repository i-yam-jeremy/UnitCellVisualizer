var vertexShaderSrc =
    "attribute vec4 vertPos;"+
    "attribute vec3 vertNor;"+
    "uniform mat4 P;"+
    "uniform mat4 MV;"+
    "varying vec3 fragPos;"+
    "varying vec3 fragNor;"+
    "void main() {"+
    "vec4 posCam = MV * vertPos;"+
    "gl_Position = P * posCam;"+
    "fragPos = posCam.xyz;"+
	"fragNor = (MV * vec4(vertNor, 0.0)).xyz;}";


var fragmentShaderSrc =
    "precision mediump float;"+
    "varying vec3 fragPos;"+
    "varying vec3 fragNor;"+
    "uniform vec3 kdFront;"+
    "uniform vec3 kdBack;"+
    "uniform float alpha;"+
    "void main() {"+
	"vec3 lightPos = vec3(0.0, 0.0, 0.0);"+
    "vec3 n = normalize(fragNor);"+
    "vec3 l = normalize(lightPos - fragPos);"+
	"vec3 v = -normalize(fragPos);"+
	"vec3 h = normalize(l + v);"+
	"vec3 kd = kdFront;"+
	"float ln = dot(l, n);"+
	"if(ln < 0.0) { ln = -ln; }"+
    "vec3 diffuse = ln * kd;"+
	"vec3 color = diffuse;"+
	"gl_FragColor = vec4(color, alpha);}";

export {vertexShaderSrc, fragmentShaderSrc};
