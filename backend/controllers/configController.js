const Holidays = require('../models/holidays');
const Config = require('../models/config');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const asyncForEach = require('../utils/asyncForEach')

const {hours} = require('../config/datas/base')

// get holidays  => /api/v1/days/holy
exports.config = catchAsyncErrors(async (req,res,next) =>{
    
    const value = JSON.stringify(hours);
    if(await Config.findOne({name:'schedule'}))
        res.json({status:"failed",msg:"The application its already configured"})
    const c = await Config.create({
        name:"schedule",
        description:"Horas de trabajo diario",
        item:value
    })

    return res.json({
        status:"success",
        msg:"Project configured",
        data:{
            scedule:c
        }
    })
})





