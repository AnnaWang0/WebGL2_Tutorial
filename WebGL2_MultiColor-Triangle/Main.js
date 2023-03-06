"use strict";

const vertexShaderSource = `#version 300 es

in vec3 a_position;
in vec3 a_color;

out vec3 v_color;

void main(){
    gl_Position = vec4(a_position, 1);
    v_color = a_color;
}
`;
const fragmentShaderSource = `#version 300 es
precision mediump float;
in vec3 v_color;

out vec4 outColor;

void main(){
    outColor = vec4(v_color, 1);
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

function bindBufferLoadData(gl, buffer, bufferType, data, drawType){
    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, data, drawType);
}

// function enableAttributes(gl, program, a_name, bufferType, buffer){
//     const attributeLocation = gl.getAttribLocation(program, a_name);
//     gl.enableVertexAttribArray(attributeLocation);
//     gl.bindBuffer(bufferType, buffer);
// }

function main(){
    // get WebGL Context
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext("webgl2");
    if(!gl){
        throw new Error('WebGL not supported');
    }

//create vertex data
    const positions = [
        0, 1, 0,        //V1.position
        -1, -1, 0,      //V2.position
        1, -1, 0,       //V3.position
    ]

    // const colors = [
    //     1, 0, 0,        //V1.color
    //     0, 1, 0,        //V2.color
    //     0, 0, 1,        //V3.color
    // ]

    const colors = [
        Math.random(), Math.random(), Math.random(),        //V1.color
        Math.random(), Math.random(), Math.random(),       //V2.color
        Math.random(), Math.random(), Math.random(),        //V3.color
    ]

//create buffer on GPU
// load vertex data into buffer
    const positionBuffer = gl.createBuffer();
    bindBufferLoadData(gl, positionBuffer, gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const colorBuffer = gl.createBuffer();
    bindBufferLoadData(gl, colorBuffer, gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//create vertex shader
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
//create fragment shader
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
// create program
    const program = createProgram(gl, vertexShader, fragmentShader);

//enable vertex attributes
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

//draw
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();
