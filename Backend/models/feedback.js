const mongoose = require('mongoose');


const FeedbacksSchema = new mongoose.Schema({
    contenido:{
        type: String,
        require: true,
        minlength: 50
    },
    practica:{
        type: String,
        require: true
    }
},
{
    timestamps:true
}
);

const Feedbacks = mongoose.model('Feedback', FeedbacksSchema);

module.exports = Feedbacks;
