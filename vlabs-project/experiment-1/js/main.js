// import * as THREE from 'three';
import { OrbitControls } from 'threeOC';
import { addSphere , CheckHover, DeleteObject} from './utils.js';
// import { RectAreaLightHelper } from 'threeRectAreaLightHelper';
// import { RectAreaLightUniformsLib } from 'threeRectAreaLightUniformsLib';


//  init camera
var camera = new THREE.PerspectiveCamera(
    75, //FOV
    window.innerWidth/window.innerHeight, //aspect ratio
    0.1,
    1000,
);
camera.position.set( 10, 10, 20 );

// init the renderer and the scene
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);


// initialize the axes
var axesHelper = new THREE.AxesHelper(window.innerHeight);
scene.add( axesHelper );


// add light to the  system
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50,100,0);
light.castShadow = true;
const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(-50,100,0);
light2.castShadow = true;
scene.add(light);
scene.add(light2);



// init the orbit controls
var controls = new OrbitControls( camera, renderer.domElement );
controls.update();
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.enablePan = false;
controls.enableDamping = true;

// to check the current object which keyboard points to
let INTERSECTED;

function getMouseCoords(event){
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    return mouse;
}
var mouse = new THREE.Vector2();
//  detect mouse click
let drag = false;
document.addEventListener("mousedown", function(event){
    drag = false;
    mouse = getMouseCoords(event);
})
document.addEventListener("mousemove", function(event){
    drag = true;
    mouse = getMouseCoords(event);
})

document.addEventListener("keydown", function(event){
    var keyCode = event.key ;
    if (keyCode == 'd'){
        DeleteObject(mouse, camera, scene, atomList, INTERSECTED);
    }
})

let action = "addAtom";

// create a list of atoms in scene
var atomList = []
document.addEventListener("mouseup", function(event){
    if (drag == false){
        // if the action is add atom
        if (action == "addAtom"){
            var newSphere = addSphere(mouse, camera, scene);
            scene.add(newSphere);
            atomList.push(newSphere);
        }
    };
})








// make the window responsive
window.addEventListener('resize', ()=>{
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

document.getElementById("WebGL-output").appendChild(renderer.domElement);


// render the scene and animate
var render = function() {
    INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED);
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene,camera);
}

render();