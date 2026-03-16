const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../middleware/upload");
// obtener todos los productos
router.get("/", (req, res) => {

    const sql = "SELECT * FROM productos";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err
            });
        }

        res.json(result);

    });

});



router.post("/", async (req,res)=>{

try{

const producto = req.body;

const [slugExiste] = await db.query(
"SELECT id FROM productos WHERE slug=?",
[producto.slug]
);

if(slugExiste.length > 0){

return res.status(400).json({
error:"Slug ya existe"
});

}

const [result] = await db.query(

`INSERT INTO productos
(nombre,slug,categoria,precio,precioAntes,descuento,descripcion,imagen,oferta,carousel)
VALUES (?,?,?,?,?,?,?,?,?,?)`,

[
producto.nombre,
producto.slug,
producto.categoria,
producto.precio,
producto.precioAntes,
producto.descuento,
producto.descripcion,
producto.imagen,
producto.oferta,
producto.carousel
]

);

res.json({
success:true,
id:result.insertId
});

}catch(err){

console.error(err);

res.status(500).json({
error:"Error creando producto"
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


/* Validación en UPDATE*/

router.put("/:id", async (req,res)=>{

try{

const id = req.params.id;
const producto = req.body;

// validar slug duplicado
const [slugExiste] = await db.query(
"SELECT id FROM productos WHERE slug=? AND id!=?",
[producto.slug, id]
);

if(slugExiste.length > 0){

return res.status(400).json({
error:"Slug ya existe"
});

}

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
producto.nombre,
producto.slug,
producto.categoria,
producto.precio,
producto.precioAntes,
producto.descuento,
producto.descripcion,
producto.imagen,
producto.oferta,
producto.carousel,
id
]

);

res.json({
success:true
});

}catch(err){

console.error(err);

res.status(500).json({
error:"Error actualizando producto"
});

}

});


router.post("/upload", upload.single("imagen"), (req,res)=>{

try{

const imageUrl =
`http://localhost:3000/uploads/${req.file.filename}`;

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



module.exports = router;