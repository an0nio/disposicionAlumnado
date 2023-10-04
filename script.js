let mesaSeleccionada = null;
const mesasContainer = document.getElementById("mesas-container");
const cargaLS = document.getElementById('cargaLocalStorage');
const eliminaLS = document.getElementById('eliminaLocalStorage');

//borra todos los elementos que no sean mesas y muestra botones para guardar mesas
function actualizaContenido(nombreAula){
    const guardarFichero = document.getElementById("guardarFichero");
    const guardarALS = document.getElementById("guardarALS");
    const guardarAFichero = document.getElementById("guardarAFichero");
    const creaMesas = document.getElementById("creaMesas");
    const creaLS = document.getElementById("creaLocalStorage");
    const titulo = document.getElementById("titulo");
    const volver = document.getElementById("volver");


    titulo.textContent = nombreAula 
    guardarFichero.classList.remove("invisible");
    guardarALS.classList.remove("invisible");
    guardarAFichero.classList.remove("invisible");
    volver.classList.remove("invisible");
    mesasContainer.innerHTML = "";
    creaMesas.remove();
    creaLS.remove();
}

// Crea las mesas con número de filas y columnas selecionadas
function crearMesas() {
    const numFilas = parseInt(document.getElementById("numFilas").value);
    const numColumnas = parseInt(document.getElementById("numColumnas").value);
    const nombreAula = document.getElementById("nombreAula").value;
    if((numColumnas<1 || numColumnas >10) || (numFilas<1 || numFilas>10) || nombreAula=="") return;
    if(localStorage.getItem(nombreAula)){
        alert("Ya existe un aula con ese nombre");
        return;
    }
    actualizaContenido(nombreAula);

    // Crear mesas vacías organizadas en filas y columnas
    for (let i = 1; i <= numFilas; i++) {
        const fila = document.createElement("div");
        fila.className = "fila";
        for (let j = 1; j <= numColumnas; j++) {
            const mesa = document.createElement("div");
            mesa.className = "mesa";
            mesa.addEventListener("click", () => abrirModalMesa(mesa));
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
    let filaDiv = document.createElement("div");
    filaDiv.classList.add("fila");

    filaDeMesas.forEach(function(mesa) {
        const mesaDiv = document.createElement("div");
        mesaDiv.classList.add("mesa");
        let nombreMesaDiv = document.createElement("div");
        nombreMesaDiv.classList.add("nombre-mesa");
        nombreMesaDiv.textContent = mesa.nombre;

        let descripcionMesaDiv = document.createElement("div");
        descripcionMesaDiv.classList.add("descripcion-mesa");
        descripcionMesaDiv.textContent = mesa.descripcion;

        mesaDiv.appendChild(nombreMesaDiv);
        mesaDiv.appendChild(descripcionMesaDiv);

        filaDiv.appendChild(mesaDiv);
        mesaDiv.addEventListener("click", () => abrirModalMesa(mesaDiv));

    });

    mesasContainer.appendChild(filaDiv);
    });
}

//Abre el modal tras darle click a una de las mesas
function abrirModalMesa(mesa) {
    mesaSeleccionada = mesa;
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    document.getElementById("nombreMesa").value = ""
    document.getElementById("descripcionMesa").value = ""
    if (mesaSeleccionada.querySelector('.nombre-mesa')){
        document.getElementById("nombreMesa").value = mesaSeleccionada.querySelector('.nombre-mesa').textContent;
    }
    if (mesaSeleccionada.querySelector('.descripcion-mesa')    ){
        document.getElementById("descripcionMesa").value = mesaSeleccionada.querySelector('.descripcion-mesa').textContent;
    }
}

function abrirModal(nombreM) {
    const modal = document.getElementById(nombreM);
    modal.style.display = "block";
}

function cerrarModal(nombreM) {
    const modal = document.getElementById(nombreM);
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
        cerrarModal("modal");
    }
}

// Guarda el contenido de la página HTML entero. No se ha puesto en esta versión
function guardaHTML(){
  let contenidoHTML = document.documentElement.outerHTML;
  let blob = new Blob([contenidoHTML], { type: "text/html" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "alumnadoClase.html"; 
  a.click();
  URL.revokeObjectURL(a.href);
}


// Función para cargar los elementos de localStorage en el menú desplegable
function cargarElementosLocalStorage() {
    const selectElement = document.getElementById('elementosLocalStorage');
    if (selectElement){
        if (elementosImportantesLS()) {
            selectElement.innerHTML = '';
        } 

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('_ym')) continue
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

//Revisa si todos los elementos que hay en LocalStorage empiezan por _ym
function elementosImportantesLS(){
    let cont = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('_ym')) cont++
    }
    return cont != localStorage.length 
}
 // Función para cargar las llaves del localStorage en el modal
 function cargarLlavesLocalStorage() {
    let llaves = Object.keys(localStorage);
    let formularioLlaves = document.getElementById("formularioLlaves");
    formularioLlaves.innerHTML="";

    llaves.forEach(function(llave) {
    let checkbox = document.createElement("input");
    checkbox.className="form-check-input";
    checkbox.type = "checkbox";
    checkbox.name = llave;
    checkbox.value = llave;
    checkbox.setAttribute("id", llave);

    let div = document.createElement("div");
    div.className = "form-check";
    div.style ="text-align : left;"
    div.appendChild(checkbox);
//   div.appendChild(document.createTextNode(llave));
    let label = document.createElement("label");
    label.className = "form-check-label";
    label.setAttribute("for", llave);
    label.textContent = llave;
    div.appendChild(label);

      formularioLlaves.appendChild(div);
    });
  }

  // Función para guardar la selección en un fichero
  function guardarSeleccionEnFichero() {
    let formularioLlaves = document.getElementById("formularioLlaves");
    let formData = new FormData(formularioLlaves);
    let contenido = {};

    formData.forEach(function(valor, llave) {
        contenido[llave]=localStorage.getItem(llave);
    });


    // Crear un Blob con el contenido y descargarlo como un archivo
    let blob = new Blob([JSON.stringify(contenido)], { type: "application/plain" });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "seleccion_localstorage.json";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }



document.addEventListener("DOMContentLoaded", function () {
    if (!elementosImportantesLS() && cargaLS && eliminaLS ){
        cargaLS.disabled = true
        eliminaLS.disabled = true
    }
    cargarElementosLocalStorage();
    const mesas = document.querySelectorAll(".mesa");
    mesas.forEach((mesa) => {
        mesa.addEventListener("click", () => abrirModalMesa(mesa));
      }); 
    document.getElementById("guardarFichero").addEventListener("click", function(){
        abrirModal("modalFichero");
    });
    document.getElementById("eliminaLocalStorage").addEventListener("click", function(){
        eliminarElemento(document.getElementById("elementosLocalStorage").value);
    });
    document.getElementById("guardarALS").addEventListener("click", function(){
        guardaEnLocalStorage();
        alert("guardado con éxito");
    });
    document.getElementById("volver").addEventListener("click",function(){location.reload();});
    if(document.getElementById("cargaLocalStorage")){
        document.getElementById("cargaLocalStorage").addEventListener("click", function(){
            let valorSeleccion = document.getElementById("elementosLocalStorage").value;
            actualizaContenido(document.getElementById("elementosLocalStorage").value);
            mesasAHTML(localStorage.getItem(valorSeleccion));
        });
    }
    // Evento al hacer clic en el botón "Guardar en Fichero"
    document.getElementById("guardarFichero").addEventListener("click", function() {
        cargarLlavesLocalStorage();
      });
  
      // Evento al hacer clic en el botón "Guardar Selección"
      document.getElementById("guardarSeleccion").addEventListener("click", function() {
        guardarSeleccionEnFichero();
      });
    
  });
