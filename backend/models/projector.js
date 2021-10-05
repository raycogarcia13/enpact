const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Debe insertar la actividad'],
    },
    username:String,
    charge: {
        type: String,
    },
    department:{
        type: Types.ObjectId,
        ref:"Department"
    },
    salary: Number,
    deletedAt:Date
});

module.exports =  model('Projector',dataSchema);