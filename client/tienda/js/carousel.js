fetch("data/productos.json")
  .then(res => res.json())
  .then(data => {

    const track = document.getElementById("carousel-track");

    const destacados = data.filter(p => p.carousel);

    destacados.forEach(prod => {

      const wa = `https://wa.me/573001234567?text=${encodeURIComponent(
        "Hola, quiero este producto: " + prod.nombre
      )}`;

      track.innerHTML += `
        <img 
  src="${prod.imagen}" 
  alt="${prod.nombre}"
  loading="lazy"
  decoding="async"
  style="background:#eee;"
  onclick="window.open('${wa}','_blank')"
>
      `;
    });

  });