const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Debe insertar el nombre'],
    },
    username:String,
    department:{
        type: Types.ObjectId,
        ref:"Department"
    },
    deletedAt:Date
});

module.exports =  model('Leader',dataSchema);