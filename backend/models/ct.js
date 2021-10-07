const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    service:{
        type: Types.ObjectId,
        required: [true, 'Debe insertar el id del servicio'],
        ref:"Service"
    },
    projector:{
        type: Types.ObjectId,
        required: [true, 'Debe insertar el id del proyectista'],
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
        required: [true, 'Debe insertar la cantidad de horas']
    }
});

module.exports =  model('ct',dataSchema);