const fs = require("fs");
const path = require("path");

const dominio = "https://revistalogo.netlify.app";

// rutas
const productosPath = path.join(__dirname, "../tienda/data/productos.json");
const templatePath = path.join(__dirname, "../tienda/templates/producto.html");
const outputDir = path.join(__dirname, "../tienda/producto");

// verificar archivos
if (!fs.existsSync(productosPath)) {
  console.error("❌ No se encontró productos.json");
  process.exit(1);
}

if (!fs.existsSync(templatePath)) {
  console.error("❌ No se encontró el template producto.html");
  process.exit(1);
}

// crear carpeta si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// cargar datos
const productos = JSON.parse(fs.readFileSync(productosPath, "utf8"));
const template = fs.readFileSync(templatePath, "utf8");

// limpiar html antiguos
fs.readdirSync(outputDir).forEach(file => {
  if (file.endsWith(".html")) {
    fs.unlinkSync(path.join(outputDir, file));
  }
});

console.log("🧹 Carpeta de productos limpiada");

// generar páginas
productos.forEach(prod => {

  if (!prod.slug || !prod.nombre) {
    console.warn("⚠ Producto inválido:", prod);
    return;
  }

  const urlProducto = `${dominio}/p/${prod.slug}`;
  const imagenOG = `${dominio}${prod.imagen}`;

  const mensaje = encodeURIComponent(
    `Hola como esta , quiero comprar este producto: ${prod.nombre} ${urlProducto}`
  );

  const whatsapp = `https://wa.me/573246030396?text=${mensaje}`;

  let html = template
    .replace(/{{NOMBRE}}/g, prod.nombre)
    .replace(/{{PRECIO}}/g, prod.precio)
    .replace(/{{DESCRIPCION}}/g, prod.descripcion || "")
    .replace(/{{IMAGEN}}/g, prod.imagen)
    .replace(/{{IMAGENOG}}/g, imagenOG)
    .replace(/{{URL}}/g, urlProducto)
    .replace(/{{SLUG}}/g, prod.slug)
    .replace(/{{WHATSAPP}}/g, whatsapp);

  const outputFile = path.join(outputDir, `${prod.slug}.html`);

  fs.writeFileSync(outputFile, html);

  console.log("✔ Producto generado:", prod.slug);
});

console.log("🚀 Todos los productos fueron generados correctamente.");