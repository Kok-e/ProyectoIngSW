const brigadista = require("../models/brigadista");
const validate = require("../helpers/validator");
// const collect = require('collect.js');
//Se crea controlador para crear un brigadista
const createBrigadista = (req, res) => {
  const { nombre, apellido, rut, email, edad, telefono } = req.body;
  const newBrigadista = new brigadista({
    nombre,
    apellido,
    rut,
    email,
    edad,
    telefono,
  });

  if (
    newBrigadista.nombre === undefined ||
    newBrigadista.apellido === undefined ||
    newBrigadista.rut === undefined ||
    newBrigadista.email === undefined ||
    newBrigadista.telefono === undefined ||
    newBrigadista.edad === undefined
  ) {
    return res.status(400).send({
      status: "error",
      message: "verifique que todos los campos esten completos",
    });
  }
  if (newBrigadista.rut !== undefined) {
    var indexRut = newBrigadista.rut.indexOf("-");
    console.log(indexRut);
  } else {
    return res.status(400).send({
      status: "error",
      message: "Ingrese un rut (ej: 12345673-8)",
    });
  }

  if (newBrigadista.rut[indexRut] !== "-") {
    return res.status(400).send({
      status: "error",
      message:
        "No se encuentra el guion, ingrese un rut valido (ej: 12345673-8)",
    });
  }
  if (indexRut !== 8 && indexRut !== 7) {
    return res.status(400).send({
      status: "error",
      message: "Ingrese un rut valido (ej: 12345673-8)",
    });
  }
  for (let i = 0; i < indexRut; i++) {
    if (newBrigadista.rut[i] >= 0 && newBrigadista.rut[i] < 10) {
      continue;
    } else {
      return res.status(400).send({
        status: "error",
        message: "Ingrese un rut valido (ej: 12345673-8)",
      });
    }
  }

  if (!((newBrigadista.rut[indexRut + 1] > 0 && newBrigadista.rut[indexRut + 1] < 10) || (newBrigadista.rut[indexRut + 1] === "k"))) {
    return res.status(400).send({
      status: "error",
      message:
        "El digito verificar es invalido, ingrese un rut valido (ej: 1234567-8)",
    });
  }

  if (newBrigadista.email === undefined) {
    return res.status(400).send({
      status: "error",
      message: "Ingrese un email",
    });
  }
  if (!newBrigadista.email.endsWith("@gmail.com")) {
    return res.status(400).send({
      status: "error",
      message: "Ingrese un dominio valido en el campo email",
    });
  }
  if (newBrigadista.telefono === undefined) {
    return res.status(400).send({
      status: "error",
      message: "Ingrese un numero te telefono (ej: 952345678)",
    });
  }
  if (newBrigadista.telefono.toString().length !== 9) {
    return res.status(400).send({
      status: "error",
      message: "Ingrese un numero te telefono valido (ej: 952345678)",
    });
  }
  if (newBrigadista.edad < 18) {
    return res.status(400).send({
      status: "error",
      message: "El brigadista debe ser mayor a 18 años",
    });
  }

  // //validacion avanzada
  // try {
  //     validate(newBrigadista)
  // } catch (error) {
  //     return res.status(400).send({
  //         status: 'error',
  //         message: 'validacion fallida'
  //     });
  // }

  //hasta aqui las validaciones
  newBrigadista.save((err, brigadista) => {
    if (err) {
      return res.status(400).send({
        status: "error",
        message:
          "no se pudo crear el brigadista, verifique que no exista o que todos los campos esten completos",
      });
    } else {
      return res.status(201).send({
        status: "success",
        brigadista,
        message: 'Registrado con exito'
      });
    }
  });
};

//se crea controlador para obtener brigadistas

const getBrigadistas = (req, res) => {
  // brigadista.find({}, (err, brigadistas) =>{
  //     if(err){
  //         return res.status(400).send({
  //             status: 'error',
  //             message: 'ERROR: no se pudieron obtener los brigadistas'
  //         });
  //     }
  //     return res.status(201).send({
  //         status: 'success',
  //         brigadistas
  //     });
  // })
  // if (req.params.input) {
  // let input = req.params.input;

  brigadista.find({}, (err, brigadistas) => {
    // if (req.params.input) {
    //     let input = req.params.input;
    //     console.log('el input es:' ,input);
    //     const emailBrigadistas = brigadistas.filter(brigadista => brigadista.email.startsWith(input));
    //     console.log(emailBrigadistas)
    //     return res.status(201).send({
    //         status: 'success',
    //         emailBrigadistas
    //     });
    // }
    if (err) {
      return res.status(400).send({
        status: "error",
        message: "ERROR: no se pudieron obtener los brigadistas",
      });
    }
    return res.status(201).send({
      status: "success",
      brigadistas,
    });
  });
};
const getSpecificBrigadista = (req, res) => {
  const { id } = req.params;
  brigadista.findById(id, (err, brigadistas) => {
    if (err) {
      return res.status(400).send("ERROR: no se encontro al brigadista");
    }
    if (!brigadistas) {
      return res.status(404).send("ERROR: brigadista  no encontrado");
    }
    return res.status(200).send({
      status: "success",
      brigadistas,
    });
  });
};

const getBrigadistaByInput = (req, res) => {
  const { inputEmail } = req.body;
  console.log(inputEmail);

  const buscarEmail = inputEmail.trim().length;
  console.log(buscarEmail);

  let cantidadMatchBrigadista = 0;

  console.log("brigadista.email", brigadista.email);

  brigadista.find({}, (err, brigadistas) => {
    const emails = brigadistas.map((brigadista) => brigadista.email);
    console.log(emails);

    for (let i = 0; i < emails.length; i++) {
      const emailFormateado = emails[i].toLowerCase().trim();
      console.log("email formateado", emailFormateado);

      if (emailFormateado === inputEmail.toLowerCase().trim()) {
        console.log("match!!!");

        cantidadMatchBrigadista++;

        console.log("Email a buscar: ", inputEmail);

        const foundByEmail = brigadistas.find(
          (brigadistaMatch) => brigadistaMatch.email === inputEmail
        );
        console.log("EMAIL FOUND!!!! :D ", foundByEmail);
        return res.status(201).send(foundByEmail);
      }

      if (emailFormateado.length < 1) {
        return res.status(400).send("No existe ningun brigadista");
      }
    }
    if (cantidadMatchBrigadista === 0) {
      return res.status(400).send("No existe el brigadista");
    }
  });
};

const deleteBrigadista = (req, res) => {
  const { id } = req.params;
  brigadista.findByIdAndDelete(id, (err, brigadistas) => {
    if (err) {
      return res.status(400).send("ERROR: no se pudo eliminar al brigadista");
    }
    if (!brigadistas) {
      return res.status(404).send("ERROR: brigadista  no encontrado");
    }
    return res.status(200).send(brigadistas);
  });
};

//Se crea controlador para actualizar datos del brigadista por rut

const updateBrigadista = (req, res) => {
  const { id } = req.params;
  brigadista.findByIdAndUpdate(id, req.body, (err, brigadistas) => {
    if (
      brigadistas.nombre === undefined ||
      brigadistas.apellido === undefined ||
      brigadistas.rut === undefined ||
      brigadistas.email === undefined ||
      brigadistas.telefono === undefined ||
      brigadistas.edad === undefined
    ) {
      return res.status(400).send({
        status: "error",
        message: "verifique que todos los campos esten completos",
      });
    }
    if (brigadistas.rut !== undefined) {
      var indexRut = brigadistas.rut.indexOf("-");
      console.log(indexRut);
    } else {
      return res.status(400).send({
        status: "error",
        message: "Ingrese un rut (ej: 12345673-8)",
      });
    }
  
    if (brigadistas.rut[indexRut] !== "-") {
      return res.status(400).send({
        status: "error",
        message:
          "No se encuentra el guion, ingrese un rut valido (ej: 12345673-8)",
      });
    }
    if (indexRut !== 8 && indexRut !== 7) {
      return res.status(400).send({
        status: "error",
        message: "Ingrese un rut valido (ej: 12345673-8)",
      });
    }
    for (let i = 0; i < indexRut; i++) {
      if (brigadistas.rut[i] >= 0 && brigadistas.rut[i] < 10) {
        continue;
      } else {
        return res.status(400).send({
          status: "error",
          message: "Ingrese un rut valido (ej: 12345673-8)",
        });
      }
    }
  
    if (!((brigadistas.rut[indexRut + 1] > 0 && brigadistas.rut[indexRut + 1] < 10) || (brigadistas.rut[indexRut + 1] === "k"))) {
      return res.status(400).send({
        status: "error",
        message:
          "El digito verificar es invalido, ingrese un rut valido (ej: 1234567-8)",
      });
    }
  
    if (brigadistas.email === undefined) {
      return res.status(400).send({
        status: "error",
        message: "Ingrese un email",
      });
    }
    if (!brigadistas.email.endsWith("@gmail.com")) {
      return res.status(400).send({
        status: "error",
        message: "Ingrese un dominio valido en el campo email",
      });
    }
    if (brigadistas.telefono === undefined) {
      return res.status(400).send({
        status: "error",
        message: "Ingrese un numero te telefono (ej: 952345678)",
      });
    }
    if (brigadistas.telefono.toString().length !== 9) {
      return res.status(400).send({
        status: "error",
        message: "Ingrese un numero te telefono valido (ej: 952345678)",
      });
    }
    if (brigadistas.edad < 18) {
      return res.status(400).send({
        status: "error",
        message: "El brigadista debe ser mayor a 18 años",
      });
    }
  
    if (err) {
      return res.status(400).send("ERROR: no se pudo obtener al brigadista");
    }
    if (!brigadistas) {
      return res.status(404).send("ERROR: brigadista  no encontrado");
    }

    return res.status(201).send({
      status: "success",
      brigadistas,
    });
  });
};

module.exports = {
  createBrigadista,
  getBrigadistas,
  getBrigadistaByInput,
  deleteBrigadista,
  updateBrigadista,
  getSpecificBrigadista,
  // getByName
};