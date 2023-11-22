import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import textura from './texturas/teste.png';
let scene, camera, renderer;
let particles;
const rotatingParticlesCount = 11700;

let palavra = document.getElementById("formar");

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 1500;
camera.position.x = 100;
camera.position.y = 100;

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enablePan = true;  
orbit.enableRotate = true;
orbit.enableZoom = true; 
renderer.shadowMap.enabled = true;


const positionWord = [];
const numpart = 2000;


const particleTexture = new THREE.TextureLoader().load(textura);

const particleMaterialWord = new THREE.PointsMaterial({
    size: 2, // Define o tamanho dos pontos
    map: particleTexture, 
    blending: THREE.AdditiveBlending, 
    depthWrite: false,
    tranparent:true
});


function curva(s, angleQ, pi, numpart, denx, deny, spacex, spacey) {
    const rotationAngle = Math.PI / angleQ; // Ângulo de rotação (90 graus)
    // Adicionando pontos para a parte curva da letra "C" com rotação
    for (let i = 0; i < numpart; i++) {
        const angle = (i / numpart) * Math.PI * pi; // Distribuir pontos ao longo de um semicírculo
        const rotatedAngle = angle + rotationAngle; // Adicionar o ângulo de rotação
        const x = 40 / denx * Math.cos(rotatedAngle) + Math.random() * 20 + spacex;
        const y = (40 / deny * Math.sin(rotatedAngle)) + Math.random() * 20 + spacey;
        const z = Math.random() * 20; // Deslocamento vertical para alinhar a curva ao restante da letra
        positionWord.push(new THREE.Vector3(y + s, x, z));
    }

}

function reta(s, numpart, spacex, spacey, spacez, a, b) {
    // Adicionando pontos para a parte reta da letra P
    for (let i = 0; i < numpart; i++) {
        const x = Math.random() * spacex + a;
        const y = Math.random() * spacey + b;
        const z = Math.random() * spacez;
        positionWord.push(new THREE.Vector3(x + s, y, z));
    }
}

function createLetterP(s) {
    curva(s, 0.5, 1, numpart, 1.5, 1, 55, 10);
    reta(s, numpart, 20, 100, 20, 0, 0);
}

function createLetterG(s) {
    curva(s, 0.39, 1.7, numpart * 2, 1, 1.2, 40, 0);
    reta(s, numpart * 0.2, 35, 20, 20, 15, 30);
}

function createLetterE(s) {
    reta(s, numpart, 20, 100, 20, 0, 0)
    reta(s, numpart * 0.25, 30, 20, 20, 20, 0)
    reta(s, numpart * 0.25, 30, 20, 20, 20, 40)
    reta(s, numpart * 0.25, 30, 20, 20, 20, 80)
}
function createLetterC(s) {
    curva(s, 0.36, 1.4, numpart * 2, 1, 1.1, 40, 0);

}

createLetterP(0)
createLetterP(80)
createLetterG(190)
createLetterE(250)
createLetterE(310)
createLetterC(410)

const particleWord = new THREE.Points(new THREE.BufferGeometry().setFromPoints(positionWord), particleMaterialWord);
scene.add(particleWord);


const particleGeometry = new THREE.BufferGeometry();
const positions = [];
const colors = [];

const color = new THREE.Color();
for (let i = 0; i < 23400; i++) {
    const theta = Math.random() * Math.PI * 2; // ângulo azimutal
    const phi = Math.acos(2 * Math.random() - 1); // ângulo de inclinação

    const radius = Math.cbrt(Math.random()) * 1000; // raio da esfera para distribuir as partículas de maneira mais uniforme

    // Converter coordenadas esféricas para coordenadas cartesianas (x, y, z)
    const x = 150 + radius * Math.sin(phi) * Math.cos(theta);
    const y = 50 + radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions.push(x, y, z);

    if (i < rotatingParticlesCount) {
        color.setHex(0x00ffff); // Colorindo as primeiras 10 partículas de vermelho
    } else {
        color.setHex(0x000fff); // Colorindo as partículas restantes de verde
    }

    colors.push(color.r, color.g, color.b);
}

particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


const particleTexture2 = new THREE.TextureLoader().load(textura);
const particleMaterial = new THREE.PointsMaterial({ size: 10, vertexColors: true, map: particleTexture2, blending: THREE.AdditiveBlending, depthWrite: false });

particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);


var teste =0;
function animate() {
    const positions = particles.geometry.attributes.position.array;
    const positionsFinal = particleWord.geometry.attributes.position.array;

    for (let i = 0; i < 23400 * 3; i += 3) {

        speed = 0.0005

        const x2 = positionsFinal[i];
        const y2 = positionsFinal[i + 1];
        const z2 = positionsFinal[i + 2];
        // Movimento rotacional em torno do eixo x para as primeiras 10 partículas
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];


        let randomX = Math.random() * 2 - 1;
        let randomY = Math.random() * 2 - 1;
        let randomZ = Math.random() * 2 - 1;

        positions[i] += randomX;
        positions[i + 1] +=  randomY;
         positions[i + 2] +=  randomZ;
       if(palavra.checked){
        // positions[i] = x2;
        // positions[i + 1] =  y2;
        // positions[i + 2] =  z2;

  if(positions[i]<positionsFinal[i]){
    

    if(positions[i]!==positionsFinal[i]){
        positions[i]+=1;
    }
  }else{
    if(positions[i]!==positionsFinal[i]){
        positions[i]-=1;
    }
  }


  if(positions[i+1]<positionsFinal[i+1]){
    

    if(positions[i+1]!==positionsFinal[i+1]){
        positions[i+1]+=1;
    }
  }else{
    if(positions[i+1]!==positionsFinal[i+1]){
        positions[i+1]-=1;
    }
  }


  if(positions[i+2]<positionsFinal[i+2]){
    

    if(positions[i+2]!==positionsFinal[i+2]){
        positions[i+2]+=1;
    }
  }else{
    if(positions[i+2]!==positionsFinal[i+2]){
        positions[i+2]-=1;
    }
  }
       }

    }

    particles.geometry.attributes.position.needsUpdate = true;
    particleWord.geometry.attributes.position.needsUpdate = true;

    // particles.rotation.x += 0.001;
    particles.rotation.y += 0.001;
    // particles.rotation.z += 0.001;

   // particleWord.rotation.x += 0.01;
    particleWord.rotation.y += 0.01;
    // particleWord.rotation.z += 0.01;


    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();