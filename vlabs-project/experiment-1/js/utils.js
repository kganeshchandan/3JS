import * as THREE from 'three';
import { OrbitControls } from 'threeOC';


export function addSphere(mouse, camera, scene){
    var intersectionPoint = new THREE.Vector3();
    var planeNormal = new THREE.Vector3();
    var plane = new THREE.Plane();
    var raycaster = new THREE.Raycaster();
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1,20,20),
        new THREE.MeshStandardMaterial({
        color:0xFFEA00,
        name:"sphere",
        roughness: 0
        })
    );
    sphereMesh.position.copy(intersectionPoint);
    return sphereMesh;
}
export function CheckHover(mouse, camera, atomList, INTERSECTED){
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects( atomList, false );

    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff44ff );
        }
    } else {
        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
    }
    return INTERSECTED;
}

export function DeleteObject(mouse, camera, scene, atomList, INTERSECTED){
    INTERSECTED= CheckHover(mouse, camera, atomList, INTERSECTED);
    scene.remove(INTERSECTED);
}