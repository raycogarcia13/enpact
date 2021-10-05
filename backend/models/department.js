const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Debe insertar la actividad'],
    },
    description:{
        type: String,
        required: [true, 'Debe insertar la descripción'],
    }
});

module.exports =  model('Department',dataSchema);