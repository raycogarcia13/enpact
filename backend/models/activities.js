const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Debe insertar la actividad'],
    },
    description:{
        type: String,
        required: [true, 'Debe insertar la descripción'],
    },
    rating:{
        type:Boolean,
        default:false
    },
    editable:{
        type:Boolean,
        default:true
    },
    deletedAt:{
        type: Date
    }
});

module.exports =  model('Activity',dataSchema);