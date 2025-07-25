const prioridadMap = {
  highest: "🔼🔼 Muy alta",
  high: "🔼 Alta",
  medium: "🟧 Media",
  low: "🔽 Baja",
  lowest: "🔽🔽 Muy baja"
};

const estadoMap = {
  porhacer: "TAREAS POR HACER",
  curso: "EN CURSO",
  revision: "EN REVISIÓN",
  finalizada: "RESUELTO"
};

const personas = [
  { id: "sin", nombre: "Sin asignar", icono: "👤" },
  { id: "sebastian", nombre: "Sebastian Andre Paz Ballon", icono: "🟠" },
  { id: "sebastianpb", nombre: "sebastianpb040602", icono: "🔵" }
];


const personaMap = {
  sin: "👤 Sin asignar",
  sebastian: "🟠 Sebastian Andre Paz Ballon",
  sebastianpb: "🔵 sebastianpb040602"
};


document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("incidencias-body");
  const filaCompacta = document.querySelector(".crear-fila-compacta");
  const crearBtn = document.getElementById("btn-crear");
  const resumenInput = document.getElementById("resumen-crear");
  const tipoInput = document.getElementById("tipo-crear");
  const fechaInput = document.getElementById("fecha-vencimiento-crear");
  const asignadoInput = document.getElementById("asignado-crear");
  const proyectoInput = document.getElementById("proyecto-crear");

  const incidencias = [
    {
      tipo: "🐞",
      proyecto: "IT-1",
      resumen: "Error al guardar tarea",
      estado: "Pendiente",
      asignado: "Sebastian Andre Paz",
      vencimiento: "2025-06-12",
      prioridad: "Alta",
      creada: "2025-06-10",
      actualizado: "2025-06-12",
      informador: "Alessandra Nuñez"
    },
    {
      tipo: "⬆️",
      proyecto: "IT-2",
      resumen: "Botón duplicado",
      estado: "Resuelto",
      asignado: "Sebastian Andre Paz",
      vencimiento: "2025-06-10",
      prioridad: "Media",
      creada: "2025-06-09",
      actualizado: "2025-06-10",
      informador: "Patricia Herrera"
    }
  ];

  incidencias.forEach(inc => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${inc.tipo}</td>
      <td class="editable-proyecto">${inc.proyecto}</td>
      <td>${inc.resumen}</td>
      <td class="editable-estado" data-value="porhacer">TAREAS POR HACER</td>
      <td class="comentario"><span>${inc.comentarios}</span></td>

      ${(() => {
        const persona = personas.find(p => inc.asignado.includes(p.nombre) || p.nombre.includes(inc.asignado)) || personas[0];
        return `<td class="editable-persona" data-value="${persona.id}">${persona.icono} ${persona.nombre}</td>`;
      })()}
      <td class="editable-fecha" data-value="${inc.vencimiento}">${inc.vencimiento}</td>
      <td class="editable-prioridad" data-value="medium">🟧 Media</td>

      <td>${inc.etiquetas}</td>
      <td>${inc.creada}</td>
      <td>${inc.actualizado}</td>
      <td>${inc.informador}</td>
      <td><button class="delete-button">🗑️</button></td>
    `;
    tbody.appendChild(tr);
    convertirCeldasDePrioridad();
    convertirCeldasDeEstado();
    convertirCeldasDePersona();
    convertirCeldasDeFecha();
    convertirCeldasDeProyecto();


  });


  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-button")) {
      const fila = e.target.closest("tr");
      if (fila) fila.remove();
    }
  });

  const btnAbrir = document.querySelector(".add-incidencia-button");
  btnAbrir.addEventListener("click", () => {
    filaCompacta.classList.remove("hidden");
  });

  // Habilitar botón solo si se llenan campos clave
  function verificarCampos() {
    crearBtn.disabled = !(
      resumenInput.value.trim() &&
      fechaInput.value &&
      asignadoInput.value.trim() &&
      proyectoInput.value.trim()
    );
  }


  [resumenInput, fechaInput, asignadoInput, proyectoInput].forEach(input =>
    input.addEventListener("input", verificarCampos)
  );

  let contadorProyecto = 3;

  crearBtn.addEventListener("click", () => {
    const tipoMap = {
      mejora: "⬆️ Mejora",
      tarea: "☑️ Tarea",
      nueva: "➕ Nueva función",
      error: "🐞 Error"
    };


    const asignadoId = asignadoInput.value;
    const asignado = personaMap[asignadoId] || "👤 Sin asignar";



    
    const tipo = tipoMap[tipoInput.value] || "❓";

    const resumen = resumenInput.value;
    const fechaVenc = fechaInput.value;
    const proyecto = proyectoInput.value.trim();
    const fechaHoy = new Date().toISOString().split("T")[0];

    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
      <td>${tipo}</td>
      <td class="editable-proyecto">${proyecto}</td>
      <td>${resumen}</td>
      <td class="editable-estado" data-value="porhacer">TAREAS POR HACER</td>
      <td class="comentario"><span>Añadir comentario</span></td>
      <td class="editable-persona" data-value="${asignadoId}">${asignado}</td>
      <td>${fechaVenc}</td>
      <td class="editable-prioridad" data-value="medium">🟧 Media</td>
      <td>-</td>
      <td>${fechaHoy}</td>
      <td>${fechaHoy}</td>
      <td>spaz2@seidor.es</td>
      <td><button class="delete-button">🗑️</button></td>
    `;

    document.getElementById("incidencias-body").appendChild(nuevaFila);
    convertirCeldasDePrioridad();
    convertirCeldasDeEstado();
    convertirCeldasDePersona();
    convertirCeldasDeFecha();
    convertirCeldasDeProyecto();




    // Reset
    resumenInput.value = "";
    fechaInput.value = "";
    asignadoInput.value = "";
    tipoInput.selectedIndex = 0;
    verificarCampos();
    filaCompacta.classList.add("hidden");
  });

});

document.getElementById("btn-descargar").addEventListener("click", () => {
  const filasVisibles = document.querySelectorAll("#incidencias-body tr:not([style*='display: none'])");
  if (filasVisibles.length === 0) {
    alert("No hay incidencias visibles para exportar.");
    return;
  }

  const tipoMap = {
    "🐞": "Error",
    "⬆️": "Mejora",
    "☑️": "Tarea",
    "➕": "Nueva función"
  };

  const headers = Array.from(document.querySelectorAll(".task-table thead th"))
    .filter(th => th.textContent.trim() !== "Acciones")
    .map(th => th.textContent.trim());

  const csv = [headers.join(",")];

  filasVisibles.forEach(row => {
    const celdas = Array.from(row.querySelectorAll("td"));
    const datos = celdas.slice(0, -1).map((td, i) => {
      let text = td.innerText.trim().replace(/\n/g, " ");

      // Primera columna = tipo
      if (i === 0) {
        const simbolo = text.trim().split(" ")[0];
        text = tipoMap[simbolo] || simbolo;
      } else {
        // Quitar cualquier emoji/icono (🟠, 🔽, etc.)
        text = text.replace(/^[^\w\d\s]+/g, "").trim();
      }

      return `"${text}"`;
    });
    csv.push(datos.join(","));
  });

  const bom = "\uFEFF";
  const blob = new Blob([bom + csv.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "incidencias_filtradas.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});




const filtroProyecto = document.getElementById("filtro-proyecto");
filtroProyecto.addEventListener("change", () => {
  const proyectoSeleccionado = filtroProyecto.value;
  const filas = document.querySelectorAll("#incidencias-body tr");

  filas.forEach(fila => {
    const celdaProyecto = fila.querySelector("td:nth-child(2)");
    const valorProyecto = celdaProyecto.textContent.trim();

    if (proyectoSeleccionado === "todos" || valorProyecto === proyectoSeleccionado) {
      fila.style.display = "";
    } else {
      fila.style.display = "none";
    }
  });
});


function convertirCeldasDePrioridad() {
  document.querySelectorAll(".editable-prioridad").forEach(cell => {
    cell.addEventListener("click", () => {
      
      if (cell.querySelector("select")) return;

      const currentValue = cell.dataset.value || "medium";

      const select = document.createElement("select");
      select.innerHTML = `
        <option value="highest">🔼🔼 Muy alta</option>
        <option value="high">🔼 Alta</option>
        <option value="medium">🟧 Media</option>
        <option value="low">🔽 Baja</option>
        <option value="lowest">🔽🔽 Muy baja</option>
      `;
      select.value = currentValue;

      select.addEventListener("change", () => {
        const newValue = select.value;
        cell.dataset.value = newValue;
        cell.innerText = prioridadMap[newValue];
        convertirCeldasDePrioridad();
      });

      cell.innerHTML = "";
      cell.appendChild(select);
      select.focus();
    });
  });
}


function convertirCeldasDeEstado() {
  document.querySelectorAll(".editable-estado").forEach(cell => {
    cell.addEventListener("click", () => {
      if (cell.querySelector("select")) return;

      const currentValue = cell.dataset.value || "porhacer";

      const select = document.createElement("select");
      select.innerHTML = `
        <option value="porhacer">TAREAS POR HACER</option>
        <option value="curso">EN CURSO</option>
        <option value="revision">EN REVISIÓN</option>
        <option value="finalizada">RESUELTO</option>
      `;
      select.value = currentValue;

      select.addEventListener("change", () => {
        const newValue = select.value;
        cell.dataset.value = newValue;
        cell.innerText = estadoMap[newValue];
        convertirCeldasDeEstado(); 
      });

      cell.innerHTML = "";
      cell.appendChild(select);
      select.focus();
    });
  });
}

function convertirCeldasDePersona() {
  document.querySelectorAll(".editable-persona").forEach(cell => {
    cell.addEventListener("click", () => {
      if (cell.querySelector("select")) return;

      const currentId = cell.dataset.value || "sin";
      const select = document.createElement("select");

      personas.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = `${p.icono} ${p.nombre}`;
        if (p.id === currentId) option.selected = true;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        const newId = select.value;
        const persona = personas.find(p => p.id === newId);
        cell.dataset.value = newId;
        cell.textContent = `${persona.icono} ${persona.nombre}`;
        convertirCeldasDePersona();
      });

      cell.innerHTML = "";
      cell.appendChild(select);
      select.focus();
    });
  });
}

function convertirCeldasDeFecha() {
  document.querySelectorAll(".editable-fecha").forEach(cell => {
    cell.addEventListener("click", () => {
      if (cell.querySelector("input[type='date']")) return;

      const currentValue = cell.dataset.value || "";

      const input = document.createElement("input");
      input.type = "date";
      input.value = currentValue;

      input.addEventListener("change", () => {
        cell.dataset.value = input.value;
        cell.innerText = input.value;
        convertirCeldasDeFecha(); 
      });

      cell.innerHTML = "";
      cell.appendChild(input);
      input.focus();
    });
  });
}

function convertirCeldasDeProyecto() {
  document.querySelectorAll(".editable-proyecto").forEach(cell => {
    cell.addEventListener("click", () => {
      if (cell.querySelector("input")) return;

      const currentValue = cell.textContent.trim();

      const input = document.createElement("input");
      input.type = "text";
      input.value = currentValue;

      input.addEventListener("blur", () => {
        cell.textContent = input.value.trim() || currentValue;
        convertirCeldasDeProyecto(); 
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          input.blur();
        }
      });

      cell.innerHTML = "";
      cell.appendChild(input);
      input.focus();
    });
  });
}


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-button")) {
    const fila = e.target.closest("tr");
    if (fila) fila.remove();
  }

  if (e.target.classList.contains("comentario") || e.target.closest(".comentario")) {
    const fila = e.target.closest("tr");
    mostrarDetalle(fila);
  }
});


function mostrarDetalle(fila) {
  const detalle = document.getElementById("detalle-panel");
  const cuerpo = document.getElementById("detalle-cuerpo");

  const celdas = fila.querySelectorAll("td");
  const data = {
    tipo: celdas[0].textContent,
    proyecto: celdas[1].textContent,
    resumen: celdas[2].textContent,
    estado: celdas[3].textContent.trim(),
    comentarios: celdas[4].textContent,
    asignado: celdas[5].textContent,
    vencimiento: celdas[6].textContent,
    prioridad: celdas[7].textContent,
    etiquetas: celdas[8].textContent,
    creada: celdas[9].textContent,
    actualizado: celdas[10].textContent,
    informador: celdas[11].textContent,
  };

  document.getElementById("detalle-titulo").textContent = data.proyecto;

  cuerpo.innerHTML = `
  <h3 style="font-size: 20px; margin-bottom: 10px;">${data.resumen}</h3>

  <div style="display: flex; gap: 8px; margin-bottom: 12px;">
    <button style="padding: 6px 10px; background: #f3f3f3; border: 1px solid #ccc; border-radius: 4px;">+ Añadir</button>
  </div>

  <div style="margin-bottom: 20px;">
    <select style="padding: 6px; border: 1px solid #ccc; border-radius: 4px;" disabled>
      <option ${data.estado.includes("HACER") ? "selected" : ""}>TAREAS POR HACER</option>
    </select>
  </div>

  <div style="margin-bottom: 20px; padding-right: 10px;">
    <label style="font-weight: bold; display: block; margin-bottom: 4px; padding-left: 2px;">Descripción</label>
    <textarea rows="4"
      style="width: 100%; box-sizing: border-box; border: 1px solid #ccc; padding: 8px; border-radius: 4px;"
      placeholder="Editar descripción"
    ></textarea>
  </div>

  <div style="margin-bottom: 20px; padding-right: 10px;">
    <label style="font-weight: bold; display: block; margin-bottom: 4px; padding-left: 2px;">Entorno</label>
    <textarea rows="3"
      style="width: 100%; box-sizing: border-box; border: 1px solid #ccc; padding: 8px; border-radius: 4px;"
      placeholder="Editar entorno"
    ></textarea>
  </div>

  <!-- SECCIÓN DETALLES -->
<div class="accordion-section">
  <button class="accordion-toggle" onclick="toggleAccordion(this)">
    <strong>Detalles</strong>
    <span class="summary">Persona asignada, Informador, Etiquetas...</span>
    <span class="arrow">▾</span>
  </button>
  <div class="accordion-content">
    <div><strong>Persona asignada:</strong><br>🟠 Sebastian Andre Paz Ballon</div>
    <div><strong>Informador:</strong><br>spaz2@seidor.es</div>
    <div><strong>Etiquetas:</strong><br>bug, urgencia</div>
    <div><strong>Fecha de vencimiento:</strong> 2025-06-12</div>
    <div><strong>Prioridad:</strong> 🟧 Media</div>
    <div><strong>Creada:</strong> 2025-06-10</div>
    <div><strong>Actualizado:</strong> 2025-06-12</div>
  </div>
</div>

<!-- SECCIÓN MÁS CAMPOS -->
<div class="accordion-section">
  <button class="accordion-toggle" onclick="toggleAccordion(this)">
    <strong>Más campos</strong>
    <span class="summary">Estimación original, Seguimiento...</span>
    <span class="arrow">▾</span>
  </button>
  <div class="accordion-content">
    <div><strong>Estimación original:</strong> 0min</div>
    <div><strong>Seguimiento de tiempo:</strong> Sin tiempo registrado</div>
    <div><strong>Versiones corregidas:</strong> Ninguno</div>
    <div><strong>Versiones afectadas:</strong> Ninguno</div>
  </div>
</div>

<!-- TIEMPOS RELATIVOS -->
<div class="time-info">
  <div><strong>Creado hace:</strong> 3 días</div>
  <div><strong>Actualizado hace:</strong> 35 minutos</div>
</div>

<div class="actividad-panel">
  <h3>Actividad</h3>
  <label for="comentario-nuevo">Añadir un comentario:</label>
  <textarea id="comentario-nuevo" placeholder="Escribe tu comentario..."></textarea>
  <button onclick="agregarComentario()">Comentar</button>

  <div id="lista-comentarios">
    <div class="comentario">
      <div class="avatar-comentario">SB</div>
      <div class="contenido-comentario">
        <div class="autor-comentario"><strong>Sebastian Andre Paz Ballon</strong> <span class="tiempo">hace 3 días</span></div>
        <div class="texto-comentario">Solo quería dar una actualización rápida sobre esto: estoy revisando el error en la pantalla inicial y espero tener más información pronto.</div>
        <div class="acciones-comentario">
          <button>👍</button>
          <button>💬</button>
          <button>Editar</button>
          <button>Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</div>

`;



  detalle.classList.remove("hidden");
}




function cerrarDetalle() {
  document.getElementById("detalle-panel").classList.add("hidden");
}

function toggleAccordion(button) {
  button.classList.toggle('active');
  const content = button.nextElementSibling;
  content.style.display = content.style.display === 'block' ? 'none' : 'block';
}



function agregarComentario() {
  const texto = document.getElementById("comentario-nuevo").value.trim();
  if (!texto) return;

  const contenedor = document.getElementById("lista-comentarios");
  const nuevo = document.createElement("div");
  nuevo.className = "comentario";
  nuevo.innerHTML = `
    <div class="avatar-comentario">SB</div>
    <div class="contenido-comentario">
      <div class="autor-comentario"><strong>Sebastian Andre Paz Ballon</strong> <span class="tiempo">hace unos segundos</span></div>
      <div class="texto-comentario">${texto}</div>
      <div class="acciones-comentario">
        <button>👍</button>
        <button>💬</button>
        <button>Editar</button>
        <button>Eliminar</button>
      </div>
    </div>
  `;
  contenedor.appendChild(nuevo);
  document.getElementById("comentario-nuevo").value = "";
}
