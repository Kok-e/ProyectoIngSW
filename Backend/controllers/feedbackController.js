//Se importa modelo feedback
const Feedback = require('../models/feedback');  


//Se crea controlador para crear un comentario
const createFeedback = (req, res) => {
    const {contenido, practica} = req.body;
    const newFeedback = new Feedback ({
        contenido,
        practica
    });

    //Se realizan las respectivas validaciones a los campos ingresados
    if(req.body.practica == null){
        return res.status(404).send('ERROR: el campo de practica es obligatorio')
    }else{
        if(req.body.contenido == null){
            return res.status(404).send('ERROR: el campo de contenido es obligatorio')
        }else{
            if(req.body.contenido.length < 50){
                return res.status(404).send('ERROR: el comentario es demasiado corto.')
            }else{
                newFeedback.save((err, Feedback) => {
                    if(err){
                        return res.status(400).send('ERROR: no se pudo crear el comentario');
                    }
                    return res.status(201).send(Feedback)
                });
            }
        }
    }
}

//se crea controlador para obtener comentarios

const getFeedback = (req, res) => {
    Feedback.find({}, (err, feedbacks) =>{
        if(err){
            return res.status(400).send('ERROR: no se pudieron obtener los comentarios');
        }
        return res.status(201).send(feedbacks);
    })    
}

//Se crea controlador para actualizar un comentario

const updateFeedback = (req, res) =>{
    const {id} = req.params;
    Feedback.findByIdAndUpdate(id, req.body, (err, feedbacks)=>{
        if(err){
            return res.status(400).send('ERROR: no se pudo obtener el comentario');
        }
        if(!feedbacks){
            return res.status(400).send('ERROR: no existe el comentario');
        }
            return res.status(201).send(feedbacks);
    })
    }

//Se crea el controlador para eliminar un comentario



const deleteFeedback = (req, res) =>{
    const {id} = req.params;
    Feedback.findByIdAndDelete(id, (err, feedbacks)=>{
        if(err){
            return res.status(400).send('ERROR: no se pudo obtener el comentario');
        }
        if(!feedbacks){
            return res.status(400).send('ERROR: no existe el comentario');
        }
            return res.status(201).send(feedbacks);
        
    })
}









module.exports={
    createFeedback,
    getFeedback,
    updateFeedback,
    deleteFeedback
}