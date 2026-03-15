const express = require("express");
const router = express.Router();
const db = require("../config/db");

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

  const {
   nombre,
   slug,
   categoria,
   precio,
   precioAntes,
   descuento,
   descripcion,
   imagen,
   oferta,
   carousel
  } = req.body;

  const sql = `
  INSERT INTO productos
  (nombre,slug,categoria,precio,precioAntes,descuento,descripcion,imagen,oferta,carousel)
  VALUES (?,?,?,?,?,?,?,?,?,?)
  `;

  const [result] = await db.query(sql,[
   nombre,
   slug,
   categoria,
   precio,
   precioAntes,
   descuento,
   descripcion,
   imagen,
   oferta,
   carousel
  ]);

  res.json({
   mensaje:"Producto guardado",
   id: result.insertId
  });

 }catch(error){

  console.error(error);
  res.status(500).json({error:"Error guardando producto"});

 }

});

module.exports = router;