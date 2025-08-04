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

// Función para clases de Bootstrap (badges, pequeños elementos)
function classePorEstado(estado) {
  switch (estado) {
    case "Creada":
      return "bg-success-subtle text-dark shadow border border-success";
    case "Pendiente":
      return "bg-secondary-subtle text-dark shadow border border-secondary";
    case "En proceso":
      return "bg-warning-subtle text-dark shadow border border-warning";
    case "En revisión":
      return "bg-info-subtle text-dark shadow border border-info";
    case "Terminada":
      return "bg-danger-subtle text-dark shadow border border-danger";
    case "Bloqueada":
      return "bg-dark-subtle text-dark shadow border border-dark";
    default:
      return "bg-light-subtle text-dark shadow border border-light";
  }
}

// Función para clases personalizadas (tarjetas principales)
function classePorEsTareas(estado) {
  switch (estado) {
    case "Creada":
      return "itemEstado-creado text-dark";
    case "Pendiente":
      return "itemEstado-pendiente text-dark";
    case "En proceso":
      return "itemEstado-en-proceso text-dark";
    case "En revisión":
      return "itemEstado-en-revision text-dark"; // Corregí "revicion" por "revision"
    case "Terminada":
      return "itemEstado-terminada text-dark";
    case "Bloqueada":
      return "itemEstado-bloqueada text-dark";
    default:
      return "itemEstado-creado text-dark";
  }
}

  // Cambia el estado actual de la tarea al siguiente
  function cambiarEstado(estadoActual) {
    const estados = ["Creada", "Pendiente", "En proceso", "En revisión", "Terminada"];
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
    li.className = `tarea-item tareasCard ${classePorEsTareas(tarea.estado)}`;

    // Contenedor principal
    const divPrincipal = document.createElement("div");
    divPrincipal.className = "d-flex flex-column p-2";

    // Parte superior: texto + estado
    const divSuperior = document.createElement("div");
    divSuperior.className =
      "d-flex justify-content-between align-items-start mb-2";

    const divTexto = document.createElement("div");
    divTexto.className = "fw-bold texto-tarea";
    divTexto.textContent = tarea.texto;

    const divDescripcion = document.createElement("div");
    divDescripcion.className = "fw-bold  texto-tarea";
    divDescripcion.textContent = tarea.descripcion;
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
    divFechaMod.classList.add("d-none"); // Siempre oculta inicialmente

    divInferior.appendChild(divFechaCreacion);
    divInferior.appendChild(divFechaMod);
    divPrincipal.appendChild(divInferior);

    // Botones: Estado, Editar, Ver, Borrar ------------
    const divBotones = document.createElement("div");
    divBotones.className = "d-flex justify-content-end flex-wrap gap-1 ";

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
    };

    tareas.push(nuevaTarea);
    guardarTareasEnStorage();
    crearElementoTarea(nuevaTarea);

    // Limpiar campos
    inputTarea.value = "";
    inputDescripcion.value = "";

    // Ocultar mensaje vacío
    if (mensajeVacio) mensajeVacio.style.display = "none";
    console.log(mensajeVacio);
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

      // 1. Actualiza el badge visualmente
      badge.textContent = nuevoEstado;
      badge.className = `badge ${classePorEstado(nuevoEstado)}`;

      // 2. Actualiza el contenedor principal (li)
      li.className = `tarea-item tareasCard ${classePorEsTareas(nuevoEstado)}`;

      // 3. CORRECCIÓN CLAVE: Usa data-fecha en lugar del texto formateado
      const fechaCreacion = li
        .querySelector(".fecha-creacion")
        .getAttribute("data-fecha");
      const indice = tareas.findIndex((t) => t.fechaCreacion === fechaCreacion);

      if (indice !== -1) {
        // 4. Actualiza el estado y fecha de modificación
        tareas[indice].estado = nuevoEstado;
        tareas[indice].fechaModificacion = new Date().toISOString();

        // 5. Guarda en localStorage
        guardarTareasEnStorage();
      }

      // 6. Muestra fecha de modificación
      const divFechaMod = li.querySelector(".fecha-modificacion");
      divFechaMod.textContent = `Modificada: ${formatearFecha(new Date())}`;
      divFechaMod.classList.remove("d-none");

      // 7. Oculta botón si está terminada
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

      //crea el input
      const inputTexto = document.createElement("input");
      inputTexto.type = "text";
      inputTexto.className = "form-control form-control-sm mb-1";
      inputTexto.placeholder = "Actualiza título...";
      inputTexto.value = textoActual;

      // Establece límites
      inputTexto.minLength = 3;
      inputTexto.maxLength = 50;

      // Validación en tiempo real
      inputTexto.addEventListener("input", function () {
        if (this.value.length > this.maxLength) {
          this.value = this.value.slice(0, this.maxLength);
        }
      });
      // crea el textarea
      const textareaDesc = document.createElement("textarea");
      textareaDesc.className = "form-control form-control-sm mb-1 small text-muted";
      textareaDesc.rows = 2;
      textareaDesc.placeholder = "Añade la Descripción...";
      textareaDesc.value = descripcionActual;

      // Establece límites
      textareaDesc.minLength = 5;
      textareaDesc.maxLength = 50;

      // Deshabilitar redimensión
      textareaDesc.style.resize = "none";

      // Control de caracteres en tiempo real
      textareaDesc.addEventListener("input", function () {
        // Limitar a maxLength caracteres
        if (this.value.length > this.maxLength) {
          this.value = this.value.slice(0, this.maxLength);
        }
      });

      //Crea los btn para el textarea e input (Aceptar/Cancelar).
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
  // Obtener y limpiar los valores de los inputs
  const nuevoTexto = inputTexto.value.trim();
  
  // Validar que el texto no esté vacío
  if (!nuevoTexto) {
    alert("El texto no puede estar vacío.");
    return; // Detener la función si está vacío
  }
  
  // Obtener y limpiar la descripción
  const nuevaDesc = textareaDesc.value.trim();

  // Crear nuevo contenedor para el texto de la tarea
  const nuevoDivTexto = document.createElement("div");
  nuevoDivTexto.className = "fw-bold flex-grow-1 texto-tarea me-4"; // Estilos
  nuevoDivTexto.textContent = nuevoTexto; // Asignar el nuevo texto

  // Crear contenedor para la descripción
  const nuevoDivDesc = document.createElement("div");
  nuevoDivDesc.className = "text-muted small"; // Texto pequeño y gris
  nuevoDivDesc.textContent = nuevaDesc || "Sin descripción"; // Usar texto alternativo si está vacío
  nuevoDivTexto.appendChild(nuevoDivDesc); // Agregar descripción al div de texto

  // Reemplazar el formulario de edición con los nuevos elementos
  divEdicion.parentNode.replaceChild(nuevoDivTexto, divEdicion);

  // Buscar la tarea original para actualizarla
  const fechaCreacion = li.querySelector(".fecha-creacion").getAttribute("data-fecha");
  const indice = tareas.findIndex((t) => t.fechaCreacion === fechaCreacion);
  
  // Si se encontró la tarea, actualizarla
  if (indice !== -1) {
    tareas[indice].texto = nuevoTexto; // Actualizar texto
    tareas[indice].descripcion = nuevaDesc; // Actualizar descripción
    tareas[indice].fechaModificacion = new Date().toISOString(); // Actualizar fecha
    guardarTareasEnStorage(); // Guardar en localStorage
  }

  // Actualizar la fecha de modificación visualmente
  const divFechaMod = li.querySelector(".fecha-modificacion");
  divFechaMod.textContent = `Modificada: ${formatearFecha(new Date())}`;
  divFechaMod.classList.remove("d-none"); // Mostrar el elemento
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
      const descripcion = li.querySelector(".text-muted.small")?.textContent;
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
