// import mat4 from "./toji-gl-matrix-4480752/dist/gl-matrix-min.js";

"use strict";

const vertexShaderSource = `#version 300 es
uniform vec2 u_resolution;

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
function rectangleData(x, y, width, height){
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;

    const rectanglePosition = [
        x1, y1, 0,
        x2, y1, 0,
        x1, y2, 0,
        x1, y2, 0,
        x2, y2, 0,
        x2, y1, 0,
    ];

    return rectanglePosition;
}

function letterF(x, y, width, height, thickness){
    const fVertexPosition = [
        // left column
        x, y, 0,
        x + thickness, y, 0,
        x, y + height, 0,
        x, y + height, 0,
        x + thickness, y, 0,
        x + thickness, y + height, 0,

        // top rung
        x + thickness, y, 0,
        x + width, y, 0,
        x + thickness, y + thickness, 0,
        x + thickness, y + thickness, 0,
        x + width, y, 0,
        x + width, y + thickness, 0,

        // middle rung
        x + thickness, y + thickness * 2, 0,
        x + width * 2 / 3, y + thickness * 2, 0,
        x + thickness, y + thickness * 3, 0,
        x + thickness, y + thickness * 3, 0,
        x + width * 2 / 3, y + thickness * 2, 0,
        x + width * 2 / 3, y + thickness * 3, 0,
    ]

    return fVertexPosition;
}

function main(){
    // get WebGL Context
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext("webgl2");
    if(!gl){
        throw new Error('WebGL not supported');
    }

    // pre-vertex data
    let coordinates = [-0.5, -0.5];
    let rectangleSize = [0.3, 0.5];
    let thickness = 0.1;

//create vertex data
    console.log(gl.canvas.width, gl.canvas.height);

    //const positions = rectangleData(coordinates[0], coordinates[1], rectangleSize[0], rectangleSize[1]);
    const positions = letterF(coordinates[0], coordinates[1], rectangleSize[0], rectangleSize[1], thickness);

    const colors = [
        Math.random(), Math.random(), Math.random(),        //V1.color
        Math.random(), Math.random(), Math.random(),       //V2.color
        Math.random(), Math.random(), Math.random(),        //V3.color
        Math.random(), Math.random(), Math.random(),        //V4.color
        Math.random(), Math.random(), Math.random(),       //V5.color
        Math.random(), Math.random(), Math.random(),        //V6.color
        Math.random(), Math.random(), Math.random(),        //V7.color
        Math.random(), Math.random(), Math.random(),       //V8.color
        Math.random(), Math.random(), Math.random(),        //V9.color

        Math.random(), Math.random(), Math.random(),        //V1.color
        Math.random(), Math.random(), Math.random(),       //V2.color
        Math.random(), Math.random(), Math.random(),        //V3.color
        Math.random(), Math.random(), Math.random(),        //V4.color
        Math.random(), Math.random(), Math.random(),       //V5.color
        Math.random(), Math.random(), Math.random(),        //V6.color
        Math.random(), Math.random(), Math.random(),        //V7.color
        Math.random(), Math.random(), Math.random(),       //V8.color
        Math.random(), Math.random(), Math.random(),        //V9.color
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

    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    console.log(resolutionUniformLocation);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

//draw
    let first = 0;
    let count = 18;
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, first, count);
}

main();
