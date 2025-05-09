const table = document.getElementsByTagName("tbody")[0];
const url = "https://apidemo.geoeducacion.com.ar/api/testing/encuesta/1";
let dataJson = null;

async function obtainData() {
  const response = await fetch(url);
  const data = await response.json();
  dataJson = data.data;
  return dataJson;
}

function jsonToDic(data) {
  let diccionario = {};
  data.forEach((user) => {
    if (diccionario[user.curso]) {
      diccionario[user.curso] += 1;
    } else {
      diccionario[user.curso] = 1;
    }
  });
  return diccionario;
}


const completePoblationBtn = document
  .getElementById("completeDataBtn")
  .addEventListener("click", () => {
    const frecNewTable = document.getElementById("newTable");
    if (frecNewTable) {
      document.body.removeChild(frecNewTable);
    }
    const table = document.querySelector("table");
    table.querySelector("caption").innerText = "Poblacion Total";
    const tbody = table.querySelector("tbody");
    const thead = table.querySelector("thead");
    if (thead) {
      const filaEncabezado = thead.querySelector("tr");
      if (filaEncabezado) {
        filaEncabezado.querySelectorAll("th").forEach((th) => {
          filaEncabezado.removeChild(th);
        });
      }
      const filaBody = tbody.querySelectorAll("tr");
      if (filaBody) {
        filaBody.forEach((tr) => {
          tbody.removeChild(tr);
        });
      }
      const nameRow = document.createElement("th");
      nameRow.innerText = "Nombre";
      const ageRow = document.createElement("th");
      ageRow.innerText = "Edad";
      const courseRow = document.createElement("th");
      courseRow.innerText = "Curso";
      const levelRow = document.createElement("th");
      levelRow.innerText = "Nivel Educativo";
      filaEncabezado.appendChild(nameRow);
      filaEncabezado.appendChild(ageRow);
      filaEncabezado.appendChild(courseRow);
      filaEncabezado.appendChild(levelRow);
      dataJson.sort((a, b) => {
        const nombreA = a.nombre.toUpperCase();
        const nombreB = b.nombre.toUpperCase();
        if (nombreA < nombreB) {
          return -1;
        }
        if (nombreA > nombreB) {
          return 1;
        }
        return 0;
      });
      dataJson.forEach((data) => {
        const row = tbody.insertRow();
        const nameCell = row.insertCell(0);
        const ageCell = row.insertCell(1);
        const courseCell = row.insertCell(2);
        const levelCell = row.insertCell(3);
        nameCell.innerHTML = data.nombre + " " + data.apellido;
        ageCell.innerHTML = data.Edad;
        courseCell.innerHTML = data.curso;
        levelCell.innerHTML = data.nivel;
      });
    }
  });

const frecuencyTableBtn = document
  .getElementById("frecuencyTableBtn")
  .addEventListener("click", () => {
    const table = document.querySelector("table");
    table.querySelector("caption").innerText =
      "Tablas de Frecuencia";
    const tbody = table.querySelector("tbody");
    const thead = table.querySelector("thead");
    const filaEncabezado = thead.querySelector("tr");
    if (thead) {
      if (filaEncabezado) {
        filaEncabezado.querySelectorAll("th").forEach((th) => {
          filaEncabezado.removeChild(th);
        });
      }
      const filaBody = tbody.querySelectorAll("tr");
      if (filaBody) {
        filaBody.forEach((tr) => {
          tbody.removeChild(tr);
        });
      }
    }

    const diccionario = jsonToDic(dataJson);
    const sortedDiccionario = Object.fromEntries(
      Object.entries(diccionario).sort((a, b) => a[1] - b[1])
    );

    const thCurso = document.createElement("th");
    thCurso.innerText = "Curso";
    const thCantidad = document.createElement("th");
    thCantidad.innerText = "Frecuencia Absoluta";
    const thFrecuenciaRelativa = document.createElement("th");
    thFrecuenciaRelativa.innerText = "Frecuencia Acumulativa";
    const thFrecuenciaPorcentual = document.createElement("th");
    thFrecuenciaPorcentual.innerText = "Frecuencia Relativa";

    filaEncabezado.appendChild(thCurso);
    filaEncabezado.appendChild(thCantidad);
    filaEncabezado.appendChild(thFrecuenciaRelativa);
    filaEncabezado.appendChild(thFrecuenciaPorcentual);
    let totalEstudiantes = 0;
    const total = Object.values(sortedDiccionario).reduce((a, b) => a + b, 0);
    for (const [curso, cantidad] of Object.entries(sortedDiccionario)) {
      const row = tbody.insertRow();
      const cellCurso = row.insertCell(0);
      const cellFrecuenciaAbsoluta = row.insertCell(1);
      const cellFrecuenciaAcumulativa = row.insertCell(2);
      const cellFrecuenciaRelativa = row.insertCell(3);
      totalEstudiantes += cantidad;
      cellCurso.innerHTML = curso;
      cellFrecuenciaAbsoluta.innerHTML = cantidad;
      cellFrecuenciaRelativa.innerHTML = (cantidad / total).toFixed(2);
      cellFrecuenciaAcumulativa.innerHTML = totalEstudiantes;
    }
    const row = tbody.insertRow();
    const totalCell = row.insertCell(0);
    const totalValueCell = row.insertCell(1);
    const fillCell = row.insertCell(2);
    const fillCell2 = row.insertCell(3);
    totalCell.innerHTML = "Total";
    totalValueCell.innerHTML = total;

    // ------------------- 2da Tabla -------------------
    const newTable = document.getElementById("newTable");
    if (!newTable) {
      const newTable = document.createElement("table");
      newTable.setAttribute("id", "newTable");

      const newThead = document.createElement("thead");
      const newHeaderRow = document.createElement("tr");

      const thNivel = document.createElement("th");
      const thFAbsoluta = document.createElement("th");
      const thFRelativa = document.createElement("th");
      const thFAcumulada = document.createElement("th");
      thNivel.innerText = "Nivel Educativo";
      thFAbsoluta.innerText = "Frecuencia Absoluta";
      thFRelativa.innerText = "Frecuencia Relativa";
      thFAcumulada.innerText = "Frecuencia Acumulativa";

      newHeaderRow.appendChild(thNivel);
      newHeaderRow.appendChild(thFAbsoluta);
      newHeaderRow.appendChild(thFRelativa);
      newHeaderRow.appendChild(thFAcumulada);
      newThead.appendChild(newHeaderRow);
      newTable.appendChild(newThead);

      const newTbody = document.createElement("tbody");

      let diccionario = {};
      dataJson.forEach((user) => {
        if (diccionario[user.nivel]) {
          diccionario[user.nivel] += 1;
        } else {
          diccionario[user.nivel] = 1;
        }
      });
      diccionario = Object.fromEntries(
        Object.entries(diccionario).sort((a, b) => a[1] - b[1])
      ); // Ordenar por cantidad de estudiantes

      let totalEstudiantes = 0;
      const total = Object.values(diccionario).reduce((a, b) => a + b, 0);

      for (const [nivel, cantidad] of Object.entries(diccionario)) {
        const row = newTbody.insertRow();
        const cellNivel = row.insertCell(0);
        const cellFAbsoluta = row.insertCell(1);
        const cellFRelativa = row.insertCell(2);
        const cellFAcumulada = row.insertCell(3);
        totalEstudiantes += cantidad;
        cellNivel.innerHTML = nivel;
        cellFAbsoluta.innerHTML = cantidad;
        cellFRelativa.innerHTML = (cantidad / total).toFixed(2);
        cellFAcumulada.innerHTML = totalEstudiantes;
      }

      newTable.appendChild(newTbody);
      document.body.appendChild(newTable);
    }
  });

const statsTableBtn = document
  .getElementById("statsTableBtn")
  .addEventListener("click", () => {
    const frecNewTable = document.getElementById("newTable");
    if (frecNewTable) {
      document.body.removeChild(frecNewTable);
    }
    const table = document.querySelector("table");
    table.querySelector("caption").innerText = "Estadísticos";
    const tbody = table.querySelector("tbody");
    const thead = table.querySelector("thead");
    const filaEncabezado = thead.querySelector("tr");
    if (thead) {
      if (filaEncabezado) {
        filaEncabezado.querySelectorAll("th").forEach((th) => {
          filaEncabezado.removeChild(th);
        });
      }
      const filaBody = tbody.querySelectorAll("tr");
      if (filaBody) {
        filaBody.forEach((tr) => {
          tbody.removeChild(tr);
        });
      }
    }
    const thEstadisticos = document.createElement("th");
    thEstadisticos.innerText = "Estadisticos";
    const thValores = document.createElement("th");
    thValores.innerText = "Valores";
    filaEncabezado.appendChild(thEstadisticos);
    filaEncabezado.appendChild(thValores);

    const rowMedia = tbody.insertRow();
    const cellMedia = rowMedia.insertCell(0);
    const cellMediaValue = rowMedia.insertCell(1);
    cellMedia.innerHTML = "Media";
    cellMediaValue.innerHTML = getMedia(); // Media

    const rowMediana = tbody.insertRow();
    const cellMediana = rowMediana.insertCell(0);
    const cellMedianaValue = rowMediana.insertCell(1);
    cellMediana.innerHTML = "Mediana";
    cellMedianaValue.innerHTML = getMediana(); // Mediana

    const rowMaximo = tbody.insertRow();
    const cellMaximo = rowMaximo.insertCell(0);
    const cellMaximoValue = rowMaximo.insertCell(1);
    cellMaximo.innerHTML = "Maximo";
    cellMaximoValue.innerHTML = getMaximo(); // Maximo

    const rowMinimo = tbody.insertRow();
    const cellMinimo = rowMinimo.insertCell(0);
    const cellMinimoValue = rowMinimo.insertCell(1);
    cellMinimo.innerHTML = "Minimo";
    cellMinimoValue.innerHTML = getMinimo(); // Minimo

    const rowPrimerCuartil = tbody.insertRow();
    const cellPrimerCuartil = rowPrimerCuartil.insertCell(0);
    const cellPrimerCuartilValue = rowPrimerCuartil.insertCell(1);
    cellPrimerCuartil.innerHTML = "Primer Cuartil";
    cellPrimerCuartilValue.innerHTML = getPrimerCuartil(); // Primer Cuartil

    const rowSegundoCuartil = tbody.insertRow();
    const cellSegundoCuartil = rowSegundoCuartil.insertCell(0);
    const cellSegundoCuartilValue = rowSegundoCuartil.insertCell(1);
    cellSegundoCuartil.innerHTML = "Segundo Cuartil";
    cellSegundoCuartilValue.innerHTML = getMediana(); // Segundo Cuartil

    const rowDesvio = tbody.insertRow();
    const cellDesvio = rowDesvio.insertCell(0);
    const cellDesvioValue = rowDesvio.insertCell(1);
    cellDesvio.innerHTML = "Desvio Estandar";
    cellDesvioValue.innerHTML = getDesvio(); // Desvio Estandar
  });

function getMedia() {
  let acumulado = 0;
  dataJson.forEach((data) => {
    acumulado += data.Edad;
  });
  return (acumulado / dataJson.length).toFixed(2);
}

function getMediana() {
  const edades = dataJson.map(data => data.Edad).sort((a, b) => a - b);
  const length = edades.length;
  if (length % 2 === 0) {
    return ((edades[length / 2 - 1] + edades[length / 2]) / 2).toFixed(2);
  } else {
    return edades[Math.floor(length / 2)];
  }
}


function getMaximo() {
  return Math.max(...dataJson.map((data) => data.Edad));
}

function getMinimo() {
  return Math.min(...dataJson.map((data) => data.Edad));
}

function getPrimerCuartil() {
  dataJson.sort((a, b) => a.Edad - b.Edad);
  const length = dataJson.length;
  const primerCuartil = dataJson[Math.round(length * 0.25)].Edad;
  return primerCuartil;
}

function getDesvio() {
  const media = parseFloat(getMedia());
  const sumatoria = dataJson.reduce((acc, curr) => acc + Math.pow(curr.Edad - media, 2), 0);
  const desvio = Math.sqrt(sumatoria / dataJson.length);
  return desvio.toFixed(2);
}

function toggleVisibily(table) {
  table.classList.toggle("hidden");
}


window.onload = async () => {
  try {
    await obtainData();
    document.getElementById("tableCaption").innerText = 'Selecciona una tabla';
  } catch (error) {
    alert("Error fetching data. Please try again later.");
    document.getElementById("tableCaption").innerText =
      "Error al cargar los datos";
    document.getElementById("tableCaption").style.color = "red";
    document.getElementById("tableCaption").style.fontSize = "20px";
    document.getElementById('completeDataBtn').disabled = true;
    document.getElementById('frecuencyTableBtn').disabled = true;
    document.getElementById('statsTableBtn').disabled = true;
    
  }
  
};

