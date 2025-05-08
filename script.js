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

function dataToTable(data) {
  let diccionario = jsonToDic(data);
  diccionario = Object.fromEntries(Object.entries(diccionario).sort()); // Ordenar por curso
  diccionario = Object.fromEntries(
    Object.entries(diccionario).sort((a, b) => a[1] - b[1])
  ); // Ordenar por cantidad de estudiantes
  let totalEstudiantes = 0;
  const total = Object.values(diccionario).reduce((a, b) => a + b, 0);
  for (const [curso, cantidad] of Object.entries(diccionario)) {
    const row = table.insertRow();
    const cell1 = row.insertCell(0); // curso
    const cell2 = row.insertCell(1); // cantidad
    const cell3 = row.insertCell(2); // f:acumulada
    const cell4 = row.insertCell(3); // f:relativa
    const cell5 = row.insertCell(4); // f:relativa porcentual
    cell1.innerHTML = curso;
    cell2.innerHTML = cantidad;
    totalEstudiantes += cantidad;
    cell3.innerHTML = totalEstudiantes;
    cell4.innerHTML = (cantidad / total).toFixed(2);
    cell5.innerHTML = ((cantidad / total) * 100).toFixed(2) + "%";
  }
  const row = table.insertRow();
  const cell1 = row.insertCell(0); // Total label
  const cell2 = row.insertCell(1); // Total value
  cell1.innerHTML = "Total";
  cell2.innerHTML = total;
}

window.onload = async () => {
  const data = await obtainData();
  dataToTable(data);
};

const completePoblationBtn = document
  .getElementById("completeDataBtn")
  .addEventListener("click", () => {
    const table = document.querySelector("table");
    const caption = (table.querySelector("caption").innerText =
      "Poblacion Total");
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
        const nombreA = a.nombre.toUpperCase(); // Ignorar mayúsculas
        const nombreB = b.nombre.toUpperCase(); // Ignorar mayúsculas
        if (nombreA < nombreB) {
          return -1; // a viene primero
        }
        if (nombreA > nombreB) {
          return 1; // b viene primero
        }
        return 0; // a y b son iguales
      });
      dataJson.forEach((data) => {
        const row = table.insertRow();
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
