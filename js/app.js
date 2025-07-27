function main() {
  // Selección de elementos del DOM
  const inputTarea = document.getElementById("inputTarea");
  const btnAñadir = document.getElementById("btnAñadir");
  const listaTareas = document.getElementById("listaTareas");
  const mensajeVacio = document.getElementById("mensajeVacio");

  // Función para formatear fecha
  function formatearFecha(fecha) {
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Función para obtener clase según estado
  function getClassPorEstado(estado) {
    switch(estado) {
      case 'Creada': return 'bg-secondary';
      case 'En proceso': return 'bg-warning text-dark';
      case 'Terminada': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  // Función para cambiar al siguiente estado
  function cambiarEstado(estadoActual) {
    const estados = ['Creada', 'En proceso', 'Terminada'];
    const indexActual = estados.indexOf(estadoActual);
    const siguienteIndex = (indexActual + 1) % estados.length;
    return estados[siguienteIndex];
  }

  btnAñadir.addEventListener("click", () => {
    const textoTarea = inputTarea.value.trim();
    if (textoTarea) {
      // Oculta el mensaje de vacío si hay tareas
      if (mensajeVacio) mensajeVacio.style.display = "none";

      const fechaActual = new Date();
      
      // Crear elemento li
      const li = document.createElement("li");
      li.className = "list-group-item";

      // Crear contenedor principal
      const divPrincipal = document.createElement("div");
      divPrincipal.className = "d-flex flex-column";

      // Crear contenedor superior (texto + estado)
      const divSuperior = document.createElement("div");
      divSuperior.className = "d-flex justify-content-between align-items-start mb-2";

      // Contenedor del texto
      const divTexto = document.createElement("div");
      divTexto.className = "fw-bold flex-grow-1 texto-tarea";
      divTexto.textContent = textoTarea;

      // Contenedor del estado
      const divEstadoContainer = document.createElement("div");

      // Crear badge de estado
      const spanEstado = document.createElement("span");
      spanEstado.className = `badge ${getClassPorEstado('Creada')}`;
      spanEstado.textContent = 'Creada';

      divEstadoContainer.appendChild(spanEstado);

      // Agregar texto y estado al contenedor superior
      divSuperior.appendChild(divTexto);
      divSuperior.appendChild(divEstadoContainer);

      // Crear contenedor inferior (fechas y botones)
      const divInferior = document.createElement("div");
      divInferior.className = "d-flex justify-content-between align-items-end";

      // Contenedor de fechas
      const divFechas = document.createElement("div");
      divFechas.className = "small text-muted fechas-container";

      // Crear div para fecha de creación
      const divFechaCreacion = document.createElement("div");
      divFechaCreacion.className = "fecha-creacion";
      divFechaCreacion.textContent = `Creada: ${formatearFecha(fechaActual)}`;

      // Crear div para fecha de modificación
      const divFechaMod = document.createElement("div");
      divFechaMod.className = "fecha-modificacion";
      divFechaMod.textContent = `Modificada: ${formatearFecha(fechaActual)}`;

      // Agregar fechas al contenedor
      divFechas.appendChild(divFechaCreacion);
      divFechas.appendChild(divFechaMod);

      // Crear el contenedor de botones
      const divBotones = document.createElement("div");
      divBotones.className = "d-flex botones-container";

      // Crear los botones individuales
      // btn para cambiar estado
      const btnCambiarEstado = document.createElement("button");
      btnCambiarEstado.className = "btn btn-success btn-sm me-1";
      btnCambiarEstado.textContent = "Cambiar Estado";

      // btn para editar la tarea
      const btnEditar = document.createElement("button");
      btnEditar.className = "btn btn-primary btn-sm me-1";
      btnEditar.textContent = "Editar";

      // btn para leer la tarea
      const btnLeer = document.createElement("button");
      btnLeer.className = "btn btn-info btn-sm me-1";
      btnLeer.textContent = "Leer";

      // btn para borrar la tarea
      const btnBorrar = document.createElement("button");
      btnBorrar.className = "btn btn-danger btn-sm";
      btnBorrar.textContent = "Borrar";

      // Agregar los botones al contenedor
      divBotones.appendChild(btnCambiarEstado);
      divBotones.appendChild(btnEditar);
      divBotones.appendChild(btnLeer);
      divBotones.appendChild(btnBorrar);

      // Agregar fechas y botones al contenedor inferior
      divInferior.appendChild(divFechas);
      divInferior.appendChild(divBotones);

      // Agregar contenedores al principal
      divPrincipal.appendChild(divSuperior);
      divPrincipal.appendChild(divInferior);

      // Agregar contenedor principal al li
      li.appendChild(divPrincipal);

      // Agregar li a la lista de tareas
      listaTareas.appendChild(li);

      inputTarea.value = ""; // Limpia el campo de entrada
    }
  });

  // Manejo del evento de clic en los botones de las tareas
  listaTareas.addEventListener("click", (e) => {
    
    // Manejar botón Cambiar Estado
    if (e.target.classList.contains("btn-success")) {
      const li = e.target.closest("li");
      const badge = li.querySelector(".badge");
      const estadoActual = badge.textContent;
      const nuevoEstado = cambiarEstado(estadoActual);

      // Actualizar visualmente el estado
      badge.className = `badge ${getClassPorEstado(nuevoEstado)}`;
      badge.textContent = nuevoEstado;

      // Actualizar fecha de modificación
      const divFechaMod = li.querySelector(".fecha-modificacion");
      divFechaMod.textContent = `Modificada: ${formatearFecha(new Date())}`;
    }

    // Manejar botón Editar
    if (e.target.classList.contains("btn-primary")) {
      const li = e.target.closest("li");
      const divTexto = li.querySelector(".texto-tarea");
      const textoActual = divTexto.textContent;

      // Crear input para editar
      const inputEditar = document.createElement("input");
      inputEditar.type = "text";
      inputEditar.className = "form-control form-control-sm";
      inputEditar.style.width = "auto";
      inputEditar.value = textoActual;

      // Crear botón Guardar
      const btnGuardar = document.createElement("button");
      btnGuardar.className = "btn btn-success btn-sm ms-2";
      btnGuardar.textContent = "Guardar";

      // Crear botón Cancelar
      const btnCancelar = document.createElement("button");
      btnCancelar.className = "btn btn-secondary btn-sm ms-2";
      btnCancelar.textContent = "Cancelar";

      // Crear contenedor para edición
      const divEdicion = document.createElement("div");
      divEdicion.className = "d-flex align-items-center";
      divEdicion.appendChild(inputEditar);
      divEdicion.appendChild(btnGuardar);
      divEdicion.appendChild(btnCancelar);

      // Reemplazar el texto por el modo edición
      divTexto.parentNode.replaceChild(divEdicion, divTexto);

      // Enfocar el input
      inputEditar.focus();
      inputEditar.select();

      // Manejar Guardar
      function guardarEdicion() {
        const nuevoTexto = inputEditar.value.trim();
        if (nuevoTexto !== "") {
          // Crear nuevo div de texto
          const nuevoDivTexto = document.createElement("div");
          nuevoDivTexto.className = "fw-bold flex-grow-1 texto-tarea";
          nuevoDivTexto.textContent = nuevoTexto;

          // Reemplazar modo edición por texto actualizado
          divEdicion.parentNode.replaceChild(nuevoDivTexto, divEdicion);

          // Actualizar fecha de modificación
          const liPadre = e.target.closest("li");
          const divFechaMod = liPadre.querySelector(".fecha-modificacion");
          divFechaMod.textContent = `Modificada: ${formatearFecha(new Date())}`;
        }
      }

      // Manejar Cancelar
      function cancelarEdicion() {
        // Restaurar div de texto original
        const divTextoOriginal = document.createElement("div");
        divTextoOriginal.className = "fw-bold flex-grow-1 texto-tarea";
        divTextoOriginal.textContent = textoActual;

        // Reemplazar modo edición por texto original
        divEdicion.parentNode.replaceChild(divTextoOriginal, divEdicion);
      }

      btnGuardar.addEventListener("click", guardarEdicion);

      btnCancelar.addEventListener("click", cancelarEdicion);

      // Guardar con Enter
      inputEditar.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          guardarEdicion();
        }
      });
    }

    // Manejar botón Borrar
    if (e.target.classList.contains("btn-danger")) {
      e.target.closest("li").remove();
      // Si no quedan tareas, muestra el mensaje vacío
      if (listaTareas.querySelectorAll("li").length === 0 && mensajeVacio) {
        mensajeVacio.style.display = "";
      }
    }

    // manejo del botón Leer
    if (e.target.classList.contains("btn-info")) {
      const li = e.target.closest("li");
      const divTexto = li.querySelector(".texto-tarea");
      const badge = li.querySelector(".badge");
      alert(`Tarea: ${divTexto.textContent}\nEstado: ${badge.textContent}`);
    }
  });
} // Cierre de la función main

window.addEventListener("load", main);