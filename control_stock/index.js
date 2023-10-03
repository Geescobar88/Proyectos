async function cargarDatos() {
  const db = await fetch("./data/DB.json");
  const dbResponse = await db.json();
  const listado = await fetch("./data/stock.json");
  const listadoResponse = await listado.json();
  const vto = await fetch("./data/vto.json")
  const listadoVto = await vto.json();

  generarTotal(dbResponse, listadoResponse, listadoVto);
  menubar();
}

cargarDatos();

///////////////////////////////////////MENU/////////////////////////////////////////

function menubar() {
  menu = document.getElementById("menu")
  menu.addEventListener("click", () => {
    alert("Esto hará algo en un futuro..")
  })
}

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
  const nomArticulo = document.getElementById("nombreArticulo");
  const codMinisterial = document.getElementById("codMinisterial");
  const stockDeposito = document.getElementById("stockDeposito");
  const estadoStock = document.getElementById("estadoStock")
  const consumo = document.getElementById("consumo")

  const tabla = document.getElementById("tabla");

//--------------------------Filtro por articulos---------------------
  filtroArt.addEventListener("change", () => {
    borrar.click();
    if (filtroArt.checked) {
      datalist.innerHTML = "";
      entrada.value = "";
      tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Cantidad</th></tr>";
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
    borrar.click();
    if (filtroCm.checked) {
      datalist.innerHTML = "";
      entrada.value = "";
      tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Cantidad</th></tr>";
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
    nomArticulo.textContent = "-----";
    codMinisterial.textContent = "-----";
    stockDeposito.textContent = "-----"
    estadoStock.textContent = "-----"
    estadoStock.style.color ="black"
    consumo.textContent = "-----"
    tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Cantidad</th></tr>";
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
  const entrada = document.getElementById("entrada");
  const nomArticulo = document.getElementById("nombreArticulo");
  const codMinisterial = document.getElementById("codMinisterial");
  const stockDeposito = document.getElementById("stockDeposito");
  const estadoStock = document.getElementById("estadoStock")
  const consumo = document.getElementById("consumo")

  const tabla = document.getElementById("tabla");
  
  entrada.addEventListener('change', () => {

//--------------------------Filtrar un articulo---------------------

    const articuloEncontrado = total.find((match) => match.MEDICACION === entrada.value || match.CODARTICULO === entrada.value)
    nomArticulo.textContent = articuloEncontrado.MEDICACION
    codMinisterial.textContent = articuloEncontrado.CODARTICULO
    stockDeposito.textContent = articuloEncontrado.STOCKENDEPOSITO
    consumo.textContent = articuloEncontrado.STOCK_MIN
    if (articuloEncontrado.STOCKENDEPOSITO <= articuloEncontrado.STOCK_MIN) {
      estadoStock.textContent = "Critico"
      estadoStock.style.color = "red";
    } else if (articuloEncontrado.STOCKENDEPOSITO >= articuloEncontrado.STOCK_MIN * 2) {
      estadoStock.textContent = "En stock"
      estadoStock.style.color = "green";
    } else {
      estadoStock.textContent = "Minimo"
      estadoStock.style.color = "black";
    }

//--------------------------Tabla de vencimientos---------------------

    const filtroArtVto = listadoVto.filter((match) => {
      return articuloEncontrado.CODARTICULO === match.CODARTICULO
    })

    tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Cantidad</th></tr>";
    filtroArtVto.forEach((articulo) => {
      const row = tabla.insertRow();
      const loteCell = row.insertCell(0);
      const vencimientoCell = row.insertCell(1);
      const cantidadCell = row.insertCell(2);

      loteCell.innerHTML = articulo.NROLOTE;
      vencimientoCell.innerHTML = articulo.FECHAVTO;
      cantidadCell.innerHTML = articulo.STOCKEXISTENTE;
    })
  })
}

