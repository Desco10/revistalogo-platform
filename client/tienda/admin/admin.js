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
          
          <label>Nombre</label>
          <input value="${p.nombre}" 
            onchange="productos[${index}].nombre=this.value">

          <label>Precio</label>
          <input type="number" value="${p.precio}"
            onchange="productos[${index}].precio=this.value">

          <label>Precio antes</label>
          <input type="number" value="${p.precioAntes || ''}"
            onchange="productos[${index}].precioAntes=this.value">

          <label>Imagen</label>
          <input type="file" accept="image/*"
            onchange="subirImagen(event, ${index})">

          <img src="${p.imagen}" class="preview">

          <label>Oferta</label>
          <input type="checkbox" ${p.oferta?'checked':''}
            onchange="productos[${index}].oferta=this.checked">

          <label>Carrusel</label>
          <input type="checkbox" ${p.carousel?'checked':''}
            onchange="productos[${index}].carousel=this.checked">

          <button onclick="eliminarProducto(${index})">
            Eliminar
          </button>

        </div>
      </div>
    `;
  });
}

function eliminarProducto(i){
  productos.splice(i,1);
  renderizarAdmin();
}


function toggleAdmin(i){
  const body = document.getElementById("body-"+i);
  body.style.display =
    body.style.display === "block" ? "none" : "block";
}


document.getElementById("buscarAdmin")
.addEventListener("input", e=>{
  renderizarAdmin(e.target.value.toLowerCase());
});



function subirImagen(e, index){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = function(evt){
    productos[index].imagen = evt.target.result;
    renderizarAdmin();
  }

  reader.readAsDataURL(file);
}



function subirLogo(e){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = function(evt){
    const base64 = evt.target.result;

    document.getElementById("logoPreview").src = base64;
    document.getElementById("logoPreview").style.display = "block";

    // guardamos temporalmente en input para que guardarMarca lo use
    document.getElementById("logoNegocio").value = base64;
  };

  reader.readAsDataURL(file);
}



function previewLogoURL(url){
  if(!url) return;

  const img = document.getElementById("logoPreview");
  img.src = url;
  img.style.display = "block";
}
  /* function subirVideo(e, index){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = function(evt){
    productos[index].video = evt.target.result;
  }

  reader.readAsDataURL(file);
}*/