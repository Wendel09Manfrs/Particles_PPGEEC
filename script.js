import * as THREE from 'three'
import{GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import bolha from './texturas/bubble.png'
import diamante from './texturas/diamante.png'
import luz from './texturas/luz.png'
import olho from './texturas/olho.png'
import floco from './texturas/floco.png'
import estrela from './texturas/estrela.png'
let scene, camera, renderer

let palavra = document.getElementById('formar')
let aleat = document.getElementById('espalhar')
const textureSelect = document.getElementById('textura')
const quantParticle = document.getElementById('qtdParticle')
const botaoText = document.getElementById('mudaTextura')
const botaoQtd = document.getElementById('mudaQtd')
const corEsc = document.getElementById('cor')

const blend = new URL('./blender/palavraPequeno.glb',import.meta.url)

let selectedTexture = 'luz'
let quantPart = 10000
let clique = false

const textureMappings = {
  bolha: bolha,
  diamante: diamante,
  luz: luz,
  olho: olho,
  floco: floco,
  estrela: estrela,
  semTextura: null,
}

textureSelect.addEventListener('change', function () {
  selectedTexture = textureSelect.value
})
botaoText.addEventListener('click', function () {
  clique = true
})

scene = new THREE.Scene()

camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000000,
)
camera.position.z = 400
camera.position.x = 200
camera.position.y = 0

renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.sortObjects = false;
const orbit = new OrbitControls(camera, renderer.domElement)
orbit.enablePan = true
orbit.enableRotate = true
orbit.enableZoom = true
const focusPoint = new THREE.Vector3(200, 0, 0) // Altere para o ponto que desejar
orbit.target.copy(focusPoint)

camera.lookAt(new THREE.Vector3(200, 0, 120))

renderer.shadowMap.enabled = true

let mixer;

let positionWord = []

function curva(s, angleQ, pi, num, deny, denx, spacey, spacex) {
  const rotationAngle = Math.PI / angleQ // Ângulo de rotação (90 graus)
  // Adicionando pontos para a parte curva da letra "C" com rotação
  for (let i = 0; i < num; i++) {
    const angle = (i / num) * Math.PI * pi // Distribuir pontos ao longo de um semicírculo
    const rotatedAngle = angle + rotationAngle // Adicionar o ângulo de rotação
    const x = (40 / denx) * Math.sin(rotatedAngle) + Math.random() * 20 + spacex
    /////
    const y = (40 / deny) * Math.cos(rotatedAngle) + Math.random() * 20 + spacey
    /////
    const z = Math.random() * 20 // Deslocamento vertical para alinhar a curva ao restante da letra
    positionWord.push(new THREE.Vector3(x + s, y, z))
  }
}

function reta(s, num, spacex, spacey, spacez, a, b) {
  // Adicionando pontos para a parte reta da letra P
  for (let i = 0; i < num; i++) {
    const x = Math.random() * spacex + a
    const y = Math.random() * spacey + b
    const z = Math.random() * spacez
    positionWord.push(new THREE.Vector3(x + s, y, z))
  }
}

function createLetterP(s) {
  curva(s, 0.5, 1, quantPart / 10, 1.5, 1, 55, 10) //2000 2000
  reta(s, quantPart / 10, 20, 100, 20, 0, 0)
}

function createLetterG(s) {
  curva(s, 0.39, 1.7, quantPart / 8, 1, 1.2, 40, 0) //1250 + 200
  reta(s, quantPart / 50, 35, 20, 20, 15, 30)
}

function createLetterE(s) {
  reta(s, quantPart / 10, 20, 100, 20, 0, 0) //1600 1600
  reta(s, quantPart / 50, 30, 20, 20, 20, 0)
  reta(s, quantPart / 40, 30, 20, 20, 15, 40)
  reta(s, quantPart / 50, 30, 20, 20, 20, 80)
}
function createLetterC(s) {
  curva(s, 0.36, 1.4, quantPart / 8, 1, 1.1, 40, 0) //1250
}

createLetterP(0)
createLetterP(80)
createLetterG(190)
createLetterE(250)
createLetterE(310)
createLetterC(410)

function corAleatoria() {
  const r = Math.random()
  const g = Math.random()
  const b = Math.random()
  return new THREE.Color(r, g, b)
}

let particleWordGeometry = new THREE.BufferGeometry().setFromPoints(
  positionWord,
)

let positionsAttribute = particleWordGeometry.getAttribute('position')

let finalPositions = positionsAttribute.array

let positions = []
function AleatParticle(qtd) {
  positions = []
  let colors = []
  for (let i = 0; i < qtd; i++) {
    const theta = Math.random() * Math.PI * 2 // ângulo azimutal
    const phi = Math.acos(2 * Math.random() - 1) // ângulo de inclinação

    const radius = Math.cbrt(Math.random()) * 2000
    const x = 150 + radius * Math.sin(phi) * Math.cos(theta)
    const y = 50 + radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    positions.push(new THREE.Vector3(x, y, z))
    let color = corAleatoria()
    colors.push(color)
  }
  return { positions, colors }
}

const particula = AleatParticle(quantPart)
let particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(
    particula.positions.flatMap((v) => [v.x, v.y, v.z]),
    3,
  ),
)
particleGeometry.setAttribute(
  'color',
  new THREE.Float32BufferAttribute(
    particula.colors.flatMap((c) => [c.r, c.g, c.b]),
    3,
  ),
)

let particleGeometryAleat = new THREE.BufferGeometry().setFromPoints(positions)

let positionsAttrAleat = particleGeometryAleat.getAttribute('position')

let aleatPositions = positionsAttrAleat.array

const particleTexture = new THREE.TextureLoader().load(
  textureMappings[selectedTexture],
)

const particleMaterial = new THREE.PointsMaterial({
  size: 5,
  vertexColors: true,
  map:particleTexture,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent:false
})

let particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

botaoQtd.addEventListener('click', function () {
  quantPart = quantParticle.value
  scene.remove(particles)
  positionWord = []

  let particula = AleatParticle(quantPart)
  let particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      particula.positions.flatMap((v) => [v.x, v.y, v.z]),
      3,
    ),
  )
  particleGeometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(
      particula.colors.flatMap((c) => [c.r, c.g, c.b]),
      3,
    ),
  )
  particleGeometryAleat = new THREE.BufferGeometry().setFromPoints(positions)
  positionsAttrAleat = particleGeometryAleat.getAttribute('position')

  aleatPositions = positionsAttrAleat.array
  particles = new THREE.Points(particleGeometry, particleMaterial) // Cria novos pontos
  scene.add(particles)
  createLetterP(0)
  createLetterP(80)
  createLetterG(190)
  createLetterE(250)
  createLetterE(310)
  createLetterC(410)

  particleWordGeometry = new THREE.BufferGeometry().setFromPoints(positionWord)

  positionsAttribute = particleWordGeometry.getAttribute('position')

  finalPositions = positionsAttribute.array
})
const pointLight = new THREE.PointLight(0x00F00F, 3, 2500000, 0.001);
scene.add(pointLight);



function anima(particlePositions) {

  for (let i = 0; i < quantPart * 3; i += 3) {
    if (!palavra.checked) {
      particlePositions[i] += Math.random() * 2 - 1
      particlePositions[i + 1] += Math.random() * 2 - 1
      particlePositions[i + 2] += Math.random() * 2 - 1
    }
    if (palavra.checked) {
      const newPosition = {
        x: particlePositions[i],
        y: particlePositions[i + 1],
        z: particlePositions[i + 2],
      }

      const finalPosition = {
        x: finalPositions[i],
        y: finalPositions[i + 1],
        z: finalPositions[i + 2],
      }

      newPosition.x += t * (finalPosition.x - newPosition.x)
      newPosition.y += t * (finalPosition.y - newPosition.y)
      newPosition.z += t * (finalPosition.z - newPosition.z)

      particlePositions[i] = newPosition.x
      particlePositions[i + 1] = newPosition.y
      particlePositions[i + 2] = newPosition.z

      const time = performance.now() * 0.001;
      const radius = 3000; 
      const speed = 10; 
      
      const y = Math.cos(time * speed) * radius;
      const z = Math.sin(time * speed) * radius;
      pointLight.position.set(1000, y, z);
      
    }

    if (aleat.checked) {
      const newPosition = {
        x: particlePositions[i],
        y: particlePositions[i + 1],
        z: particlePositions[i + 2],
      }

      const finalPosition = {
        x: aleatPositions[i],
        y: aleatPositions[i + 1],
        z: aleatPositions[i + 2],
      }
      newPosition.x += t * (finalPosition.x - newPosition.x)
      newPosition.y += t * (finalPosition.y - newPosition.y)
      newPosition.z += t * (finalPosition.z - newPosition.z)

      particlePositions[i] = newPosition.x
      particlePositions[i + 1] = newPosition.y
      particlePositions[i + 2] = newPosition.z
    }
  }
}
const clock = new THREE.Clock();
const t = 0.01

const iluminacao2 = new THREE.DirectionalLight(0x0f00ff, 1);
scene.add(iluminacao2);


const assetLoader = new GLTFLoader();

assetLoader.load(blend.href,function(gltf){
  var model = gltf.scene;
  scene.add(model);
  
model.position.set(0,0,0)
//   mixer = new THREE.AnimationMixer(model);
//   const clips = gltf.animations;
//   const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
// const action = mixer.clipAction(clip);
// action.play();

},undefined,function(error){
  console.error(error);

});

function animate() {
  if(mixer)
  mixer.update(clock.getDelta());
  scene.background = new THREE.Color(corEsc.value)
  let particlePositions = particles.geometry.attributes.position.array

  if (clique === true) {
    if (textureMappings[selectedTexture] !== null) {
      let newParticleTexture = new THREE.TextureLoader().load(
        textureMappings[selectedTexture],
      )
      particleMaterial.map = newParticleTexture
    } else {
      let newParticleTexture = textureMappings[selectedTexture]
      particleMaterial.map = newParticleTexture
    }

    clique = false
  }
  anima(particlePositions)

  particles.material.needsUpdate = true
  particles.geometry.attributes.position.needsUpdate = true

  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
