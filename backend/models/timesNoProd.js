const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    activity:{
        type: Types.ObjectId,
        required: [true, 'Debe escoger la actividad'],
        ref:"Activity"
    },
    projector:{
        type: Types.ObjectId,
        required: [true, 'Debe escoger proyectista'],
        ref:"Projector",
    },
    date:{
        type:Date
    },
    day: Number,
    month: Number,
    year: Number,
    cantHours:{
        type:Number,
        required: [true, 'DebeDebe insertar la cantidad de horas'],
    }
});

module.exports =  model('TimesNoProd',dataSchema);