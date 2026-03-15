const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const productosRoutes = require("./routes/productos");


// middlewares
app.use(cors());
app.use(express.json());
app.use("/productos", productosRoutes);

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
