function main() {
  // Selección de elementos del DOM
  const inputTarea = document.getElementById("inputTarea");
  const btnAñadir = document.getElementById("btnAñadir");
  const listaTareas = document.getElementById("listaTareas");
  const mensajeVacio = document.getElementById("mensajeVacio");

  // Función para formatear fecha
  function formatearFecha(fecha) {
    return fecha.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Función para obtener clase según estado
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

  // Función para cambiar al siguiente estado
  function cambiarEstado(estadoActual) {
    const estados = ["Creada", "En proceso", "Terminada"];
    const indexActual = estados.indexOf(estadoActual);
    const siguienteIndex = (indexActual + 1) % estados.length;
    if (estadoActual === "Terminada") {
      return estadoActual;
    }
    return estados[siguienteIndex];
  }

  // Manejo del evento de clic en el botón Añadir
  btnAñadir.addEventListener("click", () => {
    const textoTarea = inputTarea.value.trim();
    if (textoTarea) {
      if (mensajeVacio) mensajeVacio.style.display = "none";

      const fechaActual = new Date();

      const li = document.createElement("li");
      li.className =
        "list-group-item shadow-sm mb-2 border border-secondary rounded";

      const divPrincipal = document.createElement("div");
      divPrincipal.className = "d-flex flex-column";

      const divSuperior = document.createElement("div");
      divSuperior.className =
        "d-flex justify-content-between align-items-start mb-2";

      const divTexto = document.createElement("div");
      divTexto.className = "fw-bold flex-grow-1 texto-tarea";
      divTexto.textContent = textoTarea;

      const divEstadoContainer = document.createElement("div");

      const spanEstado = document.createElement("span");
      spanEstado.className = `badge ${classePorEstado("Creada")}`;
      spanEstado.textContent = "Creada";

      divEstadoContainer.appendChild(spanEstado);

      divSuperior.appendChild(divTexto);
      divSuperior.appendChild(divEstadoContainer);

      const divInferior = document.createElement("div");
      divInferior.className = "d-flex justify-content-between align-items-end";

      const divFechas = document.createElement("div");
      divFechas.className = "small text-muted fechas-container";

      const divFechaCreacion = document.createElement("div");
      divFechaCreacion.className = "fecha-creacion me-2 text-nowrap";
      divFechaCreacion.textContent = `Creada: ${formatearFecha(fechaActual)}`;

      const divFechaMod = document.createElement("div");
      divFechaMod.className = "fecha-modificacion me-2 text-nowrap";
      divFechaMod.textContent = `Modificada: ${formatearFecha(fechaActual)}`;

      divFechas.appendChild(divFechaCreacion);
      divFechas.appendChild(divFechaMod);

      const divBotones = document.createElement("div");
      divBotones.className = "d-flex botones-container";

      const btnCambiarEstado = document.createElement("button");
      btnCambiarEstado.className = "btn btn-success btn-sm me-1";
      btnCambiarEstado.textContent = "Estado";
      // Si el estado es 'Terminada', deshabilitar el botón
      if (spanEstado.textContent === "Terminada") {
        btnCambiarEstado.style.display = "none";
      }

      // Crear el contenedor para los botones de acción
      const divAcciones = document.createElement("div");
      divAcciones.className = "d-flex";

      //btn para editar.
      const btnEditar = document.createElement("button");
      btnEditar.className = "btn btn-primary btn-sm me-1";
      btnEditar.textContent = "Editar";
      //btn para leer.
      const btnLeer = document.createElement("button");
      btnLeer.className = "btn btn-info btn-sm me-1";
      btnLeer.textContent = "Leer";
      //btn para borrar.
      const btnBorrar = document.createElement("button");
      btnBorrar.className = "btn btn-danger btn-sm";
      btnBorrar.textContent = "Borrar";

      // Agregar los botones al contenedor de acciones
      divAcciones.appendChild(btnEditar);
      divAcciones.appendChild(btnLeer);
      divAcciones.appendChild(btnBorrar);

      // Añadir el botón Estado y el contenedor de acciones al contenedor principal de botones
      divBotones.appendChild(btnCambiarEstado);
      divBotones.appendChild(divAcciones);

      //agregar fechas y botones al div inferior
      divInferior.appendChild(divFechas);
      divInferior.appendChild(divBotones);
      //agregar contenido al div principal
      divPrincipal.appendChild(divSuperior);
      divPrincipal.appendChild(divInferior);
      //agregar el div principal al li
      li.appendChild(divPrincipal);
      listaTareas.appendChild(li);

      inputTarea.value = "";
    }
  });

  // Manejo del evento de clic en los botones de las tareas
  listaTareas.addEventListener("click", (e) => {
    // Botón Cambiar Estado
    if (e.target.classList.contains("btn-success")) {
      const li = e.target.closest("li");
      const badge = li.querySelector(".badge");
      const estadoActual = badge.textContent;
      const nuevoEstado = cambiarEstado(estadoActual);
      badge.className = `badge ${classePorEstado(nuevoEstado)}`;
      badge.textContent = nuevoEstado;
      const divFechaMod = li.querySelector(".fecha-modificacion");
      divFechaMod.textContent = `Modificada: ${formatearFecha(new Date())}`;
      //ocultar el botón si el estado es 'Terminada'
      if (nuevoEstado === "Terminada") {
        e.target.style.display = "none";
      }
    }

    // Botón Editar
    if (e.target.classList.contains("btn-primary")) {
      const li = e.target.closest("li");
      const divTexto = li.querySelector(".texto-tarea");
      const textoActual = divTexto.textContent;
      // Crear elementos para la edición
      const inputEditar = document.createElement("input");
      inputEditar.type = "text";
      inputEditar.className = "form-control form-control-sm";
      inputEditar.style.width = "auto";
      inputEditar.value = textoActual;
      // Crear botones para guardar
      const btnGuardar = document.createElement("button");
      btnGuardar.className = "btn btn-success btn-sm ms-2";
      btnGuardar.textContent = "Guardar";
      // Crear botón para cancelar
      const btnCancelar = document.createElement("button");
      btnCancelar.className = "btn btn-secondary btn-sm ms-2";
      btnCancelar.textContent = "Cancelar";
      // Crear un contenedor para los elementos de edición
      const divEdicion = document.createElement("div");
      divEdicion.className = "d-flex align-items-center";
      divEdicion.appendChild(inputEditar);
      divEdicion.appendChild(btnGuardar);
      divEdicion.appendChild(btnCancelar);
      // Reemplazar el div de texto por el de edición
      divTexto.parentNode.replaceChild(divEdicion, divTexto);

      inputEditar.focus();
      inputEditar.select();
      // Guardar el texto original para cancelación
      function guardarEdicion() {
        // Obtener el nuevo texto del input
        const nuevoTexto = inputEditar.value.trim();
        // Validar que el nuevo texto no esté vacío
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
      // Función para cancelar la edición
      function cancelarEdicion() {
        const divTextoOriginal = document.createElement("div");
        divTextoOriginal.className = "fw-bold flex-grow-1 texto-tarea";
        divTextoOriginal.textContent = textoActual;
        divEdicion.parentNode.replaceChild(divTextoOriginal, divEdicion);
      }
      // Asignar eventos a los botones de edición
      btnGuardar.addEventListener("click", guardarEdicion);
      btnCancelar.addEventListener("click", cancelarEdicion);
      // Asignar evento de teclado para Enter en el input de edición
      inputEditar.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          guardarEdicion();
        }
      });
    }

    // Botón Borrar
    if (e.target.classList.contains("btn-danger")) {
      e.target.closest("li").remove();
      if (listaTareas.querySelectorAll("li").length === 0 && mensajeVacio) {
        mensajeVacio.style.display = "";
      }
    }

    // Botón Leer
    if (e.target.classList.contains("btn-info")) {
      const li = e.target.closest("li");
      const divTexto = li.querySelector(".texto-tarea");
      const badge = li.querySelector(".badge");
      alert(`Tarea: ${divTexto.textContent}\nEstado: ${badge.textContent}`);
    }
  });
}

window.addEventListener("load", main);
