const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    activity:{
        type: Types.ObjectId,
        required: [true, 'Debe escoger la actividad'],
        ref:"Activities"
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
    cantHours:Number
});

module.exports =  model('TimesNoProd',dataSchema);