// ===============================
// ESTADO GLOBAL
// ===============================
let productosGlobal = [];
let productosFiltrados = [];
let paginaActual = 1;

const productosPorPagina = 8;

let primerClickRealizado = false;


// ===============================
// CARGAR PRODUCTOS
// ===============================
fetch("data/productos.json")
  .then(res => res.json())
  .then(data => {

    productosGlobal = data;
    productosFiltrados = data;

    renderizarPagina();

  })
  .catch(err => console.error("Error cargando productos:", err));



// ===============================
// RENDERIZAR PRODUCTOS
// ===============================
function renderizarPagina(){

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;

  const productosPagina = productosFiltrados.slice(inicio, fin);

  const grid = document.getElementById("productos");
  if(!grid) return;

  grid.innerHTML = "";

  productosPagina.forEach(prod => {

    const ahorro = prod.precioAntes
      ? prod.precioAntes - prod.precio
      : 0;

    const porcentaje = prod.precioAntes
      ? Math.round((ahorro / prod.precioAntes) * 100)
      : prod.descuento || 0;

    grid.innerHTML += `

      <div class="producto">

        <img src="${prod.imagen}"
             alt="${prod.nombre}"
             class="producto-img"
             onclick="agregarAlPedidoProducto(${prod.id})">

        <div class="producto-info">

          ${porcentaje ? `<span class="producto-descuento">${porcentaje}% OFF</span>` : ""}
          ${prod.oferta ? `<span class="producto-descuento">OFERTA</span>` : ""}

          <div class="producto-nombre">${prod.nombre}</div>

          <div class="producto-desc">
            ${prod.descripcion ?? ""}
          </div>

          <div class="producto-precio">
            $${prod.precio}
          </div>

          ${prod.precioAntes ? `
            <div class="precio-antes">$${prod.precioAntes}</div>
            <div class="ahorro">Ahorras $${ahorro}</div>
          ` : ""}

        </div>

      </div>

    `;
  });

  actualizarInfoPagina();
}



// ===============================
// ENVIAR PRODUCTO A WHATSAPP
// ===============================
// ENVIAR PRODUCTO A WHATSAPP
// ===============================
function agregarAlPedidoProducto(id) {

  const prod = productosGlobal.find(p => p.id === id);
  if (!prod) return;

  const productoURL =
window.location.origin + "/p/" + prod.slug;
  let mensaje = "";

  if (!primerClickRealizado) {

    // ✅ URL primero = WhatsApp genera preview visual y "oculta" el link
    mensaje =
`${productoURL}

🛒 Producto recomendado
📦 ${prod.nombre}
💰 Precio: $${prod.precio}`;

    primerClickRealizado = true;

  } else {

    mensaje =
`${productoURL}

➕ También quiero agregar
📦 ${prod.nombre}
💰 Precio: $${prod.precio}`;

  }

  const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  window.open(wa, "_blank");

}

window.agregarAlPedidoProducto = agregarAlPedidoProducto;


// ===============================
// PAGINACIÓN
// ===============================
function actualizarInfoPagina(){

  const info = document.getElementById("pageInfo");
  if(!info) return;

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  info.textContent = `Página ${paginaActual} de ${totalPaginas}`;

}


const nextBtn = document.getElementById("nextPage");

if(nextBtn){

  nextBtn.addEventListener("click", () => {

    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

    if(paginaActual < totalPaginas){

      paginaActual++;

      renderizarPagina();

      window.scrollTo({
        top:0,
        behavior:"smooth"
      });

    }

  });

}


const prevBtn = document.getElementById("prevPage");

if(prevBtn){

  prevBtn.addEventListener("click", () => {

    if(paginaActual > 1){

      paginaActual--;

      renderizarPagina();

      window.scrollTo({
        top:0,
        behavior:"smooth"
      });

    }

  });

}



// ===============================
// FILTRAR CATEGORÍAS
// ===============================
function filtrar(categoria){

  paginaActual = 1;

  if(categoria === "todos"){

    productosFiltrados = productosGlobal;

  } else {

    productosFiltrados = productosGlobal.filter(
      p => p.categoria === categoria
    );

  }

  renderizarPagina();

}



// ===============================
// MENU LATERAL
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  window.toggleMenu = function(){

    if(!sidebar || !overlay) return;

    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");

  };

  if(overlay){

    overlay.addEventListener("click", () => {

      sidebar.classList.remove("active");
      overlay.classList.remove("active");

    });

  }

});