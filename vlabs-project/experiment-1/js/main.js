// import * as THREE from 'three';
import { OrbitControls } from "threeOC";
import {
    AddLight,
    addSphere,
    CheckHover,
    DeleteObject,
    TranslatePattern,
} from "./utils.js";

// import { RectAreaLightHelper } from 'threeRectAreaLightHelper';
// import { RectAreaLightUniformsLib } from 'threeRectAreaLightUniformsLib';
//  init camera
var camera = new THREE.PerspectiveCamera(
    75, //FOV
    window.innerWidth / window.innerHeight, //aspect ratio
    0.1,
    1000
);
camera.position.set(10, 10, 20);

// init the renderer and the scene
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// initialize the axes
var axesHelper = new THREE.AxesHelper(window.innerHeight);
scene.add(axesHelper);

// add light to the  system
const lights = AddLight();
for (let i = 0; i < lights.length; i++) {
    scene.add(lights[i]);
}
// init the orbit controls
var controls = new OrbitControls(camera, renderer.domElement);
controls.update();
controls.autoRotate = true;
controls.autoRotateSpeed = 0;
controls.enablePan = false;
controls.enableDamping = true;

// to check the current object which keyboard points to
let INTERSECTED;

function getMouseCoords(event) {
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    return mouse;
}
var mouse = new THREE.Vector2();
//  detect mouse click
let drag = false;
document.addEventListener("mousedown", function (event) {
    drag = false;
    mouse = getMouseCoords(event);
});
document.addEventListener("mousemove", function (event) {
    drag = true;
    mouse = getMouseCoords(event);
});

document.addEventListener("keydown", function (event) {
    var keyCode = event.key;
    if (keyCode == "d") {
        DeleteObject(mouse, camera, scene, atomList, INTERSECTED);
    }
});

let action = "";

// create a list of atoms in scene
var atomList = [];

var SelectAtomList = [];
// listen to the mouse up
document.addEventListener("mouseup", function (event) {
    if (drag == false) {
        // if the action is add atom
        if (action == "addAtom") {
            if (mouse.y < -0.8) {
                return;
            }
            var newSphere = addSphere(mouse, camera, scene);
            scene.add(newSphere);
            atomList.push(newSphere);
        }
        if (action == "selectAtom") {
            INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED);
            if (INTERSECTED) {
                SelectAtomList.push(INTERSECTED);
            }
        }
    }
});

// respond to click addAtom
const addSphereButton = document.getElementById("AddAtom");
addSphereButton.addEventListener("click", function () {
    console.log("adding atom mode");
    if (action != "addAtom") {
        action = "addAtom";
        document.getElementById("AddAtom").style =
            "background-color: rgba(0,255,255,0.75); color: #000000 ";
    } else {
        action = "";
        document.getElementById("AddAtom").style =
            "color: rgba(127,255,255,0.75);background: transparent; outline: 1px solid rgba(127,255,255,0.75);border: 0px;padding: 5px 10px;cursor: pointer;";
    }
});

// respond to select a bunch of atoms
const addSelectList = document.getElementById("SelectAtom");
addSelectList.addEventListener("click", function () {
    console.log("selecting atom mode");
    if (action != "selectAtom") {
        action = "selectAtom";
        document.getElementById("SelectAtom").style =
            "background-color: rgba(0,255,255,0.75); color: #000000 ";
    } else {
        action = "";
        document.getElementById("SelectAtom").style =
            "color: rgba(127,255,255,0.75);background: transparent; outline: 1px solid rgba(127,255,255,0.75);border: 0px;padding: 5px 10px;cursor: pointer;";
    }
});

// respond to translate
const translateList = document.getElementById("TranslatePattern");
translateList.addEventListener("click", function () {
    console.log("translating");
    var newAtoms = TranslatePattern(SelectAtomList);
    for (let i = 0; i < newAtoms.length; i++) {
        scene.add(newAtoms[i]);
    }
    SelectAtomList = newAtoms;
});

// make the window responsive
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// render the scene and animate
var render = function () {
    for (let i = 0; i < SelectAtomList.length; i++) {
        var curAtom = SelectAtomList[i];
        console.log(curAtom.position);
    }
    INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED);
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
};

render();
