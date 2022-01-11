const { Schema, model, Types } = require("mongoose");

const dataSchema = new Schema({
    month:{
        type: Number,
        required: [true, 'Debe insertar el mes'],
    },
    year:{
        type: Number,
        required: [true, 'Debe insertar el año'],
    },
    status:{
        type: String,
        enum : ['open','closed'],
        default: 'open'
    },
    prod_bruta:{
        type: Number
    },
    prod_merc:{
        type: Number
    },
    cierre:[{
            projector:{
                type: Types.ObjectId,
                ref:"Projector"
            },
            times:[{
                service:{
                    type: Types.ObjectId,
                    ref:"Service"
                },
                time:Number
            }]
    }],
    closeDate: Date,
    deletedAt:Date

});

module.exports =  model('Month',dataSchema);