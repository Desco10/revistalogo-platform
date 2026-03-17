// ===============================
// ESTADO GLOBAL OFERTAS
// ===============================
let primerClickOferta = false;
let ofertasGlobal = [];


// ===============================
// CARGAR OFERTAS
// ===============================
fetch("data/productos.json")
  .then(res => res.json())
  .then(data => {

    ofertasGlobal = data.filter(p => p.oferta === true);

    mostrarOfertas(ofertasGlobal);

  })
  .catch(err => console.error("Error cargando ofertas:", err));



// ===============================
/// WHATSAPP OFERTA
// ===============================
function comprarOfertaProducto(id){

  const prod = ofertasGlobal.find(p => p.id === id);
  if(!prod) return;

  const productoURL =
window.location.origin + "/p/" + prod.slug;

  let mensaje = "";

  if(!primerClickOferta){

    mensaje =
`${productoURL}

🔥 Oferta recomendada
⭐⭐⭐⭐⭐

Hola, quiero comprar esta oferta:

📦 ${prod.nombre}
💰 Precio: $${prod.precio}`;

    primerClickOferta = true;

  } else {

    mensaje =
`${productoURL}

🔥 También quiero agregar esta oferta:

📦 ${prod.nombre}
💰 Precio: $${prod.precio}`;

  }

  const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;

  window.open(wa, "_blank");

}

window.comprarOfertaProducto = comprarOfertaProducto;


// ===============================
// MOSTRAR OFERTAS
// ===============================
function mostrarOfertas(lista){

  const container = document.getElementById("ofertas-container");
  if(!container) return;

  container.innerHTML = "";

  lista.forEach(prod => {

    const precioAntes = prod.precioAntes || null;

    const ahorro = precioAntes
      ? precioAntes - prod.precio
      : 0;

    const porcentaje = precioAntes
      ? Math.round((ahorro / precioAntes) * 100)
      : prod.descuento || 0;

    container.innerHTML += `

      <div class="oferta-card">

        <img src="${prod.imagen}"
     alt="${prod.nombre}"
     class="oferta-img"
     loading="lazy"
     decoding="async"
     style="background:#eee;"
     onclick="comprarOfertaProducto(${prod.id})">
        <div class="oferta-info">

          ${porcentaje ? `<div class="producto-descuento">${porcentaje}% OFF</div>` : ""}

          <h4>${prod.nombre}</h4>

          <p>${prod.descripcion ?? ""}</p>

          <span>$${prod.precio}</span>

          ${precioAntes ? `
            <div class="precio-antes">$${precioAntes}</div>
            <div class="ahorro">Ahorras $${ahorro}</div>
          ` : ""}

        </div>

      </div>

    `;
  });

}