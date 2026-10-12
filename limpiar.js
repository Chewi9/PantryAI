const fs = require('fs');
const path = require('path');

// Apuntamos a tus dos carpetas
const carpetas = [
  path.join(__dirname, 'public', 'img'),
  path.join(__dirname, 'public', 'gif')
];

let contador = 0;

carpetas.forEach(carpeta => {
  if (fs.existsSync(carpeta)) {
    fs.readdirSync(carpeta).forEach(archivo => {
      // Busca archivos con guion (ej: 0001-2gPfomN.gif)
      if (archivo.match(/^\d+-/)) {
        const numero = archivo.split('-')[0]; // Se queda con "0001"
        const extension = archivo.split('.')[1]; // Se queda con "gif" o "jpg"
        const nuevoNombre = `${numero}.${extension}`;
        
        fs.renameSync(
          path.join(carpeta, archivo),
          path.join(carpeta, nuevoNombre)
        );
        contador++;
      }
    });
  }
});

console.log(`¡Listo! Se han limpiado ${contador} fotos y GIFs automáticamente.`);