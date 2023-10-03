let mesaSeleccionada = null;
const mesasContainer = document.getElementById("mesas-container");
const cargaLS = document.getElementById('cargaLocalStorage');
const eliminaLS = document.getElementById('eliminaLocalStorage');

//borra todos los elementos que no sean mesas y muestra botones para guardar mesas
function actualizaContenido(nombreAula){
    const guardarBoton = document.getElementById("guardarBoton");
    const creaMesas = document.getElementById("creaMesas");
    const creaLS = document.getElementById("creaLocalStorage");
    const titulo = document.getElementById("titulo");

    titulo.textContent = nombreAula 
    guardarBoton.classList.remove("invisible")
    mesasContainer.innerHTML = "";
    creaMesas.remove();
    creaLS.remove();
}

// Crea las mesas con número de filas y columnas selecionadas
function crearMesas() {
    const numFilas = parseInt(document.getElementById("numFilas").value);
    const numColumnas = parseInt(document.getElementById("numColumnas").value);

    if((numColumnas<1 || numColumnas >10) || (numFilas<1 || numFilas>10) || nombreAula=="") return;

    actualizaContenido(document.getElementById("nombreAula").value);

    // Crear mesas vacías organizadas en filas y columnas
    for (let i = 1; i <= numFilas; i++) {
        const fila = document.createElement("div");
        fila.className = "fila";
        for (let j = 1; j <= numColumnas; j++) {
            const mesa = document.createElement("div");
            mesa.className = "mesa";
            mesa.addEventListener("click", () => abrirModal(mesa));
            fila.appendChild(mesa);
        }
        mesasContainer.appendChild(fila);
    }
}

//Convierte el contenido del html json
function mesasAJson(){
    const mesasContainer = document.getElementById("mesas-container");
    const filas = mesasContainer.querySelectorAll(".fila");
    let mesasData = [];

    filas.forEach(function(fila) {
        const mesas = fila.querySelectorAll(".mesa");
        let filaData = [];

        mesas.forEach(function(mesa) {
            const nombreMesaElement = mesa.querySelector(".nombre-mesa");
            const descripcionMesaElement = mesa.querySelector(".descripcion-mesa");

            if (nombreMesaElement && descripcionMesaElement) {
                let nombreMesa = nombreMesaElement.textContent.trim();
                let descripcionMesa = descripcionMesaElement.textContent.trim();
                var mesaObj = {
                nombre: nombreMesa,
                descripcion: descripcionMesa
                };
            }else{
                var mesaObj = {
                nombre: "",
                descripcion: ""
                };
            }
            filaData.push(mesaObj);
        });

        mesasData.push(filaData);
    });
    return JSON.stringify(mesasData);
}

//Guarda la disposición actual de las mesas en localStorage
function guardaEnLocalStorage(){
    localStorage.setItem(document.getElementById('titulo').textContent, mesasAJson());
}

//guarda la disposición actual de las mesas en un archivo
function guardarArchivoJson(nombre) {
    const blob = new Blob([mesasAJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = nombre + '.json';
    a.click();

    URL.revokeObjectURL(url);
}
  

//convierte un json a contenido html
function mesasAHTML(mesas){
    jsonObj = JSON.parse(mesas)
    const mesasContainer = document.getElementById("mesas-container");
    mesasContainer.innerHTML = "";
    jsonObj.forEach(function(filaDeMesas) {
    var filaDiv = document.createElement("div");
    filaDiv.classList.add("fila");

    filaDeMesas.forEach(function(mesa) {
        const mesaDiv = document.createElement("div");
        mesaDiv.classList.add("mesa");
        mesaDiv.addEventListener("click", () => abrirModal(mesa));
        var nombreMesaDiv = document.createElement("div");
        nombreMesaDiv.classList.add("nombre-mesa");
        nombreMesaDiv.textContent = mesa.nombre;

        var descripcionMesaDiv = document.createElement("div");
        descripcionMesaDiv.classList.add("descripcion-mesa");
        descripcionMesaDiv.textContent = mesa.descripcion;

        mesaDiv.appendChild(nombreMesaDiv);
        mesaDiv.appendChild(descripcionMesaDiv);

        filaDiv.appendChild(mesaDiv);
    });

    mesasContainer.appendChild(filaDiv);
    });
}


function abrirModal(mesa) {
    mesaSeleccionada = mesa;
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    document.getElementById("nombreMesa").value = mesaSeleccionada.querySelector('.nombre-mesa').textContent;
    document.getElementById("descripcionMesa").value = mesaSeleccionada.querySelector('.descripcion-mesa').textContent;
}

function cerrarModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

//Guarda los cambios en una mesa
function guardarCambios() {
    if (mesaSeleccionada) {
        const nombreMesa = document.getElementById("nombreMesa").value;
        const descripcionMesa = document.getElementById("descripcionMesa").value;
        mesaSeleccionada.innerHTML = `
            <div class="nombre-mesa">${nombreMesa}</div>
            <div class="descripcion-mesa">${descripcionMesa}</div>
        `;
        cerrarModal();
    }
}

// Guarda el contenido de la página HTML entero
function guardaHTML(){
  var contenidoHTML = document.documentElement.outerHTML;
  var blob = new Blob([contenidoHTML], { type: "text/html" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "alumnadoClase.html"; 
  a.click();
  URL.revokeObjectURL(a.href);
}


// Función para cargar los elementos de localStorage en el menú desplegable
function cargarElementosLocalStorage() {
    const selectElement = document.getElementById('elementosLocalStorage');
    if (selectElement){
        if (localStorage.length > 0 ) {
            selectElement.innerHTML = '';
        } 

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const optionElement = document.createElement('option');
            optionElement.value = key;
            optionElement.textContent = key;
            selectElement.appendChild(optionElement);
        }
    }
}
  
// Función para eliminar un elemento de localStorage
function eliminarElemento() {
    const selectElement = document.getElementById('elementosLocalStorage');
    const selectedKey = selectElement.value;

    if (selectedKey) {
        localStorage.removeItem(selectedKey);
        cargarElementosLocalStorage(); 
    } else {
        alert('Selecciona un elemento para eliminar.');
    }
}



document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.length == 0 && cargaLS && eliminaLS ){
        cargaLS.disabled = true
        eliminaLS.disabled = true
    }
    cargarElementosLocalStorage();
    const mesas = document.querySelectorAll(".mesa");
    mesas.forEach((mesa) => {
        mesa.addEventListener("click", () => abrirModal(mesa));
      }); 
    document.getElementById("guardarBoton").addEventListener("click", function(){
        guardaHTML();
    });
    if(document.getElementById("cargaLocalStorage")){
        document.getElementById("cargaLocalStorage").addEventListener("click", function(){
            let valorSeleccion = document.getElementById("elementosLocalStorage").value;
            actualizaContenido(document.getElementById("elementosLocalStorage").value);
            mesasAHTML(localStorage.getItem(valorSeleccion));
        });
    }
    
  });
