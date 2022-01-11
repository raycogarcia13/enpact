const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    description:{
        type: String,
        required: [true, 'Debe insertar la descripción'],
    },
    dia:{
        type:Number,
        required: [true, 'Debe insertar el dia'],
    },
    mes:{
        type:Number,
        required: [true, 'Debe insertar el mes'],
    },
    date:{
        type:Date,
        required: [true, 'Debe insertar escoger la fecha'],
        unique:true
    },
    repeat:{
        type:Boolean,
        default: true
    }
});

module.exports =  model('Holidays',dataSchema);