// import * as THREE from 'three';
import { OrbitControls } from "threeOC";
import {
    AddLight,
    addSphere,
    CheckHover,
    DeleteObject,
    TranslatePattern,
    updateButtonCSS,
    // highlightSelectList,
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
            if (mouse.y < -0.75) {
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
                // INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                console.log(INTERSECTED);
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
    } else {
        action = "";
    }
});

// respond to select a bunch of atoms
const addSelectList = document.getElementById("SelectAtom");
addSelectList.addEventListener("click", function () {
    console.log("selecting atom mode");
    if (action != "selectAtom") {
        action = "selectAtom";
    } else {
        action = "";
        SelectAtomList = [];
    }
});

// respond to translate

const form = document.getElementById("translate");
form.addEventListener("submit", function () {
    console.log("translating");
    var vec = form.elements;
    var translateVec = new THREE.Vector3(
        parseInt(vec[0].value),
        parseInt(vec[1].value),
        parseInt(vec[2].value)
    );
    var newAtoms = TranslatePattern(SelectAtomList, translateVec);
    console.log(translateVec, newAtoms);
    for (let i = 0; i < newAtoms.length; i++) {
        scene.add(newAtoms[i]);
        atomList.push(newAtoms[i]);
    }
    SelectAtomList = newAtoms;
});

const translateList = document.getElementById("TranslatePattern");
translateList.addEventListener("click", function () {});

// make the window responsive
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// render the scene and animate
var render = function () {
    // highlightSelectList(SelectAtomList, scene);
    updateButtonCSS(action);
    INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED);
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
};

render();
