//Se importan los modelos a ocupar
const Comments = require ('../models/feedback');
const practicaModel = require('../models/practicaModel');

//Se crea requerimiento para añadir comentarios a una practica

const addComentario = async (req, res) => {
    try{                                           //Se ocupa try-catch para el manejo de errores
        const {id} = req.params;                   //se envia el ID de la practica por parametro

        const comentarioPromise = new Promise ((resolve, reject) => {  //Se ocupa una promesa para obtener los comentarios que coincidan con el parametro
           
           
            Comments.find({practica: {$eq: id}}, (err, comentarios) => {

                if(err) {   
                    reject(err);        //En caso de algun error se ejecutará esta funcion de reject, que significa que se rechaza la promesa.
                }

                const contenidoComentario = comentarios; //.map(comentario => comentario.contenido);   //En caso de que existan, se usa la funcion .map para obtener solo el contenido de los comentarios       
                resolve(contenidoComentario);  //el contenido de los comentarios se guardará como Array en la variable "contenidoComentario", y ese se devolvera. 
            });                                 //cuando se ejecuta la funcion resolve quiere decir que la promesa se resolvió sin ningún error.
        });   

        const contenidos = await Promise.all([comentarioPromise]);  //Se espera a que la promesa se resuelva y los valores encontrados se le asigna a la variable contenidos. 
       
        practicaModel.findByIdAndUpdate(id, {comentarios: contenidos}, (err, practicas) =>{     //Una vez que se resuelve la promesa, con la misma ID enviada por parametro se filtra 
                                                                                                    //y se le añaden los comentarios correspondientes.
            if(err){
                return res.status(400).send("ERROR: la práctica ingresada no se encuentra registrada"); //Si no se encuentra la ID de la práctica se enviará un error informando de la situación.
            }
          
            return res.status(201).send(practicas)  
        })
   
    } catch (err){
        return res.status(404).send("Ocurrió el siguiente error: ", err);   //En caso de cualquier otro error, se ejecutará este apartado del try-catch informando del error.
    }
}

module.exports = {addComentario}