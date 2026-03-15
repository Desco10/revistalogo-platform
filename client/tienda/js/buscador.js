document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("buscar");
  const mensaje = document.getElementById("sin-resultados");

  if(!input) return;

  let debounceTimer;

  input.addEventListener("input", e => {

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {

      const texto = normalizar(e.target.value);

      if(texto === ""){
        productosFiltrados = productosGlobal;
        paginaActual = 1;
        renderizarPagina();
        if(mensaje) mensaje.style.display = "none";
        return;
      }

      productosFiltrados = productosGlobal.filter(p =>
        normalizar(p.nombre).includes(texto) ||
        normalizar(p.descripcion || "").includes(texto) ||
        normalizar(p.categoria || "").includes(texto)
      );

      paginaActual = 1;
      renderizarPagina();

      // 🔥 AQUÍ ESTÁ LO QUE TE FALTABA
      if(mensaje){
        mensaje.style.display = productosFiltrados.length === 0 ? "block" : "none";
      }

    }, 200);

  });

});


function normalizar(texto){
  return texto
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}