function main() {
  // Selección de elementos del DOM
  const inputTarea = document.getElementById("inputTarea");
  const inputDescripcion = document.getElementById("inputDescripcion");
  const btnAñadir = document.getElementById("btnAñadir");
  const listaTareas = document.getElementById("listaTareas");
  const mensajeVacio = document.getElementById("mensajeVacio");

  // Cargar tareas desde localStorage o inicializar como arreglo vacío
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];

  // Función que guarda las tareas actuales en localStorage
  function guardarTareasEnStorage() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }
  //funcion para eliminar tareas guardadas en localStorage
  function eliminarTareasEnStorage() {
    localStorage.removeItem("tareas");
    tareas.length = 0; // Vacía el array sin reasignar
    listaTareas.innerHTML = "";
    if (mensajeVacio) mensajeVacio.style.display = "";
  }

  const btnEliminarTarea = document.getElementById("btnEliminar");
  if (btnEliminarTarea) {
    btnEliminarTarea.addEventListener("click", eliminarTareasEnStorage);
  }

  // Devuelve la fecha formateada al estilo español
  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Devuelve clases de estilo según el estado de la tarea
  function classePorEstado(estado) {
    switch (estado) {
      case "Creada":
        return "bg-success-subtle text-dark shadow border border-success";
      case "En proceso":
        return "bg-warning-subtle text-dark shadow border border-warning";
      case "Terminada":
        return "bg-danger-subtle text-dark shadow border border-danger";
      default:
        return "bg-secondary-subtle text-dark shadow border border-secondary";
    }
  }

  // Cambia el estado actual de la tarea al siguiente
  function cambiarEstado(estadoActual) {
    const estados = ["Creada", "En proceso", "Terminada"];
    const indexActual = estados.indexOf(estadoActual);
    const siguienteIndex = indexActual + 1;
    if (estadoActual === "Terminada") {
      return estadoActual;
    }
    return estados[siguienteIndex];
  }

  // Crea visualmente un elemento de tarea y lo añade al DOM
  function crearElementoTarea(tarea) {
    const fechaActual = new Date();
    const li = document.createElement("li");
    li.className =
      "list-group-item shadow-sm my-2 p-0 border border-secondary rounded";

    // Contenedor principal
    const divPrincipal = document.createElement("div");
    divPrincipal.className = " d-flex flex-column p-2";

    // Parte superior con texto y estado
    const divSuperior = document.createElement("div");
    divSuperior.className =
      "d-flex justify-content-between align-items-start mb-2";

    const divTexto = document.createElement("div");
    divTexto.className = "fw-bold flex-grow-1 texto-tarea me-4";
    divTexto.textContent = tarea.texto;
    //descripción de la tarea
    const divDescripcion = document.createElement("div");
    divDescripcion.className = "text-muted small";
    divDescripcion.textContent = tarea.descripcion || "Sin descripción";
    divTexto.appendChild(divDescripcion);

    const divEstadoContainer = document.createElement("div");
    const spanEstado = document.createElement("span");
    spanEstado.className = `badge ${classePorEstado(tarea.estado)}`;
    spanEstado.textContent = tarea.estado;

    divEstadoContainer.appendChild(spanEstado);
    divSuperior.appendChild(divTexto);
    divSuperior.appendChild(divEstadoContainer);

    // Parte inferior con fechas
    const divInferior = document.createElement("div");
    divInferior.className = "mb-2";

    const divFechas = document.createElement("div");
    divFechas.className = "small text-muted";

    const divFechaCreacion = document.createElement("div");
    divFechaCreacion.className = "fecha-creacion text-nowrap";
    divFechaCreacion.textContent = `Creada: ${formatearFecha(
      tarea.fechaCreacion
    )}`;

    const divFechaMod = document.createElement("div");
    divFechaMod.className = "fecha-modificacion small text-muted text-nowrap d-none"; // Oculto inicialmente
    divFechaMod.textContent = `Modificada: ${formatearFecha(
    )}`;

    divFechas.appendChild(divFechaCreacion);
    divFechas.appendChild(divFechaMod);
    divInferior.appendChild(divFechas);

    // Contenedor para los botones (Estado + Acciones)
    const divBotonesGeneral = document.createElement("div");
    divBotonesGeneral.className =
      "d-flex justify-content-center flex-wrap gap-2";

    // Botón para cambiar estado
    const btnCambiarEstado = document.createElement("button");
    btnCambiarEstado.className = "btn btn-success btn-sm";
    btnCambiarEstado.textContent = "Estado";
    if (tarea.estado === "Terminada") {
      btnCambiarEstado.style.display = "none";
    }
    btnCambiarEstado.addEventListener("click", () => {
      const nuevoEstado = cambiarEstado(tarea.estado);
      tarea.estado = nuevoEstado;
      tarea.fechaModificacion = new Date().toISOString();
      guardarTareasEnStorage();
    });

    // Contenedor de botones Editar / Leer / Borrar
    const divAcciones = document.createElement("div");
    divAcciones.className = "d-flex flex-wrap gap-2";

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-primary btn-sm";
    btnEditar.textContent = "Editar";

    const btnLeer = document.createElement("button");
    btnLeer.className = "btn btn-info btn-sm";
    btnLeer.textContent = "ver";

    const btnBorrar = document.createElement("button");
    btnBorrar.className = "btn btn-danger btn-sm";
    btnBorrar.textContent = "Borrar";

    btnBorrar.addEventListener("click", () => {
      const indice = tareas.findIndex(
        (t) =>
          t.texto === tarea.texto && t.fechaCreacion === tarea.fechaCreacion
      );

      if (indice !== -1) {
        tareas.splice(indice, 1);
        guardarTareasEnStorage();
      }

      li.remove();

      if (tareas.length === 0 && mensajeVacio) {
        mensajeVacio.style.display = "block";
      }
    });

    // Armar botones
    divAcciones.appendChild(btnEditar);
    divAcciones.appendChild(btnLeer);
    divAcciones.appendChild(btnBorrar);

    divBotonesGeneral.appendChild(btnCambiarEstado);
    divBotonesGeneral.appendChild(divAcciones);

    // Ensamblar toda la tarea
    divPrincipal.appendChild(divSuperior); // Texto + Estado
    divPrincipal.appendChild(divInferior); // Fechas
    divPrincipal.appendChild(divBotonesGeneral); // Botones debajo

    li.appendChild(divPrincipal);
    listaTareas.appendChild(li);
  }

  // Mostrar tareas guardadas al iniciar
  if (tareas.length > 0 && mensajeVacio) mensajeVacio.style.display = "none";
  tareas.forEach((t) => crearElementoTarea(t));

  // Evento para añadir una nueva tarea
  btnAñadir.addEventListener("click", () => {
    const textoTarea = inputTarea.value.trim();
    const descripcionTarea = inputDescripcion.value.trim();

    // Validar que el texto de la tarea no esté vacío
    if (textoTarea) {
      if (mensajeVacio) mensajeVacio.style.display = "none";

      const nuevaTarea = {
        texto: textoTarea,
        descripcion: descripcionTarea, // ✔️ CORREGIDO
        estado: "Creada",
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
      };

      tareas.push(nuevaTarea);
      guardarTareasEnStorage();
      crearElementoTarea(nuevaTarea);

      // Limpiar los campos
      inputTarea.value = "";
      inputDescripcion.value = "";
    }
  });

if (e.target.classList.contains("btn-success")) {
  const li = e.target.closest("li");
  const badge = li.querySelector(".badge");
  
  const estadoActual = badge.textContent;
  const nuevoEstado = cambiarEstado(estadoActual);
  badge.className = `badge ${classePorEstado(nuevoEstado)}`;
  badge.textContent = nuevoEstado;
  
  // Elimina estas líneas para que no muestre la fecha:
  // const divFechaMod = li.querySelector(".fecha-modificacion");
  // divFechaMod.textContent = `Modificada: ${formatearFecha(new Date())}`;
  // divFechaMod.classList.remove("d-none");
  
  if (nuevoEstado === "Terminada") {
    e.target.style.display = "none";
  }
}

    // Botón para editar texto y descripción
    if (e.target.classList.contains("btn-primary")) {
      const li = e.target.closest("li");
      const divTexto = li.querySelector(".texto-tarea");
      const divDescripcion = divTexto.querySelector("div");

      const textoActual = divTexto.childNodes[0].nodeValue.trim();
      const descripcionActual = divDescripcion
        ? divDescripcion.textContent
        : "";

      // Input para texto
      const inputEditar = document.createElement("input");
      inputEditar.type = "text";
      inputEditar.className = "form-control form-control-sm mb-1";
      inputEditar.value = textoActual;

      // Textarea para descripción
      const textareaDescripcion = document.createElement("textarea");
      textareaDescripcion.className = "form-control form-control-sm mb-1";
      textareaDescripcion.rows = 2;
      textareaDescripcion.value = descripcionActual;

      // Botones de guardar y cancelar
      const btnGuardar = document.createElement("button");
      btnGuardar.className = "btn btn-success btn-sm me-1";
      btnGuardar.textContent = "✔";

      const btnCancelar = document.createElement("button");
      btnCancelar.className = "btn btn-secondary btn-sm";
      btnCancelar.textContent = "❌";

      // Contenedor de edición
      const divEdicion = document.createElement("div");
      divEdicion.className = "d-flex flex-column flex-grow-1";
      divEdicion.appendChild(inputEditar);
      divEdicion.appendChild(textareaDescripcion);

      const divBotonesEdicion = document.createElement("div");
      divBotonesEdicion.className = "d-flex justify-content-end";
      divBotonesEdicion.appendChild(btnGuardar);
      divBotonesEdicion.appendChild(btnCancelar);

      divEdicion.appendChild(divBotonesEdicion);
      divTexto.parentNode.replaceChild(divEdicion, divTexto);

      inputEditar.focus();
      inputEditar.select();

      // Función para guardar edición
      function guardarEdicion() {
        const nuevoTexto = inputEditar.value.trim();
        const nuevaDescripcion = textareaDescripcion.value.trim();

        if (nuevoTexto !== "") {
          const nuevoDivTexto = document.createElement("div");
          nuevoDivTexto.className = "fw-bold flex-grow-1 texto-tarea me-4";
          nuevoDivTexto.textContent = nuevoTexto;

          const nuevoDivDescripcion = document.createElement("div");
          nuevoDivDescripcion.className = "text-muted small";
          nuevoDivDescripcion.textContent =
            nuevaDescripcion || "Sin descripción";
          nuevoDivTexto.appendChild(nuevoDivDescripcion);

          divEdicion.parentNode.replaceChild(nuevoDivTexto, divEdicion);

          // Actualizar el array y guardar
          const indice = tareas.findIndex(
            (t) =>
              t.texto === textoActual &&
              t.fechaCreacion ===
                li.querySelector(".fecha-creacion").textContent.split(": ")[1]
          );

          if (indice !== -1) {
            tareas[indice].texto = nuevoTexto;
            tareas[indice].descripcion = nuevaDescripcion;
            tareas[indice].fechaModificacion = new Date().toISOString();
            guardarTareasEnStorage();
          }

          // Actualizar fecha de modificación visual
          const divFechaMod = li.querySelector(".fecha-modificacion");
          divFechaMod.textContent = `Modificada: ${formatearFecha(new Date())}`;
          divFechaMod.classList.remove("d-none"); // Mostrar fecha de modificación
        }
      }

      // Función para cancelar edición
      function cancelarEdicion() {
        const divTextoOriginal = document.createElement("div");
        divTextoOriginal.className = "fw-bold flex-grow-1 texto-tarea me-4";
        divTextoOriginal.textContent = textoActual;

        const divDescripcionOriginal = document.createElement("div");
        divDescripcionOriginal.className = "text-muted small";
        divDescripcionOriginal.textContent =
          descripcionActual || "Sin descripción";

        divTextoOriginal.appendChild(divDescripcionOriginal);
        divEdicion.parentNode.replaceChild(divTextoOriginal, divEdicion);
      }

      // Eventos
      btnGuardar.addEventListener("click", guardarEdicion);
      btnCancelar.addEventListener("click", cancelarEdicion);

      inputEditar.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          guardarEdicion();
        }
      });
    }

    // Botón para borrar tarea
    if (e.target.classList.contains("btn-danger")) {
      e.target.closest("li").remove();
      if (listaTareas.querySelectorAll("li").length === 0 && mensajeVacio) {
        mensajeVacio.style.display = "";
      }
    }

    // Botón para leer tarea (alert con detalles)
    if (e.target.classList.contains("btn-info")) {
      const li = e.target.closest("li");
      const divTexto = li.querySelector(".texto-tarea");
      const badge = li.querySelector(".badge");
      alert(`Tarea: ${divTexto.textContent}\nEstado: ${badge.textContent}`);
    }
  });
}

// Ejecutar función main al cargar la página
window.addEventListener("load", main);
