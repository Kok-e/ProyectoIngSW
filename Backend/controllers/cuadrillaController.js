const Cuadrilla = require('../models/cuadrilla');
const Brigadista = require('../models/brigadista');
const brigadista = require('../models/brigadista');

// Función para crear una cuadrilla

const createCuadrilla = async (req, res) => {
  const { nombre, brigadistas: brigadistasRut, sector } = req.body;

  // Validar el nombre de la cuadrilla
  if (!nombre || nombre.length < 3) {
    return res.status(400).send({status:"error", message:'ERROR: El nombre de la cuadrilla debe tener al menos 3 caracteres'});
  }

  // Validar que el nombre de la cuadrilla no contenga caracteres especiales
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  if (specialCharsRegex.test(nombre)) {
    return res.status(400).send({status:"error", message:'ERROR: El nombre de la cuadrilla no puede contener caracteres especiales'});
  }

  // Verificar si ya existe una cuadrilla con el mismo nombre
  const existingCuadrilla = await Cuadrilla.findOne({ nombre: nombre });
  if (existingCuadrilla) {
    return res.status(400).send({status:"error", message:`ERROR: Ya existe una cuadrilla con el nombre ${nombre}`});
  }

  // Validar el número de brigadistas
  if (!brigadistasRut || brigadistasRut.length < 1 || brigadistasRut.length > 50) {
    return res.status(400).send('ERROR: Ingrese una cantidad válida de brigadistas.');
  }

  // Se verifica si los brigadistas están en la base de datos y se obtienen sus IDs
  const brigadistas = [];
  for (const rut of brigadistasRut) {
    const brigadista = await Brigadista.findOne({ rut: rut });
    if (!brigadista) {
      // El brigadista no está en la base de datos
      return res.status(400).send(`ERROR: El brigadista con RUT ${rut} no existe en la base de datos`);
    }
    brigadistas.push(brigadista._id);
  }

  // Validar el sector
  if (!sector || sector.length < 3 || sector.length > 32) {
    return res.status(400).send({status:"error", message:'ERROR: El sector debe tener entre 3 y 32 caracteres'});
  }
  if (specialCharsRegex.test(sector)) {
    return res.status(400).send({status:"error", message:'ERROR: El sector no puede contener caraceteres especiales'});
  }

  // Los brigadistas están en la base de datos, continuar con la creación de la cuadrilla
  const newCuadrilla = new Cuadrilla({ nombre, brigadistas, sector });
  newCuadrilla.save((err, Cuadrilla) => {
    if (err) {
      return res.status(400).send('ERROR: no se pudo crear el brigadista');
    }
    return res.status(201).send({status: "success", Cuadrilla, message: 'Cuadrilla creada con exito'});
  });
};

// Función para obtener todas las cuadrillas

const getCuadrilla = async (req, res) => {
  try {
    const cuadrillas = await Cuadrilla.find({}).populate('brigadistas', 'rut nombre apellido -_id');
    return res.status(200).send({status:"success",cuadrillas});
  } catch (err) {
    return res.status(400).send('ERROR: no fue posible obtener las cuadrillas');
  }
}

const getCuadrillaID = (req, res) => {
  const { id } = req.params;
  Cuadrilla.findById(id, (err, cuadrillas) => {
    if (err) {
      return res.status(400).send({status:"error", message:"ERROR: no se ha econtrado la cuadrilla"});
    }
    if (!cuadrillas) {
      return res.status(404).send({status:"error", message:"ERROR: no se ha encontrado la cuadrilla"});
    }
    return res.status(200).send({
      status: "success",
      cuadrillas,
    });
  });
};

// Función para actualizar una cuadrilla

const updateCuadrilla = async (req, res) => {
  try {
    const { id } = req.params;
    const { brigadistas: brigadistasId, nombre, sector } = req.body;

    // Verificar si los brigadistas están en la base de datos y obtener sus IDs
    const brigadistas = [];
    if (brigadistasId) {
      for (const brigadistaId of brigadistasId) {
        const brigadista = await Brigadista.findById(brigadistaId);
        if (!brigadista) {
          // El brigadista no está en la base de datos
          return res.status(400).send(`ERROR: El brigadista con ID ${brigadistaId} no existe en la base de datos`);
        }

        // Verificar si el brigadista ya está asociado a la cuadrilla
        const cuadrilla = await Cuadrilla.findById(id);
        if (cuadrilla.brigadistas.includes(brigadistaId)) {
          // Si el brigadista ya está en la cuadrilla, no se añade nuevamente
          continue;
        }

        brigadistas.push(brigadistaId);
      }
    }

    /* Se actualiza una cuadrilla existente en la base de datos añadiendo nuevos brigadistas, 
       si se actualiza correctamente nos devolverá la cuadrilla actualizada correctamente. */

    const cuadrilla = await Cuadrilla.findByIdAndUpdate(
      id,
      { $push: { brigadistas: { $each: brigadistas } }, nombre, sector },
      { new: true }
    );
    return res.status(200).send({ status: 'success', message: 'Actualizado correctamente', cuadrilla });
  } catch (err) {
    return res.status(400).send(err);
  }
}

const removeBrigadistaFromCuadrilla = async (req, res) => {
  try {
    const { id } = req.params;
    const { brigadistaId } = req.body;

    // Eliminar el brigadista del arreglo de brigadistas en el documento de cuadrilla
    const cuadrilla = await Cuadrilla.findByIdAndUpdate(
      id,
      { $pull: { brigadistas: brigadistaId } },
      { new: true }
    );
    return res.status(200).send({ status: 'success', message: 'Brigadista eliminado correctamente', cuadrilla });
  } catch (err) {
    return res.status(400).send(err);
  }
}

// Función para eliminar una cuadrilla

const deleteCuadrilla = (req, res) => {
  const { id } = req.params;
  Cuadrilla.findByIdAndDelete(id, (err, Cuadrilla) => {
    if (err) {
      return res.status(400).send({ message: "Error al obtener cuadrilla" })
    }
    if (!Cuadrilla) {
      return res.status(404).send({ message: "Cuadrilla no encontrada" })
    }
    return res.status(200).send(Cuadrilla)
  });

}




module.exports = {
  createCuadrilla,
  getCuadrilla,
  deleteCuadrilla,
  updateCuadrilla,
  getCuadrillaID,
  removeBrigadistaFromCuadrilla
}