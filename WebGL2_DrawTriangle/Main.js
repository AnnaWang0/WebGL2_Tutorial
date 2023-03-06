"use strict";

const vertexShaderSource = `#version 300 es

in vec3 a_position;

void main(){
    gl_Position = vec4(a_position, 1);
}
`;
const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 outColor;

void main(){
    outColor = vec4(1, 0, 0.5, 1);
}
`;

function createShader(gl, type, shaderSource){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    // check success
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
    gl.deleteShader(shader);
    return undefined;
}

function createProgram(gl, vertexShader, fragmentShader){
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success){
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return undefined;
}

function main(){
    // get WebGL Context
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext("webgl2");
    if(!gl){
        throw new Error('WebGL not supported');
    }

//create vertex data
    const positions = [
        0, 1, 0,
        -1, -1, 0,
        1, -1, 0,
    ]
//create buffer on GPU
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//load vertex data into buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//create vertex shader
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
//create fragment shader
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
// create program
    const program = createProgram(gl, vertexShader, fragmentShader);

//enable vertex attributes
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

//draw
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();
