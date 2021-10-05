const Projector = require('../models/projector');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const asyncForEach = require('../utils/asyncForEach')

// Get All Projector  => /api/v1/projector
exports.all = catchAsyncErrors(async (req,res,next) =>{
    let all = await Projector.find().
        populate('department');
    res.json({
        status:"success",
        count: all.length,
        data: all
    })
})

// get find a projector  => /api/v1/projector/:id
exports.find = catchAsyncErrors(async (req,res,next) =>{
    const {id} = req.params; 
    if(!id)
        return next(new ErrorHandler('id is required',404))
        
        const projector = await Projector.findById(id)
            .populate('Department');
    if(!projector)
        return next(new ErrorHandler('not found',404))

    res.json({
        status:"success",
        data: projector
    })
})

//get getByDepartment => /api/v1/projector/department/:id
exports.getByDepartment =  catchAsyncErrors(async (req,res,next) =>{

    const {id} = req.params;
    if(!id)
    return next(new ErrorHandler('id is required',404))
    
    const all = await Projector.find({department:id})
        .populate('department');
    
    res.json({
        status:"success",
        count: all.length,
        data: all
    })
})

// put set department => /api/v1/projector/:id/department
exports.setDpto =  catchAsyncErrors(async (req,res,next) =>{
    let data = await Projector.findById(req.params.id);
    
    if(!data)
        return next(new ErrorHandler('Projector not found',404)) 
        
    const {department} = req.body;
    if(!department)
        return next(new ErrorHandler('department is required',404))
    
    data = await Projector.findByIdAndUpdate(req.params.id,{department},{
        new:true,
        runValidators:true,
        useFindAndModify: false
    });

    res.json({
        status:"success",
        data
    })
})
