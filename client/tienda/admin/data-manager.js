let productos = [];

/* cargar productos desde API */
async function cargarProductos(){

  try{

    const res = await fetch("https://revistalogo-backend.onrender.com/productos");

    productos = await res.json();

    renderizarAdmin();

  }catch(err){

    console.error("Error cargando productos", err);

  }

}


/* guardar todos los productos en la API */

async function guardarCambios(){

  try{

    for(const producto of productos){

      await fetch("https://revistalogo-backend.onrender.com/productos",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify(producto)

      });

    }

    alert("Productos guardados en la base de datos");

  }catch(err){

    console.error(err);

    alert("Error guardando productos");

  }

}
