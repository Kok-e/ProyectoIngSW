const mongoose = require('mongoose');

const Practica = mongoose.model('Practica', {
    nombre_practica: {
        type: String,
        minlength: 3,
        require: true
    },
    descripcion: {
        type: String,
        minlength: 20,
        maxlenght: 200,
        require: true
    },

    fecha: {
        type: Date,
        require: true,
    },
    lugar: {
        type: String,
        minlength: 3,
        maxlength: 50,
        require: true
    },
    herramientasEquipo: {
        type: String,
        minlength: 6,
        maxlength: 100,
        require: true
    },
    cuadrilla:{
        type: mongoose.Schema.ObjectId,
        ref:'Cuadrilla'
      },
    comentarios: {
        type: Array,
        default: []
    }

});


module.exports = Practica;
