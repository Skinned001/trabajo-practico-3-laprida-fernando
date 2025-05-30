const btnBuscar = document.getElementById("btn-buscar");
const contenedorPadre = document.getElementById("contenedor-data");
const btnFiltro = document.getElementById("btn-filtro");
const inputBusqueda = document.getElementById("input-busqueda");
const urlDragonBall = "https://dragonball-api.com/api/characters?limit=58";
const btnLimpiar = document.getElementById("btn-limpiar");


function mostrarError(mensaje) {
  alert(mensaje);
}

function mostrarPersonaje(listaPersonajes, append = false) {
  if (!append) contenedorPadre.innerHTML = "";

  listaPersonajes.forEach((personaje) => {
    contenedorPadre.innerHTML += `
      <div class="col-3 pb-2 d-flex justify-content-center" data-id=${personaje.id}>
        <div class="card">
          <img class="card-img-top" src="${personaje.image}" />
          <div class="card-body">
            <h5 class="card-title">${personaje.name}</h5>
            <p class="card-text">${personaje.race} - ${personaje.gender}</p>
            <button class="btn btn-success btn-ver-detalles">Ver más</button>
          </div>
        </div>
      </div>`;
  });
}


const cargarDatos = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la API");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const verDetalles = async (id) => {
  try {
    const response = await fetch(`https://dragonball-api.com/api/characters/${id}`);
    if (!response.ok) throw new Error("Error en la API");
    const data = await response.json();
    alert(data.description);
  } catch (error) {
    console.error(error);
  }
};

async function filtroPersonaje(nombre) {
  try {
    const response = await fetch(urlDragonBall); // Cargamos todos los personajes
    if (!response.ok) throw new Error("No se conectó con la API");

    const data = await response.json();
    const resultados = data.items;

    const filtrados = resultados.filter(personaje =>
      personaje.name.toLowerCase().includes(nombre.toLowerCase())
    );

    if (filtrados.length === 0) {
      mostrarError("No se encontró nada");
      return;
    }

    mostrarPersonaje(filtrados);
  } catch (error) {
    mostrarError("Hubo un problema al buscar");
    console.error(error);
  }
}

btnLimpiar.addEventListener("click", (e) => {
  e.preventDefault();
  inputBusqueda.value = "";
  contenedorPadre.innerHTML = "";
});


btnBuscar.addEventListener("click", async () => {
  const data = await cargarDatos(urlDragonBall);
  if (data?.items) {
    mostrarPersonaje(data.items);
  }
});

btnFiltro.addEventListener("click", (e) => {
  e.preventDefault(); // Para evitar recarga
  const nombre = inputBusqueda.value.trim();
  if (!nombre) {
    mostrarError("Escriba algún nombre");
    return;
  }
  filtroPersonaje(nombre);
});


contenedorPadre.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-ver-detalles")) {
    const cardPadre = e.target.closest(".col-3");
    const id = cardPadre.dataset.id;
    verDetalles(id);
  }
});

