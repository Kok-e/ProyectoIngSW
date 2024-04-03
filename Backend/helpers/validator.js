// const validator = require("validator");

// const validate = (params) => {
//   let nombre =
//     !validator.isEmpty(params.nombre) &&
//     validator.isLength(params.nombre, { min: 3, max: undefined }) &&
//     validator.isAlpha(params.nombre, "es-ES");
//   let apellido =
//     !validator.isEmpty(params.apellido) &&
//     validator.isLength(params.apellido, { min: 3, max: undefined }) &&
//     validator.isAlpha(params.apellido, "es-ES");
//   let rut =
//     !validator.isEmpty(params.rut) &&
//     validator.isLength(params.rut, { min: 9, max: 10 });
//   let email =
//     !validator.isEmpty(params.email) && validator.isEmail(params.email);
//   let edad = !validator.isEmpty(params.edad);
//   let telefono = !validator.isEmpty(params.telefono);

//   if (!nombre || !apellido || !email || !rut || !telefono || !edad ) {
//     throw new Error('validacion no superada')
//   }else{
//     console.log('validacion superada')
//   }
// };

// module.exports = validate;
