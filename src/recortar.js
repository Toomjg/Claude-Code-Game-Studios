const { Jimp } = require('jimp');
const path = require('path');

// Coordenadas en imagen 2048x2048
// Cada personaje: [x, y, ancho, alto]
const personajes = [
  { nombre: 'gustavo',  x: 100, y: 60, w: 330, h: 1650 }, // obrero, izquierda
  { nombre: 'julian',   x: 470, y: 60, w: 300, h: 1650 }, // joven hoodie
  { nombre: 'rodrigo',  x: 790, y: 60, w: 360, h: 1650 }, // traje azul, centro
  { nombre: 'valeria',  x:1100, y: 60, w: 360, h: 1650 }, // mujer abrigo camel
  { nombre: 'marina',   x:1460, y: 60, w: 350, h: 1650 }, // lentes negros, derecha
];

const SRC  = path.join(__dirname, 'assets/characters/grupo.jpg');
const DEST = path.join(__dirname, 'assets/characters');

async function recortar() {
  console.log('Cargando imagen...');
  const img = await Jimp.read(SRC);
  console.log(`Imagen: ${img.width}x${img.height}`);

  for (const p of personajes) {
    const recorte = img.clone()
      .crop({ x: p.x, y: p.y, w: p.w, h: p.h })
      .resize({ w: 280, h: 560 });

    const destino = path.join(DEST, `${p.nombre}.jpg`);
    await recorte.write(destino);
    console.log(`✓ ${p.nombre}.jpg`);
  }

  console.log('\nListo. Revisá assets/characters/');
}

recortar().catch(console.error);
