const params = new URLSearchParams(window.location.search);

const slug = params.get("slug");

async function cargarProducto(){

try{

const res = await fetch(
`http://localhost:3000/productos/slug/${slug}`
);

const producto = await res.json();

document.getElementById("tituloProducto").textContent = producto.nombre;

document.getElementById("nombreProducto").textContent = producto.nombre;

document.getElementById("descripcionProducto").textContent = producto.descripcion;

document.getElementById("imagenProducto").src = producto.imagen;

document.getElementById("precioProducto").textContent =
"$" + producto.precio;

if(producto.precioAntes){

document.getElementById("precioAntesProducto").textContent =
"$" + producto.precioAntes;

}

const btn = document.getElementById("btnWhatsapp");

btn.onclick = () => {

const mensaje =
`Hola, quiero este producto:

${producto.nombre}
Precio: $${producto.precio}

${window.location.href}`;

const url =
`https://wa.me/57XXXXXXXXXX?text=${encodeURIComponent(mensaje)}`;

window.open(url);

};

}catch(err){

console.error("Error cargando producto",err);

}

}

cargarProducto();