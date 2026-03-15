let productos = [];

async function cargarProductos(){
  const res = await fetch("../data/productos.json");
  productos = await res.json();
  renderizarAdmin();
}

function guardarCambios(){
  const dataStr = JSON.stringify(productos, null, 2);
  const blob = new Blob([dataStr], {type:"application/json"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "productos.json";
  a.click();

  alert("Archivo descargado. Súbelo al servidor.");
}