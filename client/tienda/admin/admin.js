// ===============================
// INICIO
// ===============================
cargarProductos();

function mostrarSeccion(id){
  document.querySelectorAll(".seccion")
  .forEach(s => s.classList.add("oculto"));

  document.getElementById(id).classList.remove("oculto");
}


// ===============================
// RENDER ADMIN
// ===============================
function renderizarAdmin(filtro=""){

  const cont = document.getElementById("lista-productos");
  if(!cont) return;

  cont.innerHTML="";

  productos
  .filter(p => (p.nombre || "").toLowerCase().includes(filtro))
  .forEach((p,index)=>{

    cont.innerHTML += `

    <div class="producto-admin">

      <div class="producto-header" onclick="toggleAdmin(${index})">
        <strong>${p.nombre || "Nuevo producto"}</strong>
        <span>▼</span>
      </div>

      <div class="producto-body" id="body-${index}">

        <label>ID</label>
        <input value="${p.id || 'Nuevo'}" disabled>

        <label>Nombre</label>
        <input value="${p.nombre || ""}"
        onchange="
        productos[${index}].nombre=this.value;
        productos[${index}].slug=generarSlug(this.value);
        renderizarAdmin();
        ">

        <label>Slug</label>
        <input value="${p.slug || ""}" disabled style="background:#eee">

        <label>Categoria</label>
        <input value="${p.categoria || ""}"
        onchange="productos[${index}].categoria=this.value">

        <label>Precio</label>
        <input type="number" value="${p.precio || 0}"
        onchange="productos[${index}].precio=this.value">

        <label>Precio antes</label>
        <input type="number" value="${p.precioAntes || 0}"
        onchange="productos[${index}].precioAntes=this.value">

        <label>Descuento %</label>
        <input type="number" value="${p.descuento || 0}"
        onchange="productos[${index}].descuento=this.value">

        <label>Descripcion</label>
        <textarea
        onchange="productos[${index}].descripcion=this.value"
        >${p.descripcion || ""}</textarea>

        <label>Imagen</label>
        <input type="file" accept="image/*"
        onchange="subirImagen(event, ${index})">

        <img src="${p.imagen || ""}" class="preview">

        <label>Ofertas</label>
        <input type="checkbox"
        ${p.oferta ? "checked":""}
        onchange="productos[${index}].oferta=this.checked">

        <label>Carrusel</label>
        <input type="checkbox"
        ${p.carousel ? "checked":""}
        onchange="productos[${index}].carousel=this.checked">

        <button onclick="eliminarProducto(${index})">
        Eliminar
        </button>

        <button onclick="guardarProductoAPI(productos[${index}], this)">
        Guardar en servidor
        </button>

      </div>

    </div>
    `;
  });

}


// ===============================
// ELIMINAR
// ===============================
async function eliminarProducto(index){

  const producto = productos[index];

  if(!confirm("¿Eliminar este producto?")) return;

  try{

    if(producto.id){
      await fetch(
        `https://revistalogo-backend.onrender.com/productos/${producto.id}`,
        { method:"DELETE" }
      );
    }

    productos.splice(index,1);
    renderizarAdmin();

  }catch(error){
    console.error("Error eliminando producto",error);
  }

}


// ===============================
// TOGGLE
// ===============================
function toggleAdmin(i){

  const body = document.getElementById("body-"+i);

  body.style.display =
  body.style.display === "block" ? "none" : "block";

}


// ===============================
// BUSCADOR
// ===============================
document
.getElementById("buscarAdmin")
.addEventListener("input", e=>{
  renderizarAdmin(e.target.value.toLowerCase());
});


// ===============================
// SUBIR IMAGEN (FIX TOTAL)
// ===============================
async function subirImagen(e, index){

  const file = e.target.files[0];
  if(!file) return;

  // 🔥 preview inmediato
  const previewLocal = URL.createObjectURL(file);
  productos[index].imagen = previewLocal;
  renderizarAdmin();

  const formData = new FormData();
  formData.append("imagen", file);

  try{

    const res = await fetch(
      "https://revistalogo-backend.onrender.com/productos/upload",
      {
        method:"POST",
        body:formData
      }
    );

    const data = await res.json();

    console.log("📸 subida:", data);

    // 🔥 guardar URL real
    productos[index].imagen = data.url;

    renderizarAdmin();

  }catch(err){
    console.error("Error subiendo imagen", err);
  }

}


// ===============================
// GUARDAR PRODUCTO (FIX TOTAL)
// ===============================
async function guardarProductoAPI(producto, boton){

  // 🚨 evitar guardar antes de subir imagen
  if(producto.imagen && producto.imagen.startsWith("blob:")){
    alert("Espera a que la imagen termine de subir");
    return;
  }

  boton.disabled = true;
  boton.innerText = "Guardando...";

  try{

    let url = "https://revistalogo-backend.onrender.com/productos";
    let method = "POST";

    if(producto.id){
      url = `https://revistalogo-backend.onrender.com/productos/${producto.id}`;
      method = "PUT";
    }

    const productoEnviar = {
      nombre: producto.nombre || "",
      slug: producto.slug || "",
      categoria: producto.categoria || null,
      precio: Number(producto.precio) || 0,
      precioAntes: Number(producto.precioAntes) || 0,
      descuento: Number(producto.descuento) || 0,
      descripcion: producto.descripcion || null,
      imagen: producto.imagen || null,
      oferta: producto.oferta ? 1 : 0,
      carousel: producto.carousel ? 1 : 0
    };

    console.log("📦 ENVIANDO:", productoEnviar);

    const response = await fetch(url,{
      method: method,
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(productoEnviar)
    });

    const data = await response.json();

    if(!response.ok){
      alert(data.error || "Error guardando producto");
      return;
    }

    if(data.id){
      producto.id = data.id;
    }

    alert("Producto guardado correctamente");

    if(typeof cargarProductos === "function"){
      await cargarProductos();
    }

  }catch(error){
    console.error("❌ Error guardando producto:", error);
    alert("Error de conexión con el servidor");
  }

  boton.disabled = false;
  boton.innerText = "Guardar en servidor";
}


// ===============================
// NUEVO PRODUCTO
// ===============================
function nuevoProducto(){

  const nuevo = {
    id: null,
    nombre: "",
    slug: "",
    categoria: "",
    precio: 0,
    precioAntes: 0,
    descuento: 0,
    descripcion: "",
    imagen: null,
    oferta: false,
    carousel: false
  };

  productos.push(nuevo);
  renderizarAdmin();
}


// ===============================
// GENERAR SLUG
// ===============================
function generarSlug(texto){
  return texto
    .toLowerCase()
    .trim()
    .replace(/\s+/g,"-")
    .replace(/[^\w-]+/g,"");
}