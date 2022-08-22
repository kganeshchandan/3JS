import * as THREE from "three";
import { OrbitControls } from "threeOC";

export function addSphere(mouse, camera, scene) {
    var intersectionPoint = new THREE.Vector3();
    var planeNormal = new THREE.Vector3();
    var plane = new THREE.Plane();
    var raycaster = new THREE.Raycaster();
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 20, 20),
        new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            name: "sphere",
            roughness: 0,
        })
    );
    sphereMesh.position.copy(intersectionPoint);
    return sphereMesh;
}
export function CheckHover(mouse, camera, atomList, INTERSECTED) {
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(atomList, false);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED)
                INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff44ff);
        }
    } else {
        if (INTERSECTED)
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }
    return INTERSECTED;
}

export function DeleteObject(mouse, camera, scene, atomList, INTERSECTED) {
    INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED);
    scene.remove(INTERSECTED);
}

export function AddLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(100, 100, 50);
    light.castShadow = true;
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(-100, 100, -50);
    light2.castShadow = true;
    const light3 = new THREE.DirectionalLight(0xffffff, 1);
    light3.position.set(0, 100, 0);
    light3.castShadow = true;

    return [light, light2, light3];
}

export function TranslatePattern(SelectAtomList, translateVec) {
    var newAtoms = [];
    for (let i = 0; i < SelectAtomList.length; i++) {
        var curAtom = SelectAtomList[i];
        var newpos = curAtom.position.clone();
        // var translateVec = new THREE.Vector3(1, 1, 1);
        newpos.add(translateVec);
        var sphereMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 20, 20),
            new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                name: "sphere",
                roughness: 0,
            })
        );
        sphereMesh.position.copy(newpos);
        newAtoms.push(sphereMesh);
    }
    return newAtoms;
}

export function updateButtonCSS(action) {
    if (action == "addAtom") {
        document.getElementById("AddAtom").style =
            "background-color: rgba(0,255,255,0.75); color: #000000 ";
        document.getElementById("SelectAtom").style =
            "color: rgba(127,255,255,0.75);background: transparent; outline: 1px solid rgba(127,255,255,0.75);border: 0px;padding: 5px 10px;cursor: pointer;";
    } else if (action == "selectAtom") {
        document.getElementById("SelectAtom").style =
            "background-color: rgba(0,255,255,0.75); color: #000000 ";
        document.getElementById("AddAtom").style =
            "color: rgba(127,255,255,0.75);background: transparent; outline: 1px solid rgba(127,255,255,0.75);border: 0px;padding: 5px 10px;cursor: pointer;";
    } else {
        document.getElementById("AddAtom").style =
            "color: rgba(127,255,255,0.75);background: transparent; outline: 1px solid rgba(127,255,255,0.75);border: 0px;padding: 5px 10px;cursor: pointer;";
        document.getElementById("SelectAtom").style =
            "color: rgba(127,255,255,0.75);background: transparent; outline: 1px solid rgba(127,255,255,0.75);border: 0px;padding: 5px 10px;cursor: pointer;";
    }
}
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}
// export function highlightSelectList(SelectAtomList, scene) {
//     for (let j = 0; j < scene.children; j++) {
//         for (let i = 0; i < SelectAtomList.length; i++) {
//             var atom = scene.children[j];
//             var pink = 0xff44ff;
//             var blue = 0x00ffff;
//             if (containsObject(atom, SelectAtomList)) {
//                 atom.material.emissive.setHex(pink);
//                 atom.currentHex = atom.material.emissive.getHex();
//             } else {
//                 atom.material.emissive.setHex(blue);
//                 atom.currentHex = atom.material.emissive.getHex();
//             }
//         }
//     }
// }
