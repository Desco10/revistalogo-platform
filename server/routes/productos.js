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



router.post("/", (req, res) => {

    const { nombre, descripcion, precio, imagen, categoria } = req.body;

    const sql = `
        INSERT INTO productos 
        (nombre, descripcion, precio, imagen, categoria)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nombre, descripcion, precio, imagen, categoria],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err
                });
            }

            res.json({
                message: "Producto creado",
                id: result.insertId
            });

        }
    );

});

module.exports = router;