// © 2017 Joseph Cameron - All Rights Reserved
// Project: HTML53DRenderer
// Created on 2017-12-20.

// Resources inc
import "favicon.ico"
import "index.html"
import "style.css"
/*
import "Awesome.png"
import "Blocky.png"
import "brick.png"
import "grass.png"

// Engine inc
import IntervalTimer from "Engine/Time/IntervalTimer"
import AnimationTimer from "Engine/Time/AnimationTimer"
import IdleTimer from "Engine/Time/IdleTimer"
import Debug from "Engine/Debug"
import Exceptions from "Engine/Debug/Exceptions"
import Vector2 from "Engine/Math/Vector2"
import Vector3 from "Engine/Math/Vector3"
import Matrix4x4 from "Engine/Math/Matrix4x4"
import Color from "Engine/Graphics/Color"
import Colors from "Engine/Graphics/Colors"
import DocGraphicsObject from "Engine/Graphics/GraphicsObject"
import Shapes from "Engine/Graphics/Shapes"
import Sprite from "Engine/Graphics/Sprite"
import Keyboard from "Engine/Input/Keyboard"
import Mouse from "Engine/Input/Mouse"
import Gamepads from "Engine/Input/Gamepads"
import DocCamera from "Engine/Graphics/Camera"
import Scenegraph from "Engine/Graphics/Scenegraph"

import VertexData from "Engine/Graphics/WebGL/VertexData"
import Texture from "Engine/Graphics/WebGL/Texture"
import Shader from "Engine/Graphics/WebGL/Shader"
import Shaders from "Engine/Graphics/WebGL/Shaders"
import Camera from "Engine/Graphics/WebGL/Camera"
import WebGLCanvas from "Engine/Graphics/WebGL/WebGLCanvas"

// GDK inc
import DebugCameraController from "GDK/Debug/DebugCameraController"

// Adhoc
const TAG: string = "Main";

/**
 * @description user facing abstraction for the rest of this nonsense
 */
/*class GraphicsObject
{
    public draw(gl: any)
    {

    }

    constructor()
    {
        throw Exceptions.Unimplemented;
    }
}

//=========
// Mainline
//=========
const webglCanvas = new WebGLCanvas(document.body);

const texture = new Texture(webglCanvas.gl(), "./img/Awesome.png");

const shader = Shaders.AlphaCutOff(webglCanvas.gl());

shader.setTextureUniform("_Texture", texture);

const mat = new Matrix4x4();

shader.setMatrix4x4("_MVP", mat);

const vertexData = new VertexData(
    [
        {name: "a_Pos", size: 3},
        {name: "a_UV",  size: 2},
    ],
    [
        //x,                y,    z,   u,   v,  
        0.5 -0.25,  0.5 -0.25,  0.0, 1.0, 0.0, // 1--0
        0.0 -0.25,  0.5 -0.25,  0.0, 0.0, 0.0, // | /
        0.0 -0.25,  0.0 -0.25,  0.0, 0.0, 1.0, // 2
        0.5 -0.25,  0.5 -0.25,  0.0, 1.0, 0.0, //    0
        0.0 -0.25,  0.0 -0.25,  0.0, 0.0, 1.0, //  / |
        0.5 -0.25,  0.0 -0.25,  0.0, 1.0, 1.0, // 1--2
    ]
);

const bgClearCamera = new Camera(webglCanvas.gl());
bgClearCamera.setClearColor(1,0,0,1);

const camera = new Camera(webglCanvas.gl());

const camera2 = new Camera(webglCanvas.gl());
camera2.setClearColor(0,1,0,1);

const camera3 = new Camera(webglCanvas.gl());
camera3.setClearMode(Camera.ClearMode.DepthOnly);

const renderLoop = new AnimationTimer((aDeltaTime: number) =>
{
    let gl: any = webglCanvas.gl();
    
    shader.setFloatUniform("_Time", performance.now()*0.005);

    shader.draw(vertexData.getVertexFormat());

    bgClearCamera.draw(webglCanvas.getSize(), new Vector2(0, 0), new Vector2(1, 1));

    camera.draw(webglCanvas.getSize(), new Vector2(0, 0.25), new Vector2(0.5, 0.5));
    vertexData.draw(gl);

    camera2.draw(webglCanvas.getSize(), new Vector2(0.5, 0.25), new Vector2(0.5, 0.5));
    vertexData.draw(gl);

    camera3.draw(webglCanvas.getSize(), new Vector2(0.25, 0.25), new Vector2(0.5, 0.5));
    vertexData.draw(gl);
});

const vec = new Vector3();

let inc = 0;

const updateLoop = new IntervalTimer(16,(aDeltaTime: number) =>
{
    vec.y = Math.sin(performance.now()*0.01) * 0.05;
    vec.x = Math.cos(performance.now()*0.01) * 0.05;

    //mat.translate(vec);

    mat.rotateX(inc);

    inc += 0.01;
});*/

(()=>
{
    console.log("Blar");
})();
