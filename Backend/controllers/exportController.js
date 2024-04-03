const practica = require('../models/practicaModel');
const Brigadista = require('../models/brigadista');
const Cuadrilla = require('../models/cuadrilla');

const CsvParser = require('json2csv').Parser;

// Funcion para exportar practicas

const exportPractica = async (req, res) => {
  try {
    let practicas = [];
    var practicaData = await practica.find({}); // Consultar los datos de la práctica desde la base de datos


    // Busca los datos necesarios en la BD y los añade en el array practicas
    practicaData.forEach((practica) => {
      const { nombre_practica, descripcion, fecha, lugar, herramientasEquipo, escuadrilla } = practica;
      practicas.push({ nombre_practica, descripcion, fecha, lugar, herramientasEquipo, escuadrilla });
    });


    // Ordena por fecha las practicas
    practicas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Aqui se definen las columnas que iran en el archivo CSV con su respectiva etiqueta
    const fields = [
      { label: 'Nombre', value: 'nombre_practica' },
      { label: 'Descripcion', value: 'descripcion' },
      { label: 'Fecha', value: 'fecha' },
      { label: 'Lugar', value: 'lugar' },
      { label: 'Herramientas', value: 'herramientasEquipo' },
      { label: 'Cuadrilla', value: 'escuadrilla' }
    ];
    const csvParser = new CsvParser({ fields, delimiter: ';' }); //Aqui se configura el parser de CSV con el delimitador ';' y las columnas definidas. 
    // Se delimita con ; debido a que excel utiliza ; y no la , 

    // Aqui se convierte el archivo JSON a CSV
    const csvData = csvParser.parse(practicas);


    res.setHeader("Content-Type", "text/csv; charset=utf-8"); //Aqui se configuran los headers de la respuesta HTTP para descargar el archivo CSV
    res.setHeader("Content-Disposition", "attachment; filename=practicasData.csv");

    res.status(200).end(csvData); // Enviar el archivo CSV como respuesta
  } catch (err) {
    console.error(err); // Agregar un console.log para mostrar el error en la consola
    return res.status(500).send('ERROR: No se logro exportar el archivo');
  }
}

// Funcion para exportar brigadistas

const exportBrigadista = async (req, res) => {
  try {
    let brigadistas = [];
    var brigadistaData = await Brigadista.find({});

    brigadistaData.forEach((Brigadista) => {
      const { nombre, apellido, rut, email, edad, telefono } = Brigadista;
      brigadistas.push({ nombre, apellido, rut, email, edad, telefono });
    });

    // Ordena los apellidos alfabeticamente

    brigadistas.sort((a, b) => {
      const apellidoA = a.apellido.toLowerCase();
      const apellidoB = b.apellido.toLowerCase();

      return apellidoA.localeCompare(apellidoB);
    });


    const fields = [
      { label: 'Nombre', value: 'nombre' },
      { label: 'Apellido', value: 'apellido' },
      { label: 'Rut', value: 'rut' },
      { label: 'Email', value: 'email' },
      { label: 'Edad', value: 'edad' },
      { label: 'Telefono', value: 'telefono' }
    ];
    const csvParser = new CsvParser({ fields, delimiter: ';' });
    const csvData = csvParser.parse(brigadistas);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=brigadistaData.csv");

    res.status(200).end(csvData);

  } catch (err) {

    console.error(err); // Agregar un console.log para mostrar el error en la consola
    return res.status(500).send('ERROR: No se logro exportar el archivo');
  }
}

//Funcion para exportar cuadrillas

const exportCuadrilla = async (req, res) => {
  try {
    let cuadrillas = [];
    // Llenar el campo brigadistas con los datos de los brigadistas
    var cuadrillaData = await Cuadrilla.find({}).populate('brigadistas', 'rut');

    cuadrillaData.forEach((Cuadrilla) => {
      const { nombre, brigadistas, sector } = Cuadrilla;
      // Mapear el campo brigadistas para incluir solo el RUT de cada brigadista
      const brigadistasRut = brigadistas.map(brigadista => brigadista.rut);
      cuadrillas.push({ nombre, brigadistas: brigadistasRut, sector });
    });

    // Ordena los apellidos alfabeticamente

    cuadrillas.sort((a, b) => {
      const nombreA = a.nombre.toLowerCase();
      const nombreB = b.nombre.toLowerCase();

      return nombreA.localeCompare(nombreB);
    });

    const fields = [
      { label: 'Nombre', value: 'nombre' },
      { label: 'Brigadistas', value: 'brigadistas' },
      { label: 'Sector', value: 'sector' },
    ];
    const csvParser = new CsvParser({ fields, delimiter: ';' });
    const csvData = csvParser.parse(cuadrillas);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=cuadrillaData.csv");

    res.status(200).end(csvData);

  } catch (err) {

    console.error(err); // Agregar un console.log para mostrar el error en la consola
    return res.status(500).send('ERROR: No se logro exportar el archivo');
  }
}

  //Funcion para exportar las cuadrillas mediante la ID

const exportCuadrillabyID = async (req, res) => {
  try {
    const { id } = req.params;
    let brigadistasCuadrilla = [];
    // Llenar el campo brigadistas con los datos de los brigadistas
    var cuadrillaData = await Cuadrilla.findById(id).populate('brigadistas', 'rut nombre apellido email telefono');
    const { nombre, brigadistas } = cuadrillaData;
    // Mapear el campo brigadistas para incluir solo el RUT de cada brigadista
    brigadistas.forEach(brigadista => {
      brigadistasCuadrilla.push({ rutBrigadista: brigadista.rut, nombreBrigadista: brigadista.nombre, apellidoBrigadista: brigadista.apellido, telefonoBrigadista: brigadista.telefono, correoBrigadista: brigadista.email});
    });

    brigadistasCuadrilla.sort((a, b) => {
      const apellidoBrigadistaA = a.apellidoBrigadista.toLowerCase();
      const apellidoBrigadistaB = b.apellidoBrigadista.toLowerCase();

      return apellidoBrigadistaA.localeCompare(apellidoBrigadistaB);
    });

    const fields = [
      { label: 'Rut ', value: 'rutBrigadista' },
      { label: 'Nombre ', value: 'nombreBrigadista' },
      { label: 'Apellido ', value: 'apellidoBrigadista' },
      { label: 'Telefono ', value: 'telefonoBrigadista' },
      { label: 'Correo', value: 'correoBrigadista' },
    ];
    
    const csvParser = new CsvParser({ fields, delimiter: ';' });
    const csvData = csvParser.parse(brigadistasCuadrilla);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${nombre}Data.csv`);

    res.status(200).end(csvData);
  } catch (err) {
    console.error(err);
    // Agregar un console.log para mostrar el error en la consola
    return res.status(500).send('ERROR: No se logro exportar el archivo');
  }
}
module.exports = {
  exportPractica,
  exportBrigadista,
  exportCuadrilla,
  exportCuadrillabyID
}