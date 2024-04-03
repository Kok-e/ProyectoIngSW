const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const practicaRoutes = require('./routes/practicaRoutes');
const brigadistaRoutes = require('./routes/brigadistaRoutes');
const cuadrillaRoutes = require('./routes/cuadrillaRoutes');
const nodemailerRoutes = require('./routes/nodemailerRoutes');
const addCommentsRoutes = require('./routes/addCommentsRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

//Conexión a base de datos

mongoose.connect(process.env.DB,(error) =>{
    if(error){
        console.log(error);
    }else{
        console.log("Conectado en la base de datos");
    }
});


//Llamado de rutas
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('*', cors());
app.use('/api', feedbackRoutes);
app.use('/api', practicaRoutes);
app.use('/api', brigadistaRoutes);
app.use('/api', cuadrillaRoutes);
app.use('/api', nodemailerRoutes);
app.use('/api', addCommentsRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server iniciado en el puerto: ${process.env.PORT}`);
})
