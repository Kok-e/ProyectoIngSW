const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CuadrillaSchema = new Schema({
    nombre: {
      type: String,
      minlength: 3,
      maxlength: 32,
      require: true
    },
    brigadistas: [{
        type: mongoose.Schema.ObjectId,
        ref: "Brigadista"
    }],
    sector: {
      type: String,
      minlength: 3,
      require: true
    }
  });

  const Cuadrilla = mongoose.model('Cuadrilla', CuadrillaSchema);

module.exports = Cuadrilla;