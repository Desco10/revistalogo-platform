const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();



const productosRoutes = require("./routes/productos");


// middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static("uploads"));

// rutas API
app.use("/productos", productosRoutes);


// ruta pública para compartir producto (slug)
app.use("/", productosRoutes);


// ruta de prueba
app.get("/", (req, res) => {
    res.json({
        message: "API REVISTALOGO funcionando 🚀"
    });
});


// puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});


app.get("/p/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    const [rows] = await db.query(
      "SELECT * FROM productos WHERE slug = ?",
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).send("Producto no encontrado");
    }

    const producto = rows[0];

    const imagen = producto.imagen
      ? producto.imagen.startsWith("http")
        ? producto.imagen
        : `https://revistalogo-backend.onrender.com${producto.imagen}`
      : "https://plataformarevis.netlify.app/img/default.jpg";

    const url = `https://plataformarevis.netlify.app/p/${producto.slug}`;

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">

        <title>${producto.nombre}</title>

        <meta property="og:title" content="${producto.nombre}" />
        <meta property="og:description" content="${producto.descripcion || ""}" />
        <meta property="og:image" content="${imagen}" />
        <meta property="og:url" content="${url}" />
        <meta property="og:type" content="product" />

        <script>
          window.location.href = "${url}";
        </script>
      </head>
      <body></body>
      </html>
    `);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error servidor");
  }
});