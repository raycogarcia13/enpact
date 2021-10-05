const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    description:{
        type: String,
        required: [true, 'Debe insertar la descripción'],
    },
    day:{
        type: Number,
        required: [true, 'Debe insertar el día'],
    },
    month:{
        type: Number,
        required: [true, 'Debe insertar el mes'],
    },
    year: Number,
    date: Date,
    repeat:Boolean

    
});

module.exports =  model('Holydays',dataSchema);