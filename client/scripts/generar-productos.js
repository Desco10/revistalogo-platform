const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

// 🔥 DOMINIO ACTUAL
const dominio = "https://plataformarevis.netlify.app";

// 🔥 API BACKEND
const API_URL = "https://revistalogo-backend.onrender.com/productos";

// rutas
const templatePath = path.join(__dirname, "../tienda/templates/producto.html");
const outputDir = path.join(__dirname, "../tienda/producto");

// verificar template
if (!fs.existsSync(templatePath)) {
  console.error("❌ No se encontró el template producto.html");
  process.exit(1);
}

// crear carpeta si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// limpiar html antiguos
fs.readdirSync(outputDir).forEach(file => {
  if (file.endsWith(".html")) {
    fs.unlinkSync(path.join(outputDir, file));
  }
});

console.log("🧹 Carpeta de productos limpiada");

// 🔥 obtener productos desde backend REAL
async function getProductos() {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (error) {
    console.error("❌ Error obteniendo productos:", error);
    return [];
  }
}

// 🔥 generar páginas
(async () => {

  const productos = await getProductos();
  const template = fs.readFileSync(templatePath, "utf8");

  productos.forEach(prod => {

    if (!prod.slug || !prod.nombre) {
      console.warn("⚠ Producto inválido:", prod);
      return;
    }

    // 🔥 URL LIMPIA (SIN .html)
    const urlProducto = `${dominio}/p/${prod.slug}`;

    // 🔥 IMAGEN OG CORRECTA
    const imagenOG = prod.imagen
      ? prod.imagen.startsWith("http")
        ? prod.imagen
        : `https://revistalogo-backend.onrender.com${prod.imagen}`
      : `${dominio}/img/default.jpg`;

    // 🔥 WHATSAPP
    const mensaje = encodeURIComponent(
      `Hola, quiero comprar este producto: ${prod.nombre} ${urlProducto}`
    );

    const whatsapp = `https://wa.me/573246030396?text=${mensaje}`;

    // 🔥 reemplazos en template
    let html = template
      .replace(/{{NOMBRE}}/g, prod.nombre)
      .replace(/{{PRECIO}}/g, prod.precio)
      .replace(/{{DESCRIPCION}}/g, prod.descripcion || "")
      .replace(/{{IMAGEN}}/g, imagenOG)
      .replace(/{{IMAGENOG}}/g, imagenOG)
      .replace(/{{URL}}/g, urlProducto)
      .replace(/{{SLUG}}/g, prod.slug)
      .replace(/{{WHATSAPP}}/g, whatsapp);

    const outputFile = path.join(outputDir, `${prod.slug}.html`);

    fs.writeFileSync(outputFile, html);

    console.log("✔ Producto generado:", prod.slug);

  });

  console.log("🚀 Todos los productos fueron generados correctamente.");

})();