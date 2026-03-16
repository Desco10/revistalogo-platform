cargarProductos();

function mostrarSeccion(id){
  document.querySelectorAll(".seccion")
  .forEach(s => s.classList.add("oculto"));

  document.getElementById(id).classList.remove("oculto");
}


function renderizarAdmin(filtro=""){

  const cont = document.getElementById("lista-productos");
  cont.innerHTML="";

  productos
  .filter(p => p.nombre.toLowerCase().includes(filtro))
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

        <label>Oferta</label>
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



async function eliminarProducto(index){

  const producto = productos[index];

  if(!confirm("¿Eliminar este producto?")) return;

  try{

    if(producto.id){

      await fetch(
        `http://localhost:3000/productos/${producto.id}`,
        { method:"DELETE" }
      );

    }

    productos.splice(index,1);

    renderizarAdmin();

  }catch(error){

    console.error("Error eliminando producto",error);

  }

}



function toggleAdmin(i){

  const body = document.getElementById("body-"+i);

  body.style.display =
  body.style.display === "block" ? "none" : "block";

}



document
.getElementById("buscarAdmin")
.addEventListener("input", e=>{

  renderizarAdmin(e.target.value.toLowerCase());

});



async function subirImagen(e,index){

const file = e.target.files[0];

if(!file) return;

const formData = new FormData();

formData.append("imagen", file);

try{

const res = await fetch(
"http://localhost:3000/productos/upload",
{
method:"POST",
body:formData
}
);

const data = await res.json();

productos[index].imagen = data.url;

renderizarAdmin();

}catch(err){

console.error("Error subiendo imagen",err);

}

}


function subirLogo(e){

  const file = e.target.files[0];

  if(!file) return;

  const reader = new FileReader();

  reader.onload = function(evt){

    const base64 = evt.target.result;

    document.getElementById("logoPreview").src = base64;

    document.getElementById("logoPreview").style.display="block";

    document.getElementById("logoNegocio").value = base64;

  };

  reader.readAsDataURL(file);

}



function previewLogoURL(url){

  if(!url) return;

  const img = document.getElementById("logoPreview");

  img.src = url;

  img.style.display="block";

}



async function guardarProductoAPI(producto, boton){

  boton.disabled = true;
  boton.innerText = "Guardando...";

  try{

    let url = "http://localhost:3000/productos";
    let method = "POST";

    // si el producto ya existe → editar
    if(producto.id){
      url = `http://localhost:3000/productos/${producto.id}`;
      method = "PUT";
    }

    const response = await fetch(url,{
      method:method,
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(producto)
    });

    const data = await response.json();

    console.log("Producto guardado:",data);

    alert("Producto guardado correctamente");

    // recargar productos desde la base
    cargarProductos();

  }catch(error){

    console.error("Error guardando producto:",error);

  }

  boton.disabled = false;
  boton.innerText = "Guardar en servidor";
}


function nuevoProducto(){

  const nuevo = {

    nombre:"",
    slug:"",
    categoria:"",
    precio:0,
    precioAntes:0,
    descuento:0,
    descripcion:"",
    imagen:"",
    oferta:false,
    carousel:false

  };

  productos.push(nuevo);

  renderizarAdmin();

}



function generarSlug(texto){
return texto
.toLowerCase()
.replace(/\s+/g,"-")
.replace(/[^\w-]+/g,"");
}