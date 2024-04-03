const mongoose = require('mongoose');


const brigadistaSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    apellido:{
        type: String,
        required: true
    },
    rut:{
        type: String,
        unique: true,
        required: true
    },

    email:{
        type: String,
        unique: true,
        required: true
    },

    edad:{
        type: Number,
        required: true
    },

    telefono:{
        type: Number,
        unique: true,
        required: true
    },
    inputEmail:{
        type: String,
        unique: true
    }
});

const brigadista = mongoose.model('Brigadista', brigadistaSchema);

module.exports = brigadista;