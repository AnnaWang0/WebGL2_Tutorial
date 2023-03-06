"use strict";

const vertexShaderSource = `#version 300 es

//uniform float u_PointSize;
uniform mat4 u_Matrix;
in vec3 a_Position;
in vec3 a_Color;

out vec3 v_Color;

void main(){
    //gl_PointSize = u_PointSize;
    gl_Position = u_Matrix * vec4(a_Position, 1.0);
    v_Color = a_Color;
}
`;
const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 v_Color;

out vec4 fragColor;

void main(){
    fragColor = vec4(v_Color, 1.0);
}
`;

function main(){
    // get WebGL context
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');

    if(!gl){
        throw new Error("WebGL is not supported");
    }

    // vertexData

    // const pointSizeData = 110.0;

    // const positionData = [
    //     0, .3, 0,        //V1.position
    //     -.3, -.3, 0,      //V2.position
    //     .3, -.3, 0,       //V3.position
    // ];

    const positionData = [
        // Front
        0.5, 0.5, 0.5,
        0.5, -.5, 0.5,
        -.5, 0.5, 0.5,
        -.5, 0.5, 0.5,
        0.5, -.5, 0.5,
        -.5, -.5, 0.5,

        // Left
        -.5, 0.5, 0.5,
        -.5, -.5, 0.5,
        -.5, 0.5, -.5,
        -.5, 0.5, -.5,
        -.5, -.5, 0.5,
        -.5, -.5, -.5,

        // Back
        -.5, 0.5, -.5,
        -.5, -.5, -.5,
        0.5, 0.5, -.5,
        0.5, 0.5, -.5,
        -.5, -.5, -.5,
        0.5, -.5, -.5,

        // Right
        0.5, 0.5, -.5,
        0.5, -.5, -.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, -.5, 0.5,
        0.5, -.5, -.5,

        // Top
        0.5, 0.5, 0.5,
        0.5, 0.5, -.5,
        -.5, 0.5, 0.5,
        -.5, 0.5, 0.5,
        0.5, 0.5, -.5,
        -.5, 0.5, -.5,

        // Bottom
        0.5, -.5, 0.5,
        0.5, -.5, -.5,
        -.5, -.5, 0.5,
        -.5, -.5, 0.5,
        0.5, -.5, -.5,
        -.5, -.5, -.5,
    ];

    // const colorsData = [
    //     Math.random(), Math.random(), Math.random(),        //V1.color
    //     Math.random(), Math.random(), Math.random(),       //V2.color
    //     Math.random(), Math.random(), Math.random(),        //V3.color
    // ]

    function randomColor(){
        return [Math.random(), Math.random(), Math.random()];
    }

    let colorsData = [];
    for(let face = 0; face<6; face++){
        let faceColor = randomColor();
        for(let vertex=0; vertex<6; vertex++){
            colorsData.push(...faceColor);
        }
    }

    const matrix = glMatrix.mat4.create();
    //glMatrix.mat4.translate(matrix, matrix, [-.5, .3, 0]);
    glMatrix.mat4.scale(matrix, matrix, [.5, .5, .5]);

    // create buffer
    // load vertexData into buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsData), gl.STATIC_DRAW);

    // create vertexShader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    // create fragmentShader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // create program
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
    // const a_PointSize = gl.getAttribLocation(program, `a_PointSize`);
    const a_PositionLoc = gl.getAttribLocation(program, `a_Position`);
    const a_ColorLoc = gl.getAttribLocation(program, `a_Color`);
    //console.log(a_PositionLoc, a_ColorLoc);

    gl.enableVertexAttribArray(a_PositionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(a_PositionLoc, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_ColorLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(a_ColorLoc, 3, gl.FLOAT, false, 0, 0);

    // use program
    gl.useProgram(program);
    //gl.enable(gl.DEPTH_TEST);

    // enable uniforms
    // const u_PointSizeLoc = gl.getUniformLocation(program, `u_PointSize`);
    // console.log(u_PointSizeLoc);
    // gl.uniform1f(u_PointSizeLoc, 30);

    const u_MatrixLoc = gl.getUniformLocation(program, `u_Matrix`);
    console.log(u_MatrixLoc);

    // animation
    function animate(){
        requestAnimationFrame(animate);
        //glMatrix.mat4.rotateZ(matrix, matrix, Math.PI/2 / 70);
        glMatrix.mat4.rotateX(matrix, matrix, Math.PI/2 / 70);
        gl.uniformMatrix4fv(u_MatrixLoc, false, matrix);
        // draw
        gl.drawArrays(gl.TRIANGLES, 0, positionData.length / 3);

    }

    animate();
}

main();