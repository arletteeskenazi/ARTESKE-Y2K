// ======================
// ESCENA
// ======================

const scene = new THREE.Scene();

const camera =
new THREE.PerspectiveCamera(
45,
window.innerWidth /
window.innerHeight,
0.1,
1000
);

camera.position.z = 120;

// ======================
// RENDER
// ======================

const renderer =
new THREE.WebGLRenderer({

antialias:true,
alpha:true

});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.setPixelRatio(
window.devicePixelRatio
);

document.body.appendChild(
renderer.domElement);

// ======================
// LUCES Y2K 
// ======================

const ambientLight =
new THREE.AmbientLight(
0xffffff,
2
);

scene.add(
ambientLight
);

const mainLight =
new THREE.DirectionalLight(
0xffffff,
3
);

mainLight.position.set(
0,
0,
50
);

scene.add(
mainLight
);

const pinkGlow =
new THREE.PointLight(
0xff77aa,
5,
200
);

pinkGlow.position.set(
20,
10,
20
);

scene.add(
pinkGlow
);

const redGlow =
new THREE.PointLight(
0x5c0012,
7,
200
);

redGlow.position.set(
-20,
-10,
20
);

scene.add(
redGlow
);

// ======================
// ESTRELLITAS Y2K
// ======================

const stars = [];

function createStar(){

const geometry =
new THREE.BufferGeometry();

geometry.setAttribute(
'position',
new THREE.Float32BufferAttribute(
[0,0,0],
3
)
);

const material =
new THREE.PointsMaterial({

size:
Math.random()*0.35+0.08,

color:
new THREE.Color(
1,
Math.random()*0.2+0.8,
Math.random()*0.2+0.9
),

transparent:true,
opacity:
Math.random()*0.7+0.4

});

const star =
new THREE.Points(
geometry,
material
);

star.position.set(

(Math.random()-0.5)*500,

(Math.random()-0.5)*250,

(Math.random()-0.5)*100

);

star.speed =
Math.random()*0.04+0.005;

scene.add(star);

stars.push(star);

}

for(let i=0;i<1800;i++){
createStar();
}

// ======================
// LOGO SVG
// ======================

const loader =
new THREE.SVGLoader();

const logoGroup =
new THREE.Group();

scene.add(
logoGroup
);

// rebote MUCHO MÁS GRANDE

let velocity = {

x:0.38,
y:0.20

};

loader.load(
'arteske.png.svg',

function(data){

const materialFront =
new THREE.MeshPhysicalMaterial({

color:0x7a0014,

metalness:0.9,

roughness:0.08,

clearcoat:1,

clearcoatRoughness:0.03

});

const materialSide =
new THREE.MeshPhysicalMaterial({

color:0x430008,

metalness:0.7,

roughness:0.2

});

// OJO: SIN geometry.center()

data.paths.forEach(path=>{

const shapes =
path.toShapes(true);

shapes.forEach(shape=>{

const geometry =
new THREE.ExtrudeGeometry(

shape,

{

depth:10,

bevelEnabled:true,

bevelThickness:1.5,

bevelSize:0.8,

bevelSegments:10

}

);

const mesh =
new THREE.Mesh(

geometry,

[
materialFront,
materialSide
]

);

logoGroup.add(
mesh
);

});

});

// centra TODO el grupo
const box =
new THREE.Box3()
.setFromObject(
logoGroup
);

const center =
box.getCenter(
new THREE.Vector3()
);

logoGroup.position.sub(
center
);

// tamaño correcto
logoGroup.scale.set(
0.065,
-0.065,
0.065
);

// empieza al centro
logoGroup.position.set(
0,
14,
0
);

}
);

// ======================
// ANIMACIÓN
// ======================

function animate(){

requestAnimationFrame(
animate
);

// REBOTE GRANDE

logoGroup.position.x +=
velocity.x;

logoGroup.position.y +=
velocity.y;

// TODA LA PANTALLA

// límites dinámicos según pantalla

const limitX =
window.innerWidth < 768
? 18
: 34;

const limitY =
window.innerWidth < 768
? 5
: 12;

if(
logoGroup.position.x >
limitX ||
logoGroup.position.x <
-limitX
){

velocity.x *= -1;

}

if(
logoGroup.position.y >
limitY ||
logoGroup.position.y <
-limitY
){

velocity.y *= -1;

}

// giro elegante
logoGroup.rotation.y +=
0.005;

logoGroup.rotation.x =
Math.sin(
Date.now()*0.001
)*0.03;

// estrellas

stars.forEach(star=>{

star.position.y +=
star.speed;

if(
star.position.y > 120
){

star.position.y =
-120;

star.position.x =
(Math.random()-0.5)
*500;

}

});

renderer.render(
scene,
camera
);

}

animate();

// ======================
// RESPONSIVE
// ======================

window.addEventListener(
'resize',
()=>{

camera.aspect =
window.innerWidth /
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

});