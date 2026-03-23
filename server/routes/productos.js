const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../middleware/upload");
// obtener todos los productos
router.get("/", async (req, res) => {
  try {

    const [rows] = await db.query("SELECT * FROM productos");

    res.json(rows);

  } catch (error) {

    console.error("ERROR MYSQL:", error);

    res.status(500).json({
      error: "Error obteniendo productos"
    });

  }
});



router.post("/", async (req,res)=>{ 

try{

const producto = req.body;

// 🔴 VALIDACIÓN BÁSICA
if(!producto.nombre || !producto.slug){
  return res.status(400).json({
    error:"Nombre y slug son obligatorios"
  });
}

// 🔴 VALIDAR SLUG ÚNICO
const [slugExiste] = await db.query(
"SELECT id FROM productos WHERE slug=?",
[producto.slug]
);

if(slugExiste.length > 0){
  return res.status(400).json({
    error:"Slug ya existe"
  });
}

// 🟢 INSERT LIMPIO
const [result] = await db.query(

`INSERT INTO productos
(nombre,slug,categoria,precio,precioAntes,descuento,descripcion,imagen,oferta,carousel)
VALUES (?,?,?,?,?,?,?,?,?,?)`,

[
producto.nombre,
producto.slug,
producto.categoria || null,
producto.precio || 0,
producto.precioAntes || 0,
producto.descuento || 0,
producto.descripcion || null,
producto.imagen || null,
producto.oferta ? 1 : 0,     // 🔴 importante
producto.carousel ? 1 : 0    // 🔴 importante
]

);

res.json({
success:true,
id:result.insertId
});

}catch(err){

console.error("ERROR MYSQL:", err);

res.status(500).json({
error:"Error creando producto",
detalle: err.message
});

}

});

router.get("/slug/:slug", async (req, res) => {

try{

const slug = req.params.slug;

const [rows] = await db.query(
"SELECT * FROM productos WHERE slug=?",
[slug]
);

if(rows.length === 0){

return res.status(404).json({
error:"Producto no encontrado"
});

}

res.json(rows[0]);

}catch(err){

console.error(err);

res.status(500).json({
error:"Error servidor"
});

}

});




router.get("/p/:slug", async (req,res)=>{

try{

const slug = req.params.slug;

const [rows] = await db.query(
"SELECT * FROM productos WHERE slug=?",
[slug]
);

if(rows.length === 0){

return res.send("Producto no encontrado");

}

const producto = rows[0];

res.send(`

<!DOCTYPE html>
<html>

<head>

<title>${producto.nombre}</title>

<meta property="og:title" content="${producto.nombre}">
<meta property="og:description" content="${producto.descripcion}">
<meta property="og:image" content="${producto.imagen}">
<meta property="og:type" content="product">

<meta http-equiv="refresh"
content="0; url=/tienda/producto.html?slug=${producto.slug}" />

</head>

<body>

Redirigiendo...

</body>

</html>

`);

}catch(err){

console.error(err);

res.send("Error servidor");

}

});

/*validar update*/
router.put("/:id", async (req, res) => {
  try {

    const { id } = req.params;
    const producto = req.body;

    // 1. Verificar que el producto exista
    const [existe] = await db.query(
      "SELECT * FROM productos WHERE id = ?",
      [id]
    );

    if (existe.length === 0) {
      return res.status(404).json({
        error: "Producto no existe"
      });
    }

    // 2. Validar slug único (si viene)
    if (producto.slug) {
      const [slugExiste] = await db.query(
        "SELECT id FROM productos WHERE slug = ? AND id != ?",
        [producto.slug, id]
      );

      if (slugExiste.length > 0) {
        return res.status(400).json({
          error: "Slug ya existe"
        });
      }
    }

    // 3. Normalizar datos (evita bugs frontend)
    const data = {
      nombre: producto.nombre || existe[0].nombre,
      slug: producto.slug || existe[0].slug,
      categoria: producto.categoria || existe[0].categoria,
      precio: producto.precio || existe[0].precio,
      precioAntes: producto.precioAntes || existe[0].precioAntes,
      descuento: producto.descuento || existe[0].descuento,
      descripcion: producto.descripcion || existe[0].descripcion,
      imagen: producto.imagen || existe[0].imagen,
      oferta: producto.oferta ? 1 : 0,
      carousel: producto.carousel ? 1 : 0
    };

    // 4. Update seguro
    await db.query(
      `UPDATE productos SET
        nombre=?,
        slug=?,
        categoria=?,
        precio=?,
        precioAntes=?,
        descuento=?,
        descripcion=?,
        imagen=?,
        oferta=?,
        carousel=?
      WHERE id=?`,
      [
        data.nombre,
        data.slug,
        data.categoria,
        data.precio,
        data.precioAntes,
        data.descuento,
        data.descripcion,
        data.imagen,
        data.oferta,
        data.carousel,
        id
      ]
    );

    res.json({
      success: true,
      message: "Producto actualizado correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error actualizando producto"
    });

  }
});


router.post("/upload", upload.single("imagen"), (req,res)=>{

try{

const imageUrl =
`https://revistalogo-backend.onrender.com/uploads/${req.file.filename}`;

res.json({
success:true,
url:imageUrl
});

}catch(err){

console.error(err);

res.status(500).json({
error:"Error subiendo imagen"
});

}

});




router.delete("/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM productos WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json({
      success: true,
      message: "Producto eliminado"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error eliminando producto"
    });

  }
});

module.exports = router;