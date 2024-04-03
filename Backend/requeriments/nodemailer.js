const Brigadista = require('../models/brigadista');
const Practica = require('../models/practicaModel');
const Cuadrilla = require('../models/cuadrilla');
const mongoose = require('mongoose');

const nodemailer = require('nodemailer');

const enviarCorreoACuadrillaDePractica = async (req, res) => {
  try {
    const practicaId = req.params.id;
    const practica = await Practica.findById(practicaId).populate({
      path: 'cuadrilla',
      populate: {
        path: 'brigadistas'
      }
    });
    const cuadrilla = practica.cuadrilla;
    const brigadistas = cuadrilla.brigadistas;
    const fechaPractica = practica.fecha; // Obtener la fecha de la práctica

    console.log('brigadistas:', brigadistas);

    const correos = brigadistas.map(brigadista => brigadista.email);

    console.log('correos:', correos);

    await enviarMail(correos, fechaPractica); // Pasar la fecha de la práctica como un argumento adicional
    res.status(200).send('Correos enviados exitosamente');
  } catch (err) {
    console.log(err);
    res.status(400).send('ERROR: no se pudo enviar el correo');
  }
}

enviarMail = async (correos, fechaPractica) => { // Recibir la fecha de la práctica como un argumento adicional
  const config = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'kokejara2001@gmail.com',
      pass: 'onquehnrsgjulsqc'
    }
  }

  // Personalizar el texto del correo electrónico para incluir la fecha de la práctica
  const mensaje = {
    from: 'kokejara2001@gmail.com',
    to: correos,
    subject: 'Correo de prueba',
    text: `La práctica se realizará en la fecha ${fechaPractica}`
  }

  const transporte = nodemailer.createTransport(config)

  const info = await transporte.sendMail(mensaje);

  return info;
}
//enviarMail();
module.exports = {
  //correoBrigadista,
  //enviarCorreoACuadrillas,
  enviarCorreoACuadrillaDePractica
};
