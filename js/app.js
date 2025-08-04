function main() {
  // Selección de elementos del DOM
  const inputTarea = document.getElementById("inputTarea");
  const inputDescripcion = document.getElementById("inputDescripcion");
  const btnAñadir = document.getElementById("btnAñadir");
  const listaTareas = document.getElementById("listaTareas");
  const mensajeVacio = document.getElementById("mensajeVacio");
  const btnEliminarTodo = document.getElementById("btnEliminarTodo");
  // Cargar tareas desde localStorage o inicializar como arreglo vacío
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];

  // Función que guarda las tareas actuales en localStorage
  function guardarTareasEnStorage() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }

  if (btnEliminarTodo) {
    btnEliminarTodo.addEventListener("click", () => {
      // Tu función para eliminar todo
      eliminarTareasEnStorage();
    });
  }
  
  function eliminarTareasEnStorage() {
    localStorage.removeItem("tareas"); // Borra las tareas guardadas
    tareas.splice(0, tareas.length); // Vacía el arreglo de tareas correctamente
    listaTareas.innerHTML = ""; // Limpia la lista visual
    if (mensajeVacio) mensajeVacio.style.display = "block"; // Muestra mensaje vacío
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
    if (estadoActual === "Terminada" || indexActual === -1) {
      return estadoActual;
    }
    return estados[siguienteIndex];
  }

  // Crea visualmente un elemento de tarea y lo añade al DOM
  function crearElementoTarea(tarea) {
    const li = document.createElement("li");
    li.className =
      "tarea-item";

    // Contenedor principal
    const divPrincipal = document.createElement("div");
    divPrincipal.className = "d-flex flex-column p-2";

    // Parte superior: texto + estado
    const divSuperior = document.createElement("div");
    divSuperior.className =
      "d-flex justify-content-between align-items-start mb-2";

    const divTexto = document.createElement("div");
    divTexto.className = "fw-bold flex-grow-1 texto-tarea me-4";
    divTexto.textContent = tarea.texto;

    const divDescripcion = document.createElement("div");
    divDescripcion.className = "text-muted small";
    divDescripcion.textContent = tarea.descripcion || "Sin descripción";
    divTexto.appendChild(divDescripcion);

    const spanEstado = document.createElement("span");
    spanEstado.className = `badge ${classePorEstado(tarea.estado)}`;
    spanEstado.textContent = tarea.estado;

    divSuperior.appendChild(divTexto);
    divSuperior.appendChild(spanEstado);
    divPrincipal.appendChild(divSuperior);

    // Parte inferior: fechas
    const divInferior = document.createElement("div");
    divInferior.className = "mb-2";

    const divFechaCreacion = document.createElement("div");
    divFechaCreacion.className = "fecha-creacion text-nowrap";
    divFechaCreacion.textContent = `Creada: ${formatearFecha(
      tarea.fechaCreacion
    )}`;
    // fecha original en data-fecha
    divFechaCreacion.setAttribute("data-fecha", tarea.fechaCreacion);

    const divFechaMod = document.createElement("div");
    divFechaMod.className =
      "fecha-modificacion small text-muted text-nowrap d-none";
    if (tarea.fechaModificacion) {
      divFechaMod.textContent = `Modificada: ${formatearFecha(
        tarea.fechaModificacion
      )}`;
      divFechaMod.classList.remove("d-none");
    }

    divInferior.appendChild(divFechaCreacion);
    divInferior.appendChild(divFechaMod);
    divPrincipal.appendChild(divInferior);

    // Botones: Estado, Editar, Ver, Borrar ------------
    const divBotones = document.createElement("div");
    divBotones.className = "d-flex justify-content-end flex-wrap gap-2 ";

    const btnEstado = document.createElement("button");
    btnEstado.className = "btn btn-success btn-sm shadow";
    btnEstado.textContent = "Estado";
    if (tarea.estado === "Terminada") {
      btnEstado.style.display = "none";
    }

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-primary btn-sm ";
    btnEditar.textContent = "Editar";

    const btnVer = document.createElement("button");
    btnVer.className = "btn btn-info btn-sm";
    btnVer.textContent = "Ver";

    const btnBorrar = document.createElement("button");
    btnBorrar.className = "btn btn-danger btn-sm";
    btnBorrar.textContent = "Borrar";

    divBotones.appendChild(btnEstado);
    divBotones.appendChild(btnEditar);
    divBotones.appendChild(btnVer);
    divBotones.appendChild(btnBorrar);

    divPrincipal.appendChild(divBotones);
    li.appendChild(divPrincipal);
    listaTareas.appendChild(li);
  }

  // Mostrar tareas guardadas al cargar
  if (tareas.length > 0 && mensajeVacio) {
    mensajeVacio.style.display = "none";
  } else if (mensajeVacio) {
    mensajeVacio.style.display = "block";
  }

  tareas.forEach((tarea) => crearElementoTarea(tarea));

  // Evento: Añadir nueva tarea
  btnAñadir.addEventListener("click", () => {
    const texto = inputTarea.value.trim();
    const descripcion = inputDescripcion.value.trim();

    if (!texto) {
      alert("La tarea no puede estar vacía.");
      return;
    }

    const nuevaTarea = {
      texto,
      descripcion,
      estado: "Creada",
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString(),
    };

    tareas.push(nuevaTarea);
    guardarTareasEnStorage();
    crearElementoTarea(nuevaTarea);

    // Limpiar campos
    inputTarea.value = "";
    inputDescripcion.value = "";

    // Ocultar mensaje vacío
    if (mensajeVacio) mensajeVacio.style.display = "none";
    console.log(mensajeVacio)
  });

  // Evento: Manejar clics en la lista de tareas
  listaTareas.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    // Botón: Cambiar estado
    if (e.target.classList.contains("btn-success")) {
      const badge = li.querySelector(".badge");
      const estadoActual = badge.textContent;
      const nuevoEstado = cambiarEstado(estadoActual);

      badge.textContent = nuevoEstado;
      badge.className = `badge ${classePorEstado(nuevoEstado)}`;
      // Actualizar el estado en el arreglo de tareas
      const fechaCreacion = li
        .querySelector(".fecha-creacion")
        .textContent.split(": ")[1];
      const indice = tareas.findIndex((t) => t.fechaCreacion === fechaCreacion);
      if (indice !== -1) {
        tareas[indice].estado = nuevoEstado;
        tareas[indice].fechaModificacion = new Date().toISOString();
        guardarTareasEnStorage();
      }

      // Mostrar fecha de modificación
      const divFechaMod = li.querySelector(".fecha-modificacion");
      divFechaMod.textContent = `Modificada: ${formatearFecha(new Date())}`;
      divFechaMod.classList.remove("d-none");

      // Ocultar botón si está terminada
      if (nuevoEstado === "Terminada") {
        e.target.style.display = "none";
      }
    }

    // Botón: Editar
    if (e.target.classList.contains("btn-primary")) {
      const divTexto = li.querySelector(".texto-tarea");
      const divDescripcion = divTexto.querySelector(".text-muted.small");
      const textoActual = divTexto.childNodes[0].nodeValue.trim();
      const descripcionActual = divDescripcion
        ? divDescripcion.textContent
        : "";

      const inputTexto = document.createElement("input");
      inputTexto.type = "text";
      inputTexto.className = "form-control form-control-sm mb-1";
      inputTexto.value = textoActual;

      const textareaDesc = document.createElement("textarea");
      textareaDesc.className = "form-control form-control-sm mb-1";
      textareaDesc.rows = 2;
      textareaDesc.value = descripcionActual;

      const btnGuardar = document.createElement("button");
      btnGuardar.className = "btn btn-success btn-sm me-1";
      btnGuardar.textContent = "Aceptar";

      const btnCancelar = document.createElement("button");
      btnCancelar.className = "btn btn-danger btn-sm";
      btnCancelar.textContent = "Cancelar";

      const divEdicion = document.createElement("div");
      divEdicion.className = "d-flex flex-column flex-grow-1";
      divEdicion.appendChild(inputTexto);
      divEdicion.appendChild(textareaDesc);
      divEdicion
        .appendChild(document.createElement("div"))
        .append(btnGuardar, btnCancelar);

      divTexto.parentNode.replaceChild(divEdicion, divTexto);

      const guardar = () => {
        const nuevoTexto = inputTexto.value.trim();
        if (!nuevoTexto) {
          alert("El texto no puede estar vacío.");
          return;
        }
        const nuevaDesc = textareaDesc.value.trim();

        const nuevoDivTexto = document.createElement("div");
        nuevoDivTexto.className = "fw-bold flex-grow-1 texto-tarea me-4";
        nuevoDivTexto.textContent = nuevoTexto;

        const nuevoDivDesc = document.createElement("div");
        nuevoDivDesc.className = "text-muted small";
        nuevoDivDesc.textContent = nuevaDesc || "Sin descripción";
        nuevoDivTexto.appendChild(nuevoDivDesc);

        divEdicion.parentNode.replaceChild(nuevoDivTexto, divEdicion);

        const fechaCreacion = li
          .querySelector(".fecha-creacion")
          .textContent.split(": ")[1];
        const indice = tareas.findIndex(
          (t) => t.fechaCreacion === fechaCreacion
        );
        if (indice !== -1) {
          tareas[indice].texto = nuevoTexto;
          tareas[indice].descripcion = nuevaDesc;
          tareas[indice].fechaModificacion = new Date().toISOString();
          guardarTareasEnStorage();
        }

        const divFechaMod = li.querySelector(".fecha-modificacion");
        divFechaMod.textContent = `Modificada: ${formatearFecha(new Date())}`;
        divFechaMod.classList.remove("d-none");
      };

      btnGuardar.addEventListener("click", guardar);
      btnCancelar.addEventListener("click", () => {
        divEdicion.parentNode.replaceChild(divTexto, divEdicion);
      });
      inputTexto.addEventListener("keypress", (ev) => {
        if (ev.key === "Enter") guardar();
      });
    }

    // Botón: Ver (mostrar detalles) FALTA MODAL
    if (e.target.classList.contains("btn-info")) {
      const divTexto = li.querySelector(".texto-tarea");
      const badge = li.querySelector(".badge");
      const descripcion =
        li.querySelector(".text-muted.small")?.textContent || "Sin descripción";
      //obcional: mostrar en un modal e eliminar alerta
      alert(`Tarea: ${divTexto.childNodes[0].nodeValue.trim()}
Descripción: ${descripcion}
Estado: ${badge.textContent}`);
    }

    // Botón: Borrar
    if (e.target.classList.contains("btn-danger")) {
      const fechaCreacion = li
        .querySelector(".fecha-creacion")
        .getAttribute("data-fecha");
      const indice = tareas.findIndex((t) => t.fechaCreacion === fechaCreacion);
      if (indice !== -1) {
        tareas.splice(indice, 1);
        guardarTareasEnStorage();
      }
      li.remove();

      if (tareas.length === 0 && mensajeVacio) {
        mensajeVacio.style.display = "block";
      }
    }
  });
}

// Ejecutar al cargar la página
window.addEventListener("load", main);
