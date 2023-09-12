async function cargarDatos() {
    const listado = await fetch("./data/stock.json");
    const listadoResponse = await listado.json()
    console.log(listadoResponse)
}

cargarDatos()