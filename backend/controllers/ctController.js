const Services = require('../models/services');
const Activity = require('../models/activities');
const Projector = require('../models/projector');
const Ct = require('../models/ct');
const TimesNoProd = require('../models/timesNoProd');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const asyncForEach = require('../utils/asyncForEach')

// post get my ct  => /api/v1/department
exports.get = catchAsyncErrors(async (req,res,next) =>{
     const { _id } = req.user.projector
     const { date } = req.body
    
    // services
    const services = await Ct.find({projector:_id,date})
        .populate('service');
   
    const noProd = await TimesNoProd.find({projector:_id,date})
        .populate('activity');

    return res.json({
        status:"success",
        count: services.length+noProd.length,
        services,
        activities:noProd
    })
})

// put update/store ct  => /api/v1/department
exports.store = catchAsyncErrors(async (req,res,next) =>{
    const me = req.user.projector._id;
    const {id,type,cantHours,date} = req.body

    if(!id || !type || !cantHours || !date)
        return next(new ErrorHandler('Empty datas',400))
     const fecha = new Date(Date.parse(date));
    let data;
    if(type == 'service'){
       data = await Ct.findOne({service:id,projector:me, date});
       if(data){
            data.cantHours = cantHours;
            await data.save();
       }
       else{
           data = await Ct.create({
                service:id,
                projector:me,
                date,
                cantHours,
                day:fecha.getDate(),
                month:fecha.getMonth(),
                year:fecha.getFullYear()
           });
       }

        if(!data){
            return next(new ErrorHandler('Internal error',400))
        }
    }
    else if(type == 'activity'){
        data = await TimesNoProd.findOne({activity:id,projector:me, date});
       if(data){
            data.cantHours = cantHours;
            await data.save();
       }
       else{
           data = await TimesNoProd.create({
                activity:id,
                projector:me,
                date,
                cantHours,
                day:fecha.getDate(),
                month:fecha.getMonth(),
                year:fecha.getFullYear()
           });
       }
       
        if(!data){
           return next(new ErrorHandler('Internale error',500))
        }
    }
    else{
        return next(new ErrorHandler('Invalid type',400))
    }

    return res.json({
        status:"success",
        data
    })
})

