const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    description:{
        type: String,
        required: [true, 'Debe insertar la descripción'],
    },
    item:{
        type: String,
        required: [true, 'El valor de la configuración es obligatorio'],
        unique: true,
    }
});

module.exports =  model('Config',dataSchema);