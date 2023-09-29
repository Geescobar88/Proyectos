async function cargarDatos() {
  const db = await fetch("./data/DB.json");
  const dbResponse = await db.json();
  const listado = await fetch("./data/stock.json");
  const listadoResponse = await listado.json();
  const vto = await fetch("./data/vto.json")
  const listadoVto = await vto.json();

  generarTotal(dbResponse, listadoResponse, listadoVto);

}

cargarDatos();

//////////////////////////////////GENERANDO TOTAL///////////////////////////////////

function generarTotal(dbResponse, listadoResponse, listadoVto) {
  const total = dbResponse.map((array1) => {
    const coincidencia = listadoResponse.find(
      (array2) => array2.CODARTICULO === array1.CODARTICULO
    );
    if (coincidencia) {
      return { ...array1, ...coincidencia };
    } else {
      return array1;
    }
  });

  filtrarDatos(total);
  seleccionarArticulo(total, listadoVto)
}

///////////////////////////////////FILTRANDO DATOS//////////////////////////////////

function filtrarDatos(total) {
  const filtroArt = document.getElementById("fNombre");
  const filtroCm = document.getElementById("fCodigoMin");
  const entrada = document.getElementById("entrada");
  const datalist = document.getElementById("medicacion");
  const borrar = document.getElementById("borrar")
  const busqueda = document.getElementById("busqueda")
//--------------------------Filtro por articulos---------------------
  filtroArt.addEventListener("change", () => {
    if (filtroArt.checked) {
      datalist.innerHTML = "";
      entrada.value = "";
      total.forEach((item) => {
        if (item.HABILITADO == "SI") {
          const newOption = document.createElement("option");
          const atribValue = document.createAttribute("value");
          atribValue.value = item.MEDICACION;
          newOption.setAttributeNode(atribValue);
          datalist.appendChild(newOption);
        }
      });
    }
  });

//--------------------------Filtro por Codigo ministerial---------------------

  filtroCm.addEventListener("change", () => {
    if (filtroCm.checked) {
      datalist.innerHTML = "";
      entrada.value = "";
      total.forEach((item) => {
        if (item.HABILITADO == "SI") {
          const newOption = document.createElement("option");
          const atribValue = document.createAttribute("value");
          atribValue.value = item.CODARTICULO;
          newOption.setAttributeNode(atribValue);
          datalist.appendChild(newOption);
        }
      });
    }
  });

  //--------------------------Otras funcionalidades---------------------

  borrar.addEventListener("click", () => {
    entrada.value = "";
  })

  busqueda.addEventListener("click", () => {
    if (entrada.disabled) {
      entrada.disabled = false;
      filtroArt.click();
    }
  })

  busqueda.addEventListener("dblclick", () => {
    borrar.click();
  })
}

//////////////////////////////////SELECCIONANDO ARTICULO////////////////////////////

function seleccionarArticulo(total, listadoVto) {
  const datalist = document.getElementById("medicacion");
  const entrada = document.getElementById("entrada");
  const nomArticulo = document.getElementById("nombreArticulo");
  const codMinisterial = document.getElementById("codMinisterial");
  const stockDeposito = document.getElementById("stockDeposito");
  
  entrada.addEventListener('change', () => {
    const articuloEncontrado = total.find((match) => match.MEDICACION === entrada.value)
    nomArticulo.textContent = articuloEncontrado.MEDICACION
    codMinisterial.textContent = articuloEncontrado.CODARTICULO
    stockDeposito.textContent = articuloEncontrado.STOCKENDEPOSITO
  })
}

