
const tareasGantt = [
  {
    nombre: "Creación prototipo",
    inicio: "2025-06-09",
    fin: "2025-06-09",
    color: "azul"
  },
  {
    nombre: "Diseño interfaz",
    inicio: "2025-06-02",
    fin: "2025-06-15",
    color: "verde"
  },
  {
    nombre: "Testing",
    inicio: "2025-06-16",
    fin: "2025-06-22",
    color: "rojo"
  },
  {
    nombre: "Tarea demo",
    inicio: "2025-05-25",
    fin: "2025-05-27",
    color: "azul"
  }
];



document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.collapsible-header');
  const content = document.querySelector('.collapsible-content');
  const arrow = document.querySelector('.arrow');

  if (header && content && arrow) {
    content.style.display = 'block';
    arrow.style.transform = 'rotate(90deg)';

    header.addEventListener('click', () => {
      const isVisible = content.style.display === 'block';
      content.style.display = isVisible ? 'none' : 'block';
      arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
    });
  }

    const modal = document.getElementById("chat-modal");
    const closeBtn = modal.querySelector(".close");

    // document.querySelector(".gantt-add-task").addEventListener("click", () => {
    // modal.style.display = "block";
    // });

  document.querySelectorAll(".add-task").forEach(button => {
    button.addEventListener("click", () => {
      const sprintId = button.getAttribute("data-sprint");
      const tbody = document.getElementById(sprintId);

      const newRow = document.createElement("tr");
      newRow.innerHTML = `
  <td><input type="text" placeholder="Nombre de la tarea" class="input-nombre-tarea" /></td>
  <td><input type="text" placeholder="Responsable" /></td>
  <td>
    <select>
      <option>Listo para empezar</option>
      <option>En curso</option>
      <option>Esperando revisión</option>
    </select>
  </td>
  <td>    
    <select>
      <option>Critica</option>
      <option>Alta</option>
      <option>Media</option>
      <option>Baja</option>
    </select>
  </td>       
  <td>
    <select>
      <option>Función</option>
      <option>Prueba</option>
    </select>
  </td>
  <td><input type="text" placeholder="ID" /></td>
  <td><input type="date" class="fecha-inicio" /></td>
  <td><input type="date" class="fecha-fin" /></td>
  <td class="duracion">-</td> <!-- Duración -->
  <td><input type="text" placeholder="Ej. TPEO-001" /></td> <!-- Predecesora -->
  <td>
    <button class="chat-button">💬</button>
    <button class="delete-button">🗑️</button>
  </td>
`;

      tbody.appendChild(newRow);

      // Escuchar enter en el campo "Nombre de la tarea"
      const nombreInput = newRow.querySelector(".input-nombre-tarea");
      nombreInput.focus(); // Enfocar automáticamente
      nombreInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          const nombre = nombreInput.value.trim();
          if (nombre === "") {
            alert("El nombre de la tarea es obligatorio.");
            return;
          }

          // Recoger todos los valores de la fila
          const inputs = newRow.querySelectorAll("input, select");
          const values = [];
          inputs.forEach((input, i) => {
            let valor = input.value.trim();

            // Convertir fechas si son los campos 6 (fecha inicio) o 7 (fecha fin)
            if (i === 6 || i === 7) {
              valor = convertirFechaAFormatoEuropeo(valor);
            }

            values.push(valor);
          });


          // Reemplazar por valores en texto plano
          // Calcular duración antes de pintar
          const duracion = calcularDuracion(values[6], values[7]);

          newRow.innerHTML = `
            <td>${values[0]}</td>
            <td>${values[1]}</td>
            <td class="estado ${values[2].toLowerCase().replace(/\s+/g, '')}">${values[2]}</td>
            <td class="${values[3].toLowerCase()}">${values[3]}</td>
            <td class="tipo ${values[4].toLowerCase()}">${values[4]}</td>
            <td>${values[5]}</td>
            <td>${values[6]}</td>
            <td>${values[7]}</td>
            <td class="duracion">${duracion}</td>
            <td>${values[8]}</td>
            <td>
              <button class="chat-button">💬</button>
              <button class="delete-button">🗑️</button>
            </td>
          `;

          const cells = newRow.querySelectorAll("td");
applyCellClass(cells[2], 2); // Estado
applyCellClass(cells[3], 3); // Prioridad
applyCellClass(cells[4], 4); // Tipo

        }
      });
    });
  });
  document.querySelectorAll(".sprint-date-picker").forEach(pickerInput => {
  if (!pickerInput) return; 

  new Litepicker({
    element: pickerInput,
    singleMode: false,
    format: 'MMM. D',
    lang: 'es',
    tooltipText: {
      one: 'día',
      other: 'días'
    },
    numberOfMonths: 2,
    numberOfColumns: 2,
    autoApply: true,
    setup: (picker) => {
      picker.on('selected', (date1, date2) => {
        if (!picker.element) return; // 🔒 prevención extra
        const meses = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];
        const desde = `${meses[date1.getMonth()]} ${date1.getDate()}`;
        const hasta = `${meses[date2.getMonth()]} ${date2.getDate()}`;
        picker.element.value = `${desde} - ${hasta}`;
      });
    }
  });
});

const vistaSelect = document.getElementById("gantt-vista");

vistaSelect.addEventListener("change", () => {
  const modo = vistaSelect.value;
  if (modo === "dias") {
    renderGanttPorDias();
  } else {
    renderGanttPorSemanas();
  }
});

// Mostrar por defecto el Gantt en vista de semanas con todas las tareas
if (document.getElementById("gantt-vista").value === "semanas") {
  renderGanttPorSemanas();
}


});
function renderGanttPorSemanas() {
  const encabezado = document.querySelector(".gantt-table thead tr");
  const cuerpo = document.querySelector(".gantt-table tbody");

  encabezado.innerHTML = `
    <th>Tarea</th>
    <th>W22 may. 26 - 1</th>
    <th>W23 jun. 2 - 8</th>
    <th>W24 jun. 9 - 15</th>
    <th>W25 jun. 16 - 22</th>
  `;

  cuerpo.innerHTML = ""; // limpia tareas anteriores

  const semanas = [
    ["2025-05-26", "2025-06-01"],
    ["2025-06-02", "2025-06-08"],
    ["2025-06-09", "2025-06-15"],
    ["2025-06-16", "2025-06-22"]
  ];

  tareasGantt.forEach(tarea => {
    const fila = document.createElement("tr");
    const tdTarea = document.createElement("td");
    tdTarea.textContent = tarea.nombre;
    fila.appendChild(tdTarea);

    semanas.forEach(([inicioSemana, finSemana]) => {
      const td = document.createElement("td");
      if (tarea.inicio <= finSemana && tarea.fin >= inicioSemana) {
        const bar = document.createElement("div");
        bar.className = `gantt-bar ${tarea.color}`;
        td.appendChild(bar);
      }
      fila.appendChild(td);
    });

    cuerpo.appendChild(fila);
  });
}




function renderGanttPorDias() {
  const encabezado = document.querySelector(".gantt-table thead tr");
  const cuerpo = document.querySelector(".gantt-table tbody");

  encabezado.innerHTML = "<th>Tarea</th>";
  cuerpo.innerHTML = "";

  const fechaInicio = new Date("2025-06-09");
  const dias = [];

  for (let i = 0; i < 5; i++) {
    const d = new Date(fechaInicio.getTime()); // ← corregido
    d.setDate(d.getDate() + i);

    const label = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
    dias.push(label);

    const th = document.createElement("th");
    const dia = d.getDate().toString().padStart(2, "0");
    const mes = (d.getMonth() + 1).toString().padStart(2, "0");
    th.textContent = `${dia}/${mes}`;
    encabezado.appendChild(th);
  }

  tareasGantt.forEach(tarea => {
    const fila = document.createElement("tr");
    const tdTarea = document.createElement("td");
    tdTarea.textContent = tarea.nombre;
    fila.appendChild(tdTarea);

    dias.forEach(fecha => {
      const td = document.createElement("td");

      // Corregimos comparación exacta
      if (fecha >= tarea.inicio && fecha <= tarea.fin) {
        const bar = document.createElement("div");
        bar.className = `gantt-bar ${tarea.color}`;
        td.appendChild(bar);
      }

      fila.appendChild(td);
    });

    cuerpo.appendChild(fila);
  });
}








document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("chat-modal");
  const closeBtn = modal.querySelector(".close");

  // Abrir modal al hacer clic en botón de chat
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("chat-button")) {
      modal.style.display = "block";
    }
  });

  // Cerrar modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });

  // Cargar tareas masivas
   const inputCSV = document.createElement("input");
  inputCSV.type = "file";
  inputCSV.accept = ".csv";
  inputCSV.style.display = "none";

  const btnCargar = document.createElement("button");
  btnCargar.textContent = "📥 Cargar tareas CSV";
  btnCargar.classList.add("csv-upload-button"); 
  btnCargar.title = "Selecciona un archivo CSV para cargar tareas masivamente";


  document.querySelector(".toolbar-right").appendChild(btnCargar);
  document.body.appendChild(inputCSV);

  btnCargar.addEventListener("click", () => inputCSV.click());

  inputCSV.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const rows = text.trim().split("\n").slice(1); 

    const sprintId = "sprint-2"; 
    const tbody = document.getElementById(sprintId);
    const clean = (str) => str
    .trim()
    .replace(/^"|"$/g, "") 
    .normalize("NFD")      
    .replace(/[\u0300-\u036f]/g, "");

    rows.forEach(row => {
      const parts = row.split(",");
      const [
        tarea, responsable, estado, prioridad, tipo,
        id, inicio, fin, predecesora
      ] = parts.map(clean);


      const duracion = calcularDuracion(inicio, fin);

      const nuevaFila = document.createElement("tr");
      nuevaFila.innerHTML = `
        <td>${tarea}</td>
        <td>${responsable}</td>
        <td class="estado ${estado.toLowerCase().replace(/\s/g, '')}">${estado}</td>
        <td class="${prioridad.toLowerCase()}">${prioridad}</td>
        <td class="tipo ${tipo.toLowerCase()}">${tipo}</td>
        <td>${id}</td>
        <td>${inicio}</td>
        <td>${fin}</td>

        <td class="duracion">${duracion}</td>
        <td>${predecesora || ""}</td>
        <td>
          <button class="chat-button">💬</button>
          <button class="delete-button">🗑️</button>
        </td>
      `;

      tbody.appendChild(nuevaFila);

      const celdas = nuevaFila.querySelectorAll("td");
      applyCellClass(celdas[2], 2); // Estado
      applyCellClass(celdas[3], 3); // Prioridad
      applyCellClass(celdas[4], 4); // Tipo
    });

    alert("✅ Tareas cargadas exitosamente.");
    inputCSV.value = ""; // Reset
  });

});

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.tab;


      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((tab) => (tab.style.display = "none"));


      button.classList.add("active");
      document.getElementById(targetId).style.display = "block";
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("chat-modal");
  const closeBtn = modal.querySelector(".close");

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("chat-button")) {
      modal.style.display = "block";
    }
  });

  document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-button")) {
    const fila = e.target.closest("tr");
    if (fila) fila.remove();
  }
});


  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });



  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
     
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.style.display = 'none');

    
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).style.display = 'block';
    });
  });
});

document.addEventListener("click", function (e) {
  const cell = e.target;

if (
  cell.tagName !== "TD" ||
  cell.closest(".gantt-table") ||
  cell.querySelector("input") ||
  cell.querySelector("select") ||
  cell.querySelector("button")
) return;

  const isLastCell = cell === cell.parentElement.lastElementChild;
  if (isLastCell) return;

  const columnIndex = Array.from(cell.parentElement.children).indexOf(cell);
  const originalText = cell.textContent.trim();
  cell.innerHTML = "";

  let input;


  if (columnIndex === 2) {
    input = document.createElement("select");
    ["Listo para empezar", "En curso", "Esperando revisión"].forEach(opt => {
      const option = new Option(opt, opt, false, opt === originalText);
      input.appendChild(option);
    });
  } else if (columnIndex === 3) {
    input = document.createElement("select");
    ["Critica", "Alta", "Media", "Baja"].forEach(opt => {
      const option = new Option(opt, opt, false, opt === originalText);
      input.appendChild(option);
    });
  } else if (columnIndex === 4) {
    input = document.createElement("select");
    ["Función", "Prueba"].forEach(opt => {
      const option = new Option(opt, opt, false, opt === originalText);
      input.appendChild(option);
    });
  } else if (columnIndex === 6 || columnIndex === 7) {
    input = document.createElement("input");
    input.type = "date";

    input.addEventListener("change", () => {
  const row = cell.closest("tr");
  const fechaInicioInput = row.children[6].querySelector("input");
  const fechaFinInput = row.children[7].querySelector("input");

  const fechaInicio = fechaInicioInput?.value || row.children[6].textContent.trim();
  const fechaFin = fechaFinInput?.value || row.children[7].textContent.trim();

  const fechaInicioFormateada = fechaInicio.includes("-") ? convertirFechaAFormatoEuropeo(fechaInicio) : fechaInicio;
  const fechaFinFormateada = fechaFin.includes("-") ? convertirFechaAFormatoEuropeo(fechaFin) : fechaFin;

  const celdaDuracion = row.children[8];
  celdaDuracion.textContent = calcularDuracion(fechaInicioFormateada, fechaFinFormateada);
});





    const parts = originalText.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      input.value = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
  } else {
    input = document.createElement("input");
    input.type = "text";
    input.value = originalText;
  }

  input.style.width = "100%";
  cell.appendChild(input);
  input.focus();

    function formatFecha(fecha) {
    if (!fecha) return "";


    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
    }


  function getCellValue() {
    if (columnIndex === 6 || columnIndex === 7) {
      return formatFecha(input.value);
    }
    return input.value || input.options?.[input.selectedIndex]?.text || "";
  }

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      cell.textContent = getCellValue();
      applyCellClass(cell, columnIndex);
    }
  });

  input.addEventListener("blur", function () {
    cell.textContent = getCellValue();
    applyCellClass(cell, columnIndex);
  });

});
function applyCellClass(cell, columnIndex) {
  let valueOriginal = cell.textContent.trim().replace(/['"]+/g, "");


  valueOriginal = valueOriginal.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let value = "";

  if (columnIndex === 2) {
    if (valueOriginal === "Listo para empezar") value = "listo";
    else if (valueOriginal === "En curso") value = "curso";
    else if (valueOriginal === "Esperando revision" || valueOriginal === "Esperando revisión") value = "esperando";

    cell.className = '';
    if (value) cell.classList.add('estado', value);

  } else if (columnIndex === 3) {
    value = valueOriginal.toLowerCase();
    cell.className = '';
    if (value) cell.classList.add(value); // prioridad

  } else if (columnIndex === 4) {
    value = valueOriginal.toLowerCase();
    cell.className = '';
    if (value) cell.classList.add('tipo', value);
  }
}


function formatFechaCorta(fecha) {
  const mesesCortos = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic."];
  const d = new Date(fecha);
  const dia = d.getDate();
  const mes = mesesCortos[d.getMonth()];
  return `${mes} ${dia}`;
}

document.addEventListener("DOMContentLoaded", () => {
  
  const header = document.querySelector('.collapsible-header');
  const content = document.querySelector('.collapsible-content');
  const arrow = document.querySelector('.arrow');

  if (header && content && arrow) {
    content.style.display = 'block';
    arrow.style.transform = 'rotate(90deg)';
    header.addEventListener('click', () => {
      const isVisible = content.style.display === 'block';
      content.style.display = isVisible ? 'none' : 'block';
      arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
    });
  }

  

});


document.addEventListener("DOMContentLoaded", () => {
  const sprintEstados = {
    "sprint-1": true,
    "sprint-2": true
  };

  document.querySelectorAll(".toggle-sprint").forEach(btn => {
    btn.addEventListener("click", () => {
      const sprintId = btn.getAttribute("data-sprint");
      const isActivo = sprintEstados[sprintId];
      const tbody = document.getElementById(sprintId);
      const indicador = document.getElementById(`estado-${sprintId}`);
      const seccion = tbody.closest(".sprint");


      sprintEstados[sprintId] = !isActivo;


      btn.textContent = sprintEstados[sprintId] ? "Desactivar" : "Activar";
      indicador.textContent = sprintEstados[sprintId] ? "🟢 Activo" : "🔴 Inactivo";

      if (!sprintEstados[sprintId]) {
        seccion.classList.add("sprint-inactivo");
      } else {
        seccion.classList.remove("sprint-inactivo");
      }


      const allElements = seccion.querySelectorAll("input, select, button");

      allElements.forEach(el => {
        if (el !== btn) {
          el.disabled = !sprintEstados[sprintId];
        }
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const views = document.querySelectorAll(".view-section");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const viewId = item.getAttribute("data-view");

      
      views.forEach(v => v.style.display = "none");


      const selectedView = document.getElementById(viewId);
      if (selectedView) {
        selectedView.style.display = "block";
      }

 
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const ganttModal = document.getElementById("gantt-modal");
  const openGanttBtn = document.querySelector(".gantt-add-task");
  const closeGanttBtn = document.querySelector(".close-gantt");
  const guardarBtn = document.getElementById("guardar-tarea-gantt");

  if (!ganttModal || !openGanttBtn || !closeGanttBtn || !guardarBtn) {
    console.warn("Elementos del modal de Gantt no encontrados.");
    return;
  }

  openGanttBtn.addEventListener("click", () => {
    ganttModal.style.display = "block";
  });

  closeGanttBtn.addEventListener("click", () => {
    ganttModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === ganttModal) {
      ganttModal.style.display = "none";
    }
  });

  guardarBtn.addEventListener("click", () => {
    
    const tarea = document.getElementById("gantt-tarea")?.value.trim();
    const responsable = document.getElementById("gantt-responsable")?.value.trim();
    const estado = document.getElementById("gantt-estado")?.value;
    const prioridad = document.getElementById("gantt-prioridad")?.value;
    const tipo = document.getElementById("gantt-tipo")?.value;
    const id = document.getElementById("gantt-id")?.value.trim();
    const inicio = document.getElementById("gantt-inicio")?.value;
    const fin = document.getElementById("gantt-fin")?.value;

    if (!tarea || !responsable || !estado || !prioridad || !tipo || !id || !inicio || !fin) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const color = prioridad.toLowerCase();

    // Validar que la fecha fin no sea anterior a la fecha inicio
    if (new Date(fin) < new Date(inicio)) {
      alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }

    // Agrega la tarea al arreglo global
    tareasGantt.push({
      nombre: tarea,
      inicio,
      fin,
      color
    });

    // Redibujar vista actual
    const modo = document.getElementById("gantt-vista")?.value || "semanas";
    if (modo === "dias") {
      renderGanttPorDias();
    } else {
      renderGanttPorSemanas();
    }

    ganttModal.style.display = "none";
  });
});

function calcularDuracion(fechaInicio, fechaFin) {
  // Validación
  if (!fechaInicio || !fechaFin) return "-";

  // Convertir si es formato dd/mm/yyyy
  const convertir = (fecha) => {
    if (fecha.includes("/")) {
      const [dd, mm, yyyy] = fecha.split("/");
      return `${yyyy}-${mm}-${dd}`;
    }
    return fecha;
  };

  const f1 = new Date(convertir(fechaInicio));
  const f2 = new Date(convertir(fechaFin));

  if (isNaN(f1) || isNaN(f2)) return "-";

  const diffTime = f2 - f1;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return `${diffDays} día${diffDays === 1 ? "" : "s"}`;
}


// Recorre filas y actualiza duración
function actualizarDuraciones() {
  document.querySelectorAll("tbody tr").forEach(row => {
    const fechaInicio = row.children[6]?.textContent.trim();  // Columna 7 (Fecha Inicio)
    const fechaFin = row.children[7]?.textContent.trim();     // Columna 8 (Fecha Fin)
    const celdaDuracion = row.children[8];                    

    if (fechaInicio && fechaFin && celdaDuracion) {
      celdaDuracion.textContent = calcularDuracion(fechaInicio, fechaFin);
    }
  });
}

function convertirFechaAFormatoEuropeo(fechaISO) {
  if (!fechaISO) return "";
  const [yyyy, mm, dd] = fechaISO.split("-");
  return `${dd}/${mm}/${yyyy}`;
}


// Llamar al cargar
document.addEventListener("DOMContentLoaded", actualizarDuraciones);
