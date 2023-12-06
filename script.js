import * as THREE from 'three'

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
const selecionarText = document.getElementById('textura')
const quantParticle = document.getElementById('qtdParticle')
const botaoText = document.getElementById('mudaTextura')
const botaoQtd = document.getElementById('mudaQtd')
const corEsc = document.getElementById('cor')
const corGaiola = document.getElementById('corGaiola')

let textEscol = 'luz'
let quantPart = 5000
let clique = false

const textuMap = {
  bolha: bolha,
  diamante: diamante,
  luz: luz,
  olho: olho,
  floco: floco,
  estrela: estrela,
  semTextura: null,
}

selecionarText.addEventListener('change', function () {
  textEscol = selecionarText.value
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
camera.position.x = 0
camera.position.y = 0

renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.sortObjects = false;
const orbit = new OrbitControls(camera, renderer.domElement)
orbit.enablePan = true
orbit.enableRotate = true
orbit.enableZoom = true
const focusPoint = new THREE.Vector3(0, 50, 0) // Altere para o ponto que desejar
orbit.target.copy(focusPoint)

camera.lookAt(new THREE.Vector3(0, 50, 0))

renderer.shadowMap.enabled = true
let posiPalavra = []
let posiGaioMini = [];


function curva(s, angulo, pi, num, deny, denx, areay, areax) {
  const rotAngulo = Math.PI / angulo // Ângulo de rotação (90 graus)
  // Adicionando pontos para a parte curva da letra "C" com rotação
  for (let i = 0; i < num; i++) {
    const angPart = (i / num) * Math.PI * pi // pontos ao longo de um semicírculo
    const angRotacionado = angPart + rotAngulo // Adicionar o ângulo de rotação
    const x = (40 / denx) * Math.sin(angRotacionado) + Math.random() * 20 + areax
    /////
    const y = (40 / deny) * Math.cos(angRotacionado) + Math.random() * 20 + areay
    ////
    const z = Math.random() * 20 // Deslocamento vertical para alinhar a curva ao restante da letra
    posiPalavra.push(new THREE.Vector3(x + s, y, z))
  }
}

function reta(s, num, areax, areay, areaz, a, b) {
  // Adicionando pontos para a parte reta da letra P
  for (let i = 0; i < num; i++) {
    const x = Math.random() * areax + a
    const y = Math.random() * areay + b
    const z = Math.random() * areaz
    posiPalavra.push(new THREE.Vector3(x + s, y, z))
  }
}

function criaLetraP(s) {
  curva(s, 0.5, 1, quantPart / 10, 1.5, 1, 55, 10) //2000 2000
  reta(s, quantPart / 10, 20, 100, 20, 0, 0)
}

function criaLetraG(s) {
  curva(s, 0.39, 1.7, quantPart / 8, 1, 1.2, 40, 0) //1250 + 200
  reta(s, quantPart / 50, 35, 20, 20, 15, 30)
}

function criaLetraE(s) {
  reta(s, quantPart / 10, 20, 100, 20, 0, 0) //1600 1600
  reta(s, quantPart / 50, 30, 20, 20, 20, 0)
  reta(s, quantPart / 40, 30, 20, 20, 15, 40)
  reta(s, quantPart / 50, 30, 20, 20, 20, 80)
}
function criaLetraC(s) {
  curva(s, 0.36, 1.4, quantPart / 8, 1, 1.1, 40, 0) //1250
}


criaLetraP(-225)
criaLetraP(-145)
criaLetraG(-35)
criaLetraE(25)
criaLetraE(85)
criaLetraC(185)

function corAleatoria() {
  const r = Math.random()
  const g = Math.random()
  const b = Math.random()
  return new THREE.Color(r, g, b)
}
function gaiola() {
  posiGaioMaior = []

  for (let i = 0; i < 7000; i++) {
    const phi = Math.acos(1 - 2 * Math.random()) // ângulo de inclinação
    const theta = 2 * Math.PI * i / 80 // ângulo azimutal

    const raio = 2000// raio da esfera oca
    const x = raio * Math.sin(phi) * Math.cos(theta)
    const y = 50+raio * Math.sin(phi) * Math.sin(theta)
    const z = raio * Math.cos(phi)

    posiGaioMaior.push(new THREE.Vector3(x, y, z))
  }
  return { posiGaioMaior}
}


function gaiolaFinal() {
  posiGaioMini = []

  for (let i = 0; i < 5000; i++) {
    const phi = Math.acos(1 - 2 * Math.random()) // ângulo de inclinação
    const theta = 2 * Math.PI * i / 40 // ângulo azimutal

    const raio = 130// raio da esfera oca
    const x = 2*raio * Math.sin(phi) * Math.cos(theta)
    const y = 50+raio * Math.sin(phi) * Math.sin(theta)
    const z = raio/2 * Math.cos(phi)

    posiGaioMini.push(new THREE.Vector3(x, y, z))
  }
}
gaiolaFinal()

let partPalavraGeom = new THREE.BufferGeometry().setFromPoints(
  posiPalavra,
)

let posicoesPalavraAtrib = partPalavraGeom.getAttribute('position')
let arrayPosPalavra = posicoesPalavraAtrib.array

let partGaioMiniGeom = new THREE.BufferGeometry().setFromPoints(
  posiGaioMini,
)

let posGaioMiniAtrib = partGaioMiniGeom.getAttribute('position')
let arrayPosGaioMini = posGaioMiniAtrib.array

let posInt = []
let posiGaioMaior = []
function AleatParticle(qtd) {
  posInt = []
  let colors = []
  for (let i = 0; i < qtd; i++) {
    const theta = Math.random() * Math.PI * 2 // ângulo azimutal
    const phi = Math.acos(2 * Math.random() - 1) // ângulo de inclinação

    const raio = Math.cbrt(Math.random()) * 2000
    const x = raio * Math.sin(phi) * Math.cos(theta)
    const y = 50+raio * Math.sin(phi) * Math.sin(theta)
    const z = raio * Math.cos(phi)

    posInt.push(new THREE.Vector3(x, y, z))
    let color = corAleatoria()
    colors.push(color)
  }
  return { posInt, colors }
}


const particula = AleatParticle(quantPart)
let particulaGeom = new THREE.BufferGeometry()
particulaGeom.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(
    particula.posInt.flatMap((v) => [v.x, v.y, v.z]),
    3,
  ),
)

const particula2 = gaiola()
let particulaGeomGaio = new THREE.BufferGeometry()
particulaGeomGaio.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(
    particula2.posiGaioMaior.flatMap((v) => [v.x, v.y, v.z]),
    3,
  ),
)

particulaGeom.setAttribute(
  'color',
  new THREE.Float32BufferAttribute(
    particula.colors.flatMap((c) => [c.r, c.g, c.b]),
    3,
  ),
)

let particulaGeomAleat = new THREE.BufferGeometry().setFromPoints(posInt)

let posIntAttrAleat = particulaGeomAleat.getAttribute('position')

let aleatPosArray = posIntAttrAleat.array

let partGeometrGaioMaior = new THREE.BufferGeometry().setFromPoints(posiGaioMaior)

let posicoesAtribuGaio = partGeometrGaioMaior.getAttribute('position')

let arrayPosGaioMaior = posicoesAtribuGaio.array

const particleTexture = new THREE.TextureLoader().load(
  textuMap[textEscol],
)

const partMaterialAleat = new THREE.PointsMaterial({
  size: 5,
  vertexColors: true,
  map:particleTexture,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent:false
})

const partMaterialGaiola = new THREE.PointsMaterial({
  size: 8,
  map:particleTexture,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent:false
})

let particulasInter = new THREE.Points(particulaGeom, partMaterialAleat)
scene.add(particulasInter)


let partGaiola = new THREE.Points(particulaGeomGaio, partMaterialGaiola)
scene.add(partGaiola)

botaoQtd.addEventListener('click', function () {
  quantPart = quantParticle.value
  scene.remove(particulasInter)
  posiPalavra = []

  let particula = AleatParticle(quantPart)
  let particulaGeom = new THREE.BufferGeometry()
  particulaGeom.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      particula.posInt.flatMap((v) => [v.x, v.y, v.z]),
      3,
    ),
  )
  particulaGeom.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(
      particula.colors.flatMap((c) => [c.r, c.g, c.b]),
      3,
    ),
  )
  particulaGeomAleat = new THREE.BufferGeometry().setFromPoints(posInt)
  posIntAttrAleat = particulaGeomAleat.getAttribute('position')

  aleatPosArray = posIntAttrAleat.array
  particulasInter = new THREE.Points(particulaGeom, partMaterialAleat) // Cria novos pontos
  scene.add(particulasInter)
  criaLetraP(-225)
  criaLetraP(-145)
  criaLetraG(-35)
  criaLetraE(25)
  criaLetraE(85)
  criaLetraC(185)

  partPalavraGeom = new THREE.BufferGeometry().setFromPoints(posiPalavra)

  posicoesAtrib = partPalavraGeom.getAttribute('position')

  arrayPosPalavra = posicoesAtrib.array
})

function anima(partPosIntRecent) {
  for (let i = 0; i < partPosIntRecent.length; i += 3) {
    if (!palavra.checked) {
      partPosIntRecent[i] += Math.random() * 2 - 1
      partPosIntRecent[i + 1] += Math.random() * 2 - 1
      partPosIntRecent[i + 2] += Math.random() * 2 - 1
    }
    if (palavra.checked) {
      const novaPos = {
        x: partPosIntRecent[i],
        y: partPosIntRecent[i + 1],
        z: partPosIntRecent[i + 2],
      }

      const finalPosition = {
        x: arrayPosPalavra[i],
        y: arrayPosPalavra[i + 1],
        z: arrayPosPalavra[i + 2],
      }

      novaPos.x += t * (finalPosition.x - novaPos.x)
      novaPos.y += t * (finalPosition.y - novaPos.y)
      novaPos.z += t * (finalPosition.z - novaPos.z)

      partPosIntRecent[i] = novaPos.x
      partPosIntRecent[i + 1] = novaPos.y
      partPosIntRecent[i + 2] = novaPos.z
 
    }

    if (aleat.checked) {
      const novaPos = {
        x: partPosIntRecent[i],
        y: partPosIntRecent[i + 1],
        z: partPosIntRecent[i + 2],
      }

      const finalPosition = {
        x: aleatPosArray[i],
        y: aleatPosArray[i + 1],
        z: aleatPosArray[i + 2],
      }
      novaPos.x += t * (finalPosition.x - novaPos.x)
      novaPos.y += t * (finalPosition.y - novaPos.y)
      novaPos.z += t * (finalPosition.z - novaPos.z)

      partPosIntRecent[i] = novaPos.x
      partPosIntRecent[i + 1] = novaPos.y
      partPosIntRecent[i + 2] = novaPos.z
    }
  }
}

const t = 0.01
function diminuiGaiola(partPosGaioRecent) {
  for (let i = 0; i < partPosGaioRecent.length; i += 3) {
    if (palavra.checked) {
      const novaPos2 = {
        x: partPosGaioRecent[i],
        y: partPosGaioRecent[i + 1],
        z: partPosGaioRecent[i + 2],
      }
      const finalPosition = {
        x: arrayPosGaioMini[i],
        y: arrayPosGaioMini[i + 1],
        z: arrayPosGaioMini[i + 2],
      }
      novaPos2.x += t * (finalPosition.x - novaPos2.x)
      novaPos2.y += t * (finalPosition.y - novaPos2.y)
      novaPos2.z += t * (finalPosition.z - novaPos2.z)

      partPosGaioRecent[i] = novaPos2.x
      partPosGaioRecent[i + 1] = novaPos2.y
      partPosGaioRecent[i + 2] = novaPos2.z
 
    }

    if (aleat.checked) {
      const novaPos2 = {
        x: partPosGaioRecent[i],
        y: partPosGaioRecent[i + 1],
        z: partPosGaioRecent[i + 2],
      }

      const finalPosition2 = {
        x: arrayPosGaioMaior[i],
        y: arrayPosGaioMaior[i + 1],
        z: arrayPosGaioMaior[i + 2],
      }
      novaPos2.x += t * (finalPosition2.x - novaPos2.x)
      novaPos2.y += t * (finalPosition2.y - novaPos2.y)
      novaPos2.z += t * (finalPosition2.z - novaPos2.z)

      partPosGaioRecent[i] = novaPos2.x
      partPosGaioRecent[i + 1] = novaPos2.y
      partPosGaioRecent[i + 2] = novaPos2.z
    }
}
}
function animate() {

  scene.background = new THREE.Color(corEsc.value)
  partGaiola.material.color.set(corGaiola.value);
  let partPosIntRecent = particulasInter.geometry.attributes.position.array
  let partPosGaioRecent = partGaiola.geometry.attributes.position.array

  if (clique === true) {
    if (textuMap[textEscol] !== null) {
      let novaTextura = new THREE.TextureLoader().load(
        textuMap[textEscol],
      )
      partMaterialAleat.map = novaTextura
    } else {
      let novaTextura = textuMap[textEscol]
      partMaterialAleat.map = novaTextura
    }

    clique = false
  }
  anima(partPosIntRecent)
  diminuiGaiola(partPosGaioRecent)
  particulasInter.material.needsUpdate = true
  particulasInter.geometry.attributes.position.needsUpdate = true

  partGaiola.material.needsUpdate = true
  partGaiola.geometry.attributes.position.needsUpdate = true

  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()
