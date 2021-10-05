const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    initialDateP: Date,
    finalDateP: Date,
    initialDateR: Date,
    finalDateR: Date,
    projectManager:{
        type: Types.ObjectId,
        required: [true, 'Debe insertar el jefe de proyecto'],
        ref:"Projector"
    },
    team:[{
        type: Types.ObjectId,
        ref:"Projector"
    }],
    project:{
        type: Types.ObjectId,
        required: [true, 'Debe escojer el proyecto al que pertence el sericio'],
        ref:"Project"
    },
    name:{
        type:String,
        required:[true,"Debe insertar el nombre del servicio"]
    },
    code:{
        type:String,
        required:[true,"Debe insertar el código del servicio"]
    },
    deletedAt:Date

});

module.exports =  model('Service',dataSchema);