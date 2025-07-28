function main() {
  // Selección de elementos del DOM
  const inputTarea = document.getElementById("inputTarea");
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
    tareas = [];
    listaTareas.innerHTML = "";
    if (mensajeVacio) mensajeVacio.style.display = "";
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
      "list-group-item shadow-sm mb-2 border border-secondary rounded";

    // Contenedor principal
    const divPrincipal = document.createElement("div");
    divPrincipal.className = "d-flex flex-column";

    // Parte superior con texto y estado
    const divSuperior = document.createElement("div");
    divSuperior.className =
      "d-flex justify-content-between align-items-start mb-2";

    const divTexto = document.createElement("div");
    divTexto.className = "fw-bold flex-grow-1 texto-tarea";
    divTexto.textContent = tarea.texto;

    const divEstadoContainer = document.createElement("div");

    const spanEstado = document.createElement("span");
    spanEstado.className = `badge ${classePorEstado(tarea.estado)}`;
    spanEstado.textContent = tarea.estado;

    divEstadoContainer.appendChild(spanEstado);
    divSuperior.appendChild(divTexto);
    divSuperior.appendChild(divEstadoContainer);

    // Parte inferior con fechas y botones
    const divInferior = document.createElement("div");
    divInferior.className = "d-flex justify-content-between align-items-end";

    const divFechas = document.createElement("div");
    divFechas.className = "small text-muted fechas-container";

    const divFechaCreacion = document.createElement("div");
    divFechaCreacion.className = "fecha-creacion me-2 text-nowrap";
    divFechaCreacion.textContent = `Creada: ${formatearFecha(
      tarea.fechaCreacion
    )}`;

    const divFechaMod = document.createElement("div");
    divFechaMod.className = "fecha-modificacion me-2 text-nowrap";
    divFechaMod.textContent = `Modificada: ${formatearFecha(
      tarea.fechaModificacion
    )}`;

    divFechas.appendChild(divFechaCreacion);
    divFechas.appendChild(divFechaMod);

    const divBotones = document.createElement("div");
    divBotones.className = "d-flex botones-container";

    // Botón para cambiar estado
    const btnCambiarEstado = document.createElement("button");
    btnCambiarEstado.className = "btn btn-success btn-sm me-1";
    btnCambiarEstado.textContent = "Estado";
    if (tarea.estado === "Terminada") {
      btnCambiarEstado.style.display = "none";
    }

    btnCambiarEstado.addEventListener("click", () => {
      // Cambiar el estado
      const nuevoEstado = cambiarEstado(tarea.estado);
      tarea.estado = nuevoEstado;
      tarea.fechaModificacion = new Date().toISOString();
      // Guardar los cambios en el localStorage
      guardarTareasEnStorage();
    });

    // Contenedor y botones de acción (editar, leer, borrar)
    const divAcciones = document.createElement("div");
    divAcciones.className = "d-flex";

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-primary btn-sm me-1";
    btnEditar.textContent = "Editar";

    const btnLeer = document.createElement("button");
    btnLeer.className = "btn btn-info btn-sm me-1";
    btnLeer.textContent = "Leer";

    const btnBorrar = document.createElement("button");
    btnBorrar.className = "btn btn-danger btn-sm";
    btnBorrar.textContent = "Borrar";

    // Evento para eliminar tarea de localStorage
    btnBorrar.addEventListener("click", () => {
      // 1. Buscar índice de la tarea
      const indice = tareas.findIndex(
        (t) =>
          t.texto === tarea.texto && t.fechaCreacion === tarea.fechaCreacion
      );

      // 2. Eliminarla si se encontró
      if (indice !== -1) {
        tareas.splice(indice, 1); // Eliminar del array
        guardarTareasEnStorage(); // Actualizar localStorage
      }

      // 3. Eliminar el elemento visual del DOM
      li.remove();

      // 4. Mostrar mensaje de vacío si no hay tareas
      if (tareas.length === 0 && mensajeVacio) {
        mensajeVacio.style.display = "block";
      }
    });

    divAcciones.appendChild(btnEditar);
    divAcciones.appendChild(btnLeer);
    divAcciones.appendChild(btnBorrar);

    divBotones.appendChild(btnCambiarEstado);
    divBotones.appendChild(divAcciones);

    divInferior.appendChild(divFechas);
    divInferior.appendChild(divBotones);
    divPrincipal.appendChild(divSuperior);
    divPrincipal.appendChild(divInferior);
    li.appendChild(divPrincipal);
    listaTareas.appendChild(li);
  }

  // Mostrar tareas guardadas al iniciar
  if (tareas.length > 0 && mensajeVacio) mensajeVacio.style.display = "none";
  tareas.forEach((t) => crearElementoTarea(t));

  // Evento para añadir una nueva tarea
  btnAñadir.addEventListener("click", () => {
    const textoTarea = inputTarea.value.trim();
    if (textoTarea) {
      if (mensajeVacio) mensajeVacio.style.display = "none";

      const nuevaTarea = {
        texto: textoTarea,
        estado: "Creada",
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
      };

      tareas.push(nuevaTarea);
      guardarTareasEnStorage();
      crearElementoTarea(nuevaTarea);
      inputTarea.value = "";
    }
  });

  // Delegación de eventos para botones de cada tarea
  listaTareas.addEventListener("click", (e) => {
    // Botón para cambiar estado
    if (e.target.classList.contains("btn-success")) {
      const li = e.target.closest("li");
      const badge = li.querySelector(".badge");
      const estadoActual = badge.textContent;
      const nuevoEstado = cambiarEstado(estadoActual);
      badge.className = `badge ${classePorEstado(nuevoEstado)}`;
      badge.textContent = nuevoEstado;
      const divFechaMod = li.querySelector(".fecha-modificacion");
      divFechaMod.textContent = `Modificada: ${formatearFecha(new Date())}`;
      if (nuevoEstado === "Terminada") {
        e.target.style.display = "none";
      }
    }

    // Botón para editar texto
    if (e.target.classList.contains("btn-primary")) {
      const li = e.target.closest("li");
      const divTexto = li.querySelector(".texto-tarea");
      const textoActual = divTexto.textContent;

      const inputEditar = document.createElement("input");
      inputEditar.type = "text";
      inputEditar.className = "form-control form-control-sm";
      inputEditar.style.width = "auto";
      inputEditar.value = textoActual;

      const btnGuardar = document.createElement("button");
      btnGuardar.className = "btn btn-success btn-sm ms-2";
      btnGuardar.textContent = "Guardar";

      const btnCancelar = document.createElement("button");
      btnCancelar.className = "btn btn-secondary btn-sm ms-2";
      btnCancelar.textContent = "Cancelar";

      const divEdicion = document.createElement("div");
      divEdicion.className = "d-flex align-items-center";
      
      divEdicion.appendChild(inputEditar);
      divEdicion.appendChild(btnGuardar);
      divEdicion.appendChild(btnCancelar);

      divTexto.parentNode.replaceChild(divEdicion, divTexto);
      inputEditar.focus();
      inputEditar.select();

      // Guardar texto editado
      function guardarEdicion() {
        const nuevoTexto = inputEditar.value.trim();
        if (nuevoTexto !== "") {
          const nuevoDivTexto = document.createElement("div");
          nuevoDivTexto.className = "fw-bold flex-grow-1 texto-tarea";
          nuevoDivTexto.textContent = nuevoTexto;
          divEdicion.parentNode.replaceChild(nuevoDivTexto, divEdicion);
          const liPadre = e.target.closest("li");
          const divFechaMod = liPadre.querySelector(".fecha-modificacion");
          divFechaMod.textContent = `Modificada: ${formatearFecha(new Date())}`;
        }
      }

      // Cancelar edición
      function cancelarEdicion() {
        const divTextoOriginal = document.createElement("div");
        divTextoOriginal.className = "fw-bold flex-grow-1 texto-tarea";
        divTextoOriginal.textContent = textoActual;
        divEdicion.parentNode.replaceChild(divTextoOriginal, divEdicion);
      }
      // Asignar eventos a los botones de edición
      btnGuardar.addEventListener("click", guardarEdicion);
      btnCancelar.addEventListener("click", cancelarEdicion);
      // Permitir guardar con Enter
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
