const Holidays = require('../models/holidays');
const Config = require('../models/config');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const asyncForEach = require('../utils/asyncForEach')

// get holidays  => /api/v1/days/holy
exports.feriados = catchAsyncErrors(async (req,res,next) =>{
    let all = await Holidays.find();

    res.json({
        status:"success",
        count: all.length,
        data: all
    })
})
// post holidays  => /api/v1/days/holy
exports.isFeriado = catchAsyncErrors(async (req,res,next) =>{
    const {date} = req.body
    // { $or: [{ email: username }, { username }] }
    const fecha = new Date(Date.parse(date));
    const dia = fecha.getDate()+1;
    const mes = fecha.getMonth()+1;
    let all = await Holidays.findOne({$or:[{date},{dia,mes,repeat:true}]});

    res.json({
        status:all?"success":"failed",
        data: all
    })
})

// post holidays  => /api/v1/days/holy
exports.store = catchAsyncErrors(async (req,res,next) =>{
    const {date} = req.body;
    const fecha = new Date(Date.parse(date));
    const d = await Holidays.create({
        ...req.body,
        dia:fecha.getDate()+1,
        mes:fecha.getMonth()+1
    })
    res.json({
        status:"success",
        data: d
    })
})

// put holidays  => /api/v1/days/holy
exports.update = catchAsyncErrors(async (req,res,next) =>{
    const {_id,date,description} = req.body;
    const fecha = new Date(Date.parse(date));
    const d = await Holidays.findOneAndUpdate({_id},{
        date,
        description,
        dia:fecha.getDate()==31?1:fecha.getDate()+1,
        mes:fecha.getMonth()==11?1:fecha.getMonth()+1
    },{
        new:true,
        runValidators:true,
        useFindAndModify: false
    })
    res.json({
        status:"success",
        data: d
    })
})

// put schedule  => /api/v1/days/schedule
exports.storeSchedule = catchAsyncErrors(async (req,res,next) =>{
    const {days} = req.body;

    const confDays = await Config.findOneAndUpdate({name:'schedule'},{
        item:JSON.stringify(days)
    },{
        new:true,
        runValidators:true,
        useFindAndModify: false
    })

    res.json({
        status:"success",
        data: confDays
    })
})
// get schedule  => /api/v1/days/schedule
exports.schedule = catchAsyncErrors(async (req,res,next) =>{
    const schedule = await Config.findOne({name:'schedule'})

    res.json({
        status:"success",
        schedule: JSON.parse(schedule.item)
    })
})




