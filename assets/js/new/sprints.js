
document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("sprint-table-body");

  const sprints = [
    {
      nombre: "Sprint 1",
      objetivo: "Estos son los objetivos del sprint",
      activo: true,
      cronograma: "jun. 1 - 14",
      completado: true,
      inicio: "jun. 9, 10:49 AM",
      fin: "jun. 14, 5:00 PM"
    },
    {
      nombre: "Sprint 2",
      objetivo: "Agregar funcionalidad a los prototipos",
      activo: false,
      cronograma: "jun. 18 - 20",
      completado: false,
      inicio: "jun. 18, 9:00 AM",
      fin: "jun. 20, 5:00 PM"
    }
  ];

  sprints.forEach(sprint => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${sprint.nombre}</td>
      <td>${sprint.objetivo}</td>
      <td>${sprint.activo ? "✔️" : ""}</td>
      <td>${sprint.cronograma}</td>
      <td>${sprint.completado ? "✔️" : ""}</td>
      <td>${sprint.inicio}</td>
      <td>${sprint.fin}</td>
      <td>
        <button class="chat-button">💬</button>
        <button class="delete-button">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Eliminar fila
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-button")) {
      const fila = e.target.closest("tr");
      if (fila) fila.remove();
    }
  });

  // Modal de detalle
  const sprintModal = document.getElementById("sprint-modal");
  const closeSprint = document.querySelector(".close-sprint-modal");

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("chat-button")) {
      sprintModal.style.display = "block";
    }
  });

  closeSprint.addEventListener("click", () => {
    sprintModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === sprintModal) {
      sprintModal.style.display = "none";
    }
  });

  // Editar celdas doble clic
  agregarEdicionDobleClick(tbody);


  // Sidebar siempre desplegado
  const sidebar = document.querySelector('.collapsible-content');
  const arrow = document.querySelector('.arrow');
  if (sidebar && arrow) {
    sidebar.style.display = 'block';
    arrow.style.transform = 'rotate(90deg)';
  }

  // tabs en el modal de sprint
  const tabButtons = document.querySelectorAll("#sprint-modal .tab-button");
  const tabContents = document.querySelectorAll("#sprint-modal .tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(tab => tab.style.display = "none");

      button.classList.add("active");
      document.getElementById(button.dataset.tab).style.display = "block";
    });
  });

  // GANTT
  const navItems = document.querySelectorAll(".nav-item");
    const views = document.querySelectorAll(".view-section");

    // navItems.forEach(item => {
    // item.addEventListener("click", () => {
    //     const viewId = item.getAttribute("data-view");

    //     views.forEach(v => v.style.display = "none");
    //     document.getElementById(viewId).style.display = "block";

    //     navItems.forEach(i => i.classList.remove("active"));
    //     item.classList.add("active");
    // });
    // });

    // AGREGAR SPRINT GANTT 
    const openModalBtn = document.querySelector(".gantt-add-task-sprint");
    const modal = document.getElementById("gantt-sprint-modal");
    const closeModal = document.querySelector(".close-gantt-sprint-modal");
    const guardarBtn = document.getElementById("guardar-sprint-gantt");

    if (openModalBtn && modal && closeModal && guardarBtn) {
        openModalBtn.addEventListener("click", () => {
        modal.style.display = "block";
        });

        closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        });

        window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
        });

        guardarBtn.addEventListener("click", () => {
            const nombre = document.getElementById("gantt-sprint-grupo")?.value.trim();
            const objetivos = document.getElementById("gantt-sprint-objetivos")?.value.trim();
            const cronogramaTexto = document.getElementById("gantt-sprint-cronograma")?.value.trim();

            if (!nombre || !cronogramaTexto) {
                alert("Completa el nombre y el cronograma.");
                return;
            }

            const [desdeTxt, hastaTxt] = cronogramaTexto.split(" - ");
            const meses = {
                ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6,
                ago: 7, sep: 8, oct: 9, nov: 10, dic: 11
            };

            const parseFecha = (texto) => {
                const [mesTxt, dia] = texto.split(".");
                const mesKey = mesTxt.toLowerCase().replace(".", "");
                const mes = meses[mesKey];
                const year = new Date().getFullYear();
                return new Date(year, mes, parseInt(dia));
            };

            const inicio = parseFecha(desdeTxt);
            const fin = parseFecha(hastaTxt);

            const color = ["azul", "verde", "rojo", "naranja"][sprintsGantt.length % 4];

            sprintsGantt.push({
                nombre,
                inicio: inicio.toISOString().split("T")[0],
                fin: fin.toISOString().split("T")[0],
                color
            });

            // Redibuja
            const modo = document.getElementById("gantt-vista-sprint")?.value || "semanas";
            if (modo === "dias") {
                renderGanttSprintsPorDias();
            } else {
                renderGanttSprintsPorSemanas();
            }

            modal.style.display = "none";
            });

    }

    // Litepicker para rango cronograma
    const cronogramaInput = document.getElementById("gantt-sprint-cronograma");
    if (cronogramaInput) {
        new Litepicker({
        element: cronogramaInput,
        singleMode: false,
        format: 'MMM. D',
        lang: 'es',
        numberOfMonths: 2,
        numberOfColumns: 2,
        autoApply: true,
        setup: (picker) => {
            picker.on('selected', (start, end) => {
            const meses = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];
            const desde = `${meses[start.getMonth()]} ${start.getDate()}`;
            const hasta = `${meses[end.getMonth()]} ${end.getDate()}`;
            cronogramaInput.value = `${desde} - ${hasta}`;
            });
        }
        });
    }
});

document.getElementById("btn-nuevo-sprint").addEventListener("click", () => {
  const tbody = document.getElementById("sprint-table-body");

  if (document.querySelector(".nueva-fila-sprint")) return;

  const tr = document.createElement("tr");
  tr.classList.add("nueva-fila-sprint");
  tr.innerHTML = `
    <td><input type="text" placeholder="Nombre del sprint" class="input-nombre-sprint" /></td>
    <td>—</td>
    <td></td>
    <td>—</td>
    <td></td>
    <td>—</td>
    <td>—</td>
    <td></td>
  `;
  tbody.appendChild(tr);

  const input = tr.querySelector(".input-nombre-sprint");
  input.focus();

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const nombre = input.value.trim();
      if (!nombre) {
        alert("El nombre del sprint es obligatorio.");
        return;
      }
      confirmarSprint(tr, nombre);
    }
  });

  input.addEventListener("blur", function () {
    const nombre = input.value.trim();
    if (!nombre) {
      tr.remove();
    } else {
      confirmarSprint(tr, nombre);
    }
  });


  const sprintModal = document.getElementById("sprint-modal");
  const closeSprintBtn = document.querySelector(".close-sprint-modal");

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("chat-button")) {
      sprintModal.style.display = "block";
    }
  });

  closeSprintBtn.addEventListener("click", () => {
    sprintModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === sprintModal) {
      sprintModal.style.display = "none";
    }
  });

  
});

function confirmarSprint(tr, nombre) {
  tr.classList.remove("nueva-fila-sprint");
  tr.innerHTML = `
    <td>${nombre}</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>—</td>
    <td>—</td>
    <td>
      <button class="chat-button">💬</button>
      <button class="delete-button">🗑️</button>
    </td>
  `;

  // Validar si ya existe en el Gantt
  const yaExiste = sprintsGantt.some(s => s.nombre === nombre);
  if (yaExiste) return; // No agregar duplicado

  // Generar fechas base
  const hoy = new Date();
  const inicio = new Date(hoy);
  const fin = new Date(hoy);
  fin.setDate(inicio.getDate() + 2);

  const inicioStr = inicio.toISOString().split("T")[0];
  const finStr = fin.toISOString().split("T")[0];

  const color = ["azul", "verde", "rojo", "naranja"][sprintsGantt.length % 4];

  sprintsGantt.push({
    nombre,
    inicio: inicioStr,
    fin: finStr,
    color
  });
}



////

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const views = document.querySelectorAll(".view-section");

  navItems.forEach(item => {
  item.addEventListener("click", () => {
    const viewId = item.getAttribute("data-view");

    views.forEach(v => v.style.display = "none");
    document.getElementById(viewId).style.display = "block";

    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    // Mostrar u ocultar los grupos nuevos según la vista
    const gruposContainer = document.getElementById("grupos-sprints-container");
    const botonAgregarGrupo = document.getElementById("btn-agregar-grupo");

    if (viewId === "gantt-view") {
      gruposContainer.style.display = "none";
      botonAgregarGrupo.style.display = "none";
    } else {
      gruposContainer.style.display = "block";
      botonAgregarGrupo.style.display = "inline-block";
    }

    // Redibujar Gantt
    if (viewId === "gantt-view") {
      const modo = document.getElementById("gantt-vista-sprint").value;
      if (modo === "dias") {
        renderGanttSprintsPorDias();
      } else {
        renderGanttSprintsPorSemanas();
      }
    }
  });
});


  // Cambio de tipo de vista
  const selectVista = document.getElementById("gantt-vista-sprint");
  if (selectVista) {
    selectVista.addEventListener("change", () => {
      if (selectVista.value === "dias") {
        renderGanttSprintsPorDias();
      } else {
        renderGanttSprintsPorSemanas();
      }
    });
  }
});

document.getElementById("btn-agregar-grupo").addEventListener("click", () => {
  const container = document.getElementById("grupos-sprints-container");

  const grupoId = `grupo-sprint-${document.querySelectorAll('.grupo-sprint').length + 1}`;

  const nuevoGrupo = document.createElement("div");
  nuevoGrupo.classList.add("grupo-sprint");
  nuevoGrupo.innerHTML = `
    <div class="table-wrapper">
        <div class="toolbar sprint-header grupo-header-bar">
        <input type="text" class="input-nombre-grupo" value="Grupo sin nombre" />
        <button class="add-sprint-btn">+ Agregar Sprint</button>
        </div>

        <table class="task-table">
        <thead>
            <tr>
            <th>Sprint</th>
            <th>Objetivo</th>
            <th>Sprint activo</th>
            <th>Cronograma de Sprint</th>
            <th>¿Completado?</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Detalles</th>
            </tr>
        </thead>
        <tbody id="${grupoId}">
            <tr><td colspan="8" style="text-align: center; color: #888;">Sin sprints aún</td></tr>
        </tbody>
        </table>
    </div>
    `;



  container.appendChild(nuevoGrupo);

  // Foco al input para renombrar
  const input = nuevoGrupo.querySelector(".input-nombre-grupo");
  input.focus();
  input.select();

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });

  input.addEventListener("blur", () => {
    const value = input.value.trim() || "Grupo sin nombre";
    const h3 = document.createElement("h3");
    h3.className = "editable-group-name";
    h3.textContent = value;
    h3.style.width = input.offsetWidth + "px"; // igualar ancho del input
    h3.style.overflow = "hidden";
    h3.style.whiteSpace = "nowrap";
    h3.style.textOverflow = "ellipsis";
    input.replaceWith(h3);

  });

    const grupoBody = nuevoGrupo.querySelector("tbody");
    agregarEdicionDobleClick(grupoBody);

  const addSprintBtn = nuevoGrupo.querySelector(".add-sprint-btn");

  addSprintBtn.addEventListener("click", () => {
    if (grupoBody.querySelector(".nueva-fila-sprint")) return;

    const tr = document.createElement("tr");
    tr.classList.add("nueva-fila-sprint");
    tr.innerHTML = `
      <td><input type="text" placeholder="Nombre del sprint" class="input-nombre-sprint" /></td>
      <td>—</td>
      <td></td>
      <td>—</td>
      <td></td>
      <td>—</td>
      <td>—</td>
      <td></td>
    `;
    grupoBody.innerHTML = ""; // Limpia mensaje "Sin sprints"
    grupoBody.appendChild(tr);

    const input = tr.querySelector(".input-nombre-sprint");
    input.focus();

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const nombre = input.value.trim();
        if (!nombre) {
          alert("El nombre del sprint es obligatorio.");
          return;
        }
        confirmarSprint(tr, nombre);
      }
    });

    input.addEventListener("blur", function () {
      const nombre = input.value.trim();
      if (!nombre) {
        tr.remove();
      } else {
        confirmarSprint(tr, nombre);
      }
    });
  });

});




// Array con sprints como tareas
const sprintsGantt = [
  { nombre: "Sprint 1", inicio: "2025-06-09", fin: "2025-06-14", color: "azul" },
  { nombre: "Sprint 2", inicio: "2025-06-18", fin: "2025-06-20", color: "verde" }
];

function renderGanttSprintsPorSemanas() {
  const encabezado = document.querySelector(".gantt-table thead tr");
  const cuerpo = document.querySelector(".gantt-table tbody");

  encabezado.innerHTML = `
    <th>Sprint</th>
    <th>W22 may. 26 - 1</th>
    <th>W23 jun. 2 - 8</th>
    <th>W24 jun. 9 - 15</th>
    <th>W25 jun. 16 - 22</th>
  `;

  cuerpo.innerHTML = "";

  const semanas = [
    ["2025-05-26", "2025-06-01"],
    ["2025-06-02", "2025-06-08"],
    ["2025-06-09", "2025-06-15"],
    ["2025-06-16", "2025-06-22"]
  ];

  sprintsGantt.forEach(sprint => {
    const fila = document.createElement("tr");
    const td = document.createElement("td");
    td.textContent = sprint.nombre;
    fila.appendChild(td);

    semanas.forEach(([ini, fin]) => {
      const cell = document.createElement("td");
      if (sprint.inicio <= fin && sprint.fin >= ini) {
        const bar = document.createElement("div");
        bar.className = `gantt-bar ${sprint.color}`;
        cell.appendChild(bar);
      }
      fila.appendChild(cell);
    });

    cuerpo.appendChild(fila);
  });
}

function renderGanttSprintsPorDias() {
  const encabezado = document.querySelector(".gantt-table thead tr");
  const cuerpo = document.querySelector(".gantt-table tbody");

  encabezado.innerHTML = "<th>Sprint</th>";
  cuerpo.innerHTML = "";

  const start = new Date("2025-06-09");

  const dias = [];
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(start.getTime());
    fecha.setDate(start.getDate() + i);

    const yyyy = fecha.getFullYear();
    const mm = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dd = fecha.getDate().toString().padStart(2, "0");
    const label = `${yyyy}-${mm}-${dd}`;

    dias.push(label);

    const th = document.createElement("th");
    th.textContent = `${dd}/${mm}`;
    encabezado.appendChild(th);
  }

  sprintsGantt.forEach(sprint => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.textContent = sprint.nombre;
    tr.appendChild(td);

    dias.forEach(dia => {
      const cell = document.createElement("td");
      if (sprint.inicio <= dia && sprint.fin >= dia) {
        const bar = document.createElement("div");
        bar.className = `gantt-bar ${sprint.color}`;
        cell.appendChild(bar);
      }
      tr.appendChild(cell);
    });

    cuerpo.appendChild(tr);
  });
}

function agregarEdicionDobleClick(tbody) {
  tbody.addEventListener("dblclick", (e) => {
    const cell = e.target;
    if (
      cell.tagName !== "TD" ||
      cell.querySelector("input") ||
      cell.querySelector("select") ||
      cell.querySelector("button")
    ) return;

    const columnIndex = [...cell.parentElement.children].indexOf(cell);
    const originalText = cell.textContent.trim();

    if (![1, 3].includes(columnIndex)) return;

    cell.innerHTML = "";
    let input;

    if (columnIndex === 3) {
      input = document.createElement("input");
      input.type = "text";
      input.readOnly = true;
      input.placeholder = "Selecciona rango";
      input.style.width = "100%";
      cell.appendChild(input);

      new Litepicker({
        element: input,
        singleMode: false,
        format: 'MMM. D',
        lang: 'es',
        numberOfMonths: 2,
        numberOfColumns: 2,
        autoApply: true,
        setup: (picker) => {
          picker.on('selected', (start, end) => {
            const meses = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];
            const desde = `${meses[start.getMonth()]} ${start.getDate()}`;
            const hasta = `${meses[end.getMonth()]} ${end.getDate()}`;
            input.value = `${desde} - ${hasta}`;
            cell.textContent = input.value;
          });
        }
      });

    } else {
      input = document.createElement("input");
      input.type = "text";
      input.value = originalText;
      input.style.width = "100%";
      cell.appendChild(input);
      input.focus();

      input.addEventListener("blur", () => {
        cell.textContent = input.value;
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          cell.textContent = input.value;
        }
      });
    }
  });
}
