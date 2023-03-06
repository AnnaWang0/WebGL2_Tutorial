"use strict";

const vertexShaderSource = `#version 300 es

in vec3 a_position;
in vec3 a_color;

uniform mat4 u_matrix;

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

function main(){
    // get WebGL Context
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext("webgl2");
    if(!gl){
        throw new Error('WebGL not supported');
    }

//create vertex data
    const matrixData = glMatrix.mat4.create();
    glMatrix.mat4.translate(matrixData, matrixData, [2, 5, 1]);
    glMatrix.mat4.translate(matrixData, matrixData, [-1, -3, 0]);
    console.log(matrixData);

    // const matrix = [
    //     1, 0, 0, 0,
    //     0, 1, 0, 0,
    //     0, 0, 1, 0,
    //     0, 0, 0, 1,
    // ]

    // Triangle

    const positions = [
        0, 1, 0,        //V1.position
        -1, -1, 0,      //V2.position
        1, -1, 0,       //V3.position
    //     0, 1, 0,        //V4.position
    //     -1, -1, 0,        //V5.position
    //     -1, 1, 0,        //V6.position
    //     0, 1, 0,        //V7.position
    //     1, 1, 0,        //V8.position
    //     1, -1, 0,        //V9.position
    ]

    // Letter T
    // const positions = [
    //     -1, 0.1, 0,        //V1.position
    //     -0.5, 0.1, 0,      //V2.position
    //     -1, -0.1, 0,       //V3.position
    //     -1, -0.1, 0,        //V4.position
    //     -0.5, -0.1, 0,        //V5.position
    //     -0.5, 0.1, 0,        //V6.position
    //     -0.7, -0.1, 0,        //V7.position
    //     -0.7, -0.7, 0,        //V8.position
    //     -0.8, -0.7, 0,        //V9.position
    //     -0.8, -0.7, 0,        //V10.position
    //     -0.8, -0.1, 0,        //V11.position
    //     -0.7, -0.1, 0,        //V12.position
    // ]


    const colors = [
        Math.random(), Math.random(), Math.random(),        //V1.color
        Math.random(), Math.random(), Math.random(),       //V2.color
        Math.random(), Math.random(), Math.random(),        //V3.color
        // Math.random(), Math.random(), Math.random(),        //V4.color
        // Math.random(), Math.random(), Math.random(),       //V5.color
        // Math.random(), Math.random(), Math.random(),        //V6.color
        // Math.random(), Math.random(), Math.random(),        //V7.color
        // Math.random(), Math.random(), Math.random(),       //V8.color
        // Math.random(), Math.random(), Math.random(),        //V9.color
        // Math.random(), Math.random(), Math.random(),        //V10.color
        // Math.random(), Math.random(), Math.random(),       //V11.color
        // Math.random(), Math.random(), Math.random(),        //V12.color
    ]

    let translation = [0.5, 0.5];
    let rotationInRadians = 0;
    let scale = [1, 1];

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
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    console.log(positionAttributeLocation);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    console.log(colorAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);


//draw
    gl.useProgram(program);

    // load uniform data
    const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix")
    console.log(matrixUniformLocation);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrixData);


    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

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


// Matrix
var m3 = {
    translation: function translation(tx, ty){
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    },

    rotation: function rotation(angleInRadians){
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    },

    scaling: function scaling(sx, sy){
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    },

    multiply: function multiply(a, b) {
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];
        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
};

main();