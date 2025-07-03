document.addEventListener("DOMContentLoaded", () => {
  const arrow = document.querySelector(".arrow");
  const content = document.querySelector(".collapsible-content");
  const header = document.querySelector(".collapsible-header");

  if (arrow && content && header) {
    content.style.display = "block";
    arrow.style.transform = "rotate(90deg)";
    header.addEventListener("click", () => {
      const visible = content.style.display === "block";
      content.style.display = visible ? "none" : "block";
      arrow.style.transform = visible ? "rotate(0deg)" : "rotate(90deg)";
    });
  }

  // Abrir modal de tarea general
  document.querySelectorAll(".task-block").forEach((el) => {
    el.addEventListener("click", () => {
        const modal = document.getElementById("task-modal");
        if (!modal) return;

        // Campos del modal
        const cliente = document.getElementById("modal-cliente");
        const titulo = document.getElementById("modal-titulo");
        const asunto = document.getElementById("modal-asunto");
        const horasTotales = document.getElementById("modal-horas-totales");
        const horasTrabajadas = document.getElementById("modal-horas-trabajadas");
        const horasCanceladas = document.getElementById("modal-horas-canceladas");
        const desde = document.getElementById("modal-desde");
        const hasta = document.getElementById("modal-hasta");

        // Lista de tareas y ver más
        const listaTareas = document.getElementById("lista-tareas-modal");
        const mensajeMasTareas = document.getElementById("mensaje-mas-tareas");


        // Simulación de tareas (podrías traer esto dinámico si lo deseas)
        const tareas = [
        "Creación de prototipo 1",
        "Benchmark de tecnologías",
        "Presentación de prototipos",
        "Preparar demo",
        "Documentación final"
        ];

        // Llenar los campos del modal
        cliente.textContent = "SEIDOR HCC";
        titulo.textContent = el.textContent;
        asunto.textContent = "Sin asunto";
        horasTotales.textContent = "40";
        horasTrabajadas.textContent = "40";
        horasCanceladas.textContent = "0";
        desde.textContent = "9 jun 2025, 09:00:00";
        hasta.textContent = "13 jun 2025, 18:00:00";

        // Limpiar tareas anteriores
        listaTareas.innerHTML = "";

        // Mostrar hasta 3 tareas
        tareas.slice(0, 3).forEach(t => {
        const li = document.createElement("li");
        li.innerHTML = `<button class="tarea-item">${t}</button>`;
        listaTareas.appendChild(li);
        });

        // Limpiar tareas anteriores
        listaTareas.innerHTML = "";

        // Mostrar hasta 3 tareas
        tareas.slice(0, 3).forEach(t => {
        const li = document.createElement("li");
        li.innerHTML = `<button class="tarea-item">${t}</button>`;
        listaTareas.appendChild(li);
        });

        // Mostrar mensaje si hay más de 3 tareas
        if (tareas.length > 3) {
        mensajeMasTareas.style.display = "block";
        } else {
        mensajeMasTareas.style.display = "none";
        }


        // Mostrar el modal
        modal.classList.remove("hidden");
    });
});


  // Cerrar modal de tarea general
  const closeButton = document.querySelector(".close-button");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      const modal = document.getElementById("task-modal");
      if (modal) modal.classList.add("hidden");
    });
  }


});
