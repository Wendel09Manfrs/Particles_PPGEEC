import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import bolha from './texturas/bubble.png'
import diamante from './texturas/diamante.png'
import luz from './texturas/luz.png'
import olho from './texturas/olho.png'
import floco from './texturas/floco.png'
import bola from './texturas/bola.png'
import terra from './texturas/terraReal.jpg'
let scene, camera, renderer

let palavra = document.getElementById('formar')
const textureSelect = document.getElementById('textura')
const quantParticle = document.getElementById('qtdParticle')
const botaoText = document.getElementById('mudaTextura')
const botaoQtd = document.getElementById('mudaQtd')
const corEsc = document.getElementById('cor')

let selectedTexture = 'luz'
let quantPart = 1000
let clique = false

const textureMappings = {
  bolha: bolha,
  diamante: diamante,
  luz: luz,
  olho: olho,
  floco: floco,
  bola: bola,
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
  10000,
)
camera.position.z = 400
camera.position.x = 200
camera.position.y = 0

renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const orbit = new OrbitControls(camera, renderer.domElement)
orbit.enablePan = true
orbit.enableRotate = true
orbit.enableZoom = true
const focusPoint = new THREE.Vector3(200, 0, 0) // Altere para o ponto que desejar
orbit.target.copy(focusPoint)

camera.lookAt(new THREE.Vector3(200, 0, 100))

renderer.shadowMap.enabled = true

let positionWord = []

function curva(s, angleQ, pi, num, denx, deny, spacex, spacey) {
  const rotationAngle = Math.PI / angleQ // Ângulo de rotação (90 graus)
  // Adicionando pontos para a parte curva da letra "C" com rotação
  for (let i = 0; i < num; i++) {
    const angle = (i / num) * Math.PI * pi // Distribuir pontos ao longo de um semicírculo
    const rotatedAngle = angle + rotationAngle // Adicionar o ângulo de rotação
    const x = (40 / denx) * Math.cos(rotatedAngle) + Math.random() * 20 + spacex
    const y = (40 / deny) * Math.sin(rotatedAngle) + Math.random() * 20 + spacey
    const z = Math.random() * 20 // Deslocamento vertical para alinhar a curva ao restante da letra
    positionWord.push(new THREE.Vector3(y + s, x, z))
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
  curva(s, 0.5, 1, quantPart / 10, 1.5, 1, 55, 10)
  reta(s, quantPart / 10, 20, 100, 20, 0, 0)
}

function createLetterG(s) {
  curva(s, 0.39, 1.7, quantPart / 5, 1, 1.2, 40, 0)
  reta(s, quantPart / 50, 35, 20, 20, 15, 30)
}

function createLetterE(s) {
  reta(s, quantPart / 10, 20, 100, 20, 0, 0)
  reta(s, quantPart / 40, 30, 20, 20, 20, 0)
  reta(s, quantPart / 40, 30, 20, 20, 20, 40)
  reta(s, quantPart / 40, 30, 20, 20, 20, 80)
}
function createLetterC(s) {
  curva(s, 0.36, 1.4, quantPart / 5, 1, 1.1, 40, 0)
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

function AleatParticle(qtd) {
  let positions = []
  let colors = []
  for (let i = 0; i < qtd * 1.17; i++) {
    const theta = Math.random() * Math.PI * 2 // ângulo azimutal
    const phi = Math.acos(2 * Math.random() - 1) // ângulo de inclinação

    const radius = Math.cbrt(Math.random()) * 1000 
    const x = 150 + radius * Math.sin(phi) * Math.cos(theta)
    const y = 50 + radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    positions.push(x, y, z)

    if (i % 2 === 1) {
      let color = corAleatoria()
      colors.push(color.r, color.g, color.b)
  
    } else {
      let color = corAleatoria() 
      color.setHSL(i / qtd, 1, 1)
      colors.push(color.r, color.g, color.b)
    }
  }
  return { positions, colors }
}

let particleGeometry = new THREE.BufferGeometry()
let particula = AleatParticle(quantPart)
particleGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(particula.positions, 3),
)
particleGeometry.setAttribute(
  'color',
  new THREE.Float32BufferAttribute(particula.colors, 3),
)

const particleTexture = new THREE.TextureLoader().load(
  textureMappings[selectedTexture],
)

const particleMaterial = new THREE.PointsMaterial({
  size: 6,
  vertexColors: true,
  map: particleTexture,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
})

let particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

botaoQtd.addEventListener('click', function () {
  quantPart = quantParticle.value
  scene.remove(particles) // Remove os pontos da cena

  particula = AleatParticle(quantPart)
  particleGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(particula.positions, 3),
  )
  particleGeometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(particula.colors, 3),
  )

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

function animate() {
  scene.background = new THREE.Color(corEsc.value)
  let particlePositions = particles.geometry.attributes.position.array

  for (let i = 0; i < quantPart * 1.17 * 3; i += 3) {
    if (!palavra.checked) {
      particlePositions[i] += Math.random() * 2 - 1
      particlePositions[i + 1] += Math.random() * 2 - 1
      particlePositions[i + 2] += Math.random() * 2 - 1
    }

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

    if (palavra.checked) {
      let movementSpeed = 1
      for (let j = i; j < i + 3; j++) {
        const diff = finalPositions[j] - particlePositions[j]
        if (particlePositions[j] !== finalPositions[j]) {
          if (Math.abs(diff) <= movementSpeed) {
            particlePositions[j] = finalPositions[j]
          } else {
            particlePositions[j] += Math.sign(diff) * movementSpeed
          }
        }
      }
    }
  }

  particles.material.needsUpdate = true
  particles.geometry.attributes.position.needsUpdate = true

  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
