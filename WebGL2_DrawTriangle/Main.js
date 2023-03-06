const vertexShaderSource =`#version 300 es

layout(location=0) in vec3 a_Position;

void main(){
    gl_Position = vec4(a_Position, 1);
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

out vec4 fragColor;

void main(){
    fragColor = vec4(0.5, 0, 0.5, 1.0);
}

`;

// get canvas
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

if(!gl){
    throw new Error('WebGL not supported');
}

// vertexData = [...]
const vertexData = [
    0, 1, 0,        //V1.position
    -1, -1, 0,      //V2.position
    1, -1, 0,       //V3.position
];

// create Buffer
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// load Buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// create Vertex Shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

// create Fragment Shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// create Program
const program = gl.createProgram();
// attach shaders to program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
}

// enable vertex attributes
const positionLoc = gl.getAttribLocation(program, `a_Position`);
console.log(positionLoc);
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

// draw
gl.drawArrays(gl.TRIANGLES, 0, 3);

