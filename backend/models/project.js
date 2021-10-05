const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Debe insertar el nombre del proyecto '],
    },
    code: {
        type: String,
        required: [true, 'Debe insertar el código'],
    },
    initialDateP: {
        type: Date,
        required: [true, 'Debe insertar la fecha inicial'],
    },
    finalDateP: {
        type: Date,
    },
    initialDateR: {
        type: Date,
    },
    finalDateR: {
        type: Date,
    },
    deletedAt:Date
});

module.exports =  model('Project',dataSchema);