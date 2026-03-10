import * as THREE from 'three';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { GUI } from 'lil-gui';

// 1. Configuración de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl') });

// 2. Sistema de Partículas (BufferGeometry)
const geometry = new THREE.BufferGeometry();
const count = 5000;
const pos = new Float32Array(count * 3);
// ... Lógica para poblar posiciones según el "shape" seleccionado ...
geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));

const material = new THREE.PointsMaterial({ size: 0.02, color: 0xffffff });
const points = new THREE.Points(geometry, material);
scene.add(points);

// 3. MediaPipe Hand Tracking
let handLandmarker;
async function setupHandTracking() {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: `https://storage.googleapis.com/.../hand_landmarker.task` },
        numHands: 1
    });
}

// 4. Bucle de Renderizado
function animate() {
    requestAnimationFrame(animate);
    
    // Aquí calculas la distancia entre el pulgar y el índice 
    // y aplicas: points.scale.set(s, s, s);
    
    renderer.render(scene, camera);
}

// 5. UI (lil-gui)
const gui = new GUI();
const params = { color: '#ffffff', shape: 'galaxy' };
gui.addColor(params, 'color').onChange(v => material.color.set(v));
gui.add(params, 'shape', ['heart', 'galaxy', 'flower']).onChange(updateShape);
gui.add({ fs: () => document.documentElement.requestFullscreen() }, 'fs').name('Fullscreen');

setupHandTracking().then(animate);