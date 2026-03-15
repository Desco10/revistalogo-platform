window.addEventListener("load", () => {

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  window.toggleMenu = function () {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

});



document.addEventListener("DOMContentLoaded", () => {

  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("openBtn");
  const closeBtn = document.getElementById("closeBtn");
  const links = sidebar.querySelectorAll("a");

  if(!sidebar || !openBtn || !closeBtn) return;

  // abrir menú
  openBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.add("active");
  });

  // cerrar con X
  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });

  // cerrar al tocar enlaces
  links.forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  });

  // cerrar tocando afuera
  document.addEventListener("click", (e) => {

    if (
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !openBtn.contains(e.target)
    ) {
      sidebar.classList.remove("active");
    }

  });

});

document.querySelectorAll(".sidebar a").forEach(link=>{
  link.addEventListener("click", ()=>{
    document.getElementById("sidebar").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
  });
});