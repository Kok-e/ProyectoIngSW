//Se importa modelo practica
const practica = require('../models/practicaModel');

//Se crea controlador para crear un practica
const createPractica = (req, res) => {
    const { nombre_practica, descripcion, fecha, lugar, herramientasEquipo, cuadrilla, comentarios } = req.body;
    const newPractica = new practica({
        nombre_practica,
        descripcion,
        fecha,
        lugar,
        herramientasEquipo,
        cuadrilla,
        comentarios

    });

    const fechaActual = new Date();

    if (new Date(fecha) <= fechaActual) {
        res.status(403).send({ error: 'fecha invalida' })
    } else {
        practica.exists({ "fecha": fecha }, {"cuadrilla": cuadrilla}, (err, existe) => {
            if (existe) {
                return res.status(400).send({ message: "Un escuadron no puede hacer mas de dos practicas por dia" })
            } else {
                if (!nombre_practica) {
                    return res.status(400).send({ error: 'El nombre de la práctica no puede estar vacío' });
                   }
                   const nombrePracticaRegex = /^[a-zA-Z0-9.,: ]+$/;
                   if (!nombrePracticaRegex.test(nombre_practica)) {
                    return res.status(400).send({ error: 'El nombre de la práctica solo puede contener letras y números' });
                   }
                   
                   // Validar que la descripción no esté vacía y solo contenga letras, números y ciertos caracteres especiales permitidos
                   if (!descripcion) {
                    return res.status(400).send({ error: 'La descripción no puede estar vacía' });
                   }
                   const descripcionRegex = /^[a-zA-Z0-9.,: ]+$/;
                   if (!descripcionRegex.test(descripcion)) {
                    return res.status(400).send({ error: 'La descripción solo puede contener letras y números' });
                   }
                   
                   // Validar que el lugar no esté vacío y solo contenga letras, números y ciertos caracteres especiales permitidos
                   if (!lugar) {
                    return res.status(400).send({ error: 'El lugar no puede estar vacío' });
                   }
                   const lugarRegex = /^[a-zA-Z0-9.,: ]+$/;
                   if (!lugarRegex.test(lugar)) {
                    return res.status(400).send({ error: 'El lugar solo puede contener letras y números' });
                   }
                   
                   // Validar que las herramientas/equipo no estén vacías y solo contengan letras, números y ciertos caracteres especiales permitidos
                   if (!herramientasEquipo) {
                    return res.status(400).send({ error: 'Las herramientas/equipo no pueden estar vacías' });
                   }
                   const herramientasEquipoRegex = /^[a-zA-Z0-9.,: ]+$/;
                   if (!herramientasEquipoRegex.test(herramientasEquipo)) {
                    return res.status(400).send({ error: 'Las herramientas/equipo solo pueden contener letras y números' });
                   }

                newPractica.save((err, practica) => {
                    if (err) {
                        return res.status(400).send({ message: "Error al crear la practica",err })
                    }
                    return res.status(201).send(practica)
                });
            }
        })
    }
}

//se crea controlador para obtener practicas

const getPractica = (req, res) => {
    practica.find({}, (err, practica) => {
        if (err) {
            return res.status(400).send('ERROR: no se pudo obtener la practica');
        }
        const fechaActual = new Date();
        const fecha = practica.map(fechas=>fechas.fecha);
        console.log(fecha);
    console.log(fechaActual);
        return res.status(201).send({status: "success", practica});
    })

}

//Se crea controlador para eliminar practica por fecha

const deletePractica = (req, res) => {
    const { id } = req.params;
    practica.findByIdAndDelete( id , (err, practica) => {
        if (err) {
            return res.status(400).send('ERROR: no se pudo obtener la practica');
        }
        if (!practica) {
            return res.status(404).send('ERROR: practica  no encontrada');
        }
        return res.status(200).send(practica)
    })
}

//Se crea controlador para actualizar datos del practica por fecha

const updatePractica = (req, res) => {
    const { id } = req.params;
    practica.findByIdAndUpdate( id, req.body, (err, practica) => {
        if (err) {
            return res.status(400).send('ERROR: no se pudo obtener la practica');
        }
        if (!practica) {
            return res.status(404).ssend('ERROR: practica  no encontrada')
        }
        return res.status(201).send({status:"success",practica})
    })
}

module.exports = {
    createPractica,
    getPractica,
    deletePractica,
    updatePractica
}