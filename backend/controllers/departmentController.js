const Department = require('../models/department');
const Leader = require('../models/leaders');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const asyncForEach = require('../utils/asyncForEach')

// get departments  => /api/v1/department
exports.all = catchAsyncErrors(async (req,res,next) =>{
    let all = await Department.find().populate('leader');
    res.json({
        status:"success",
        count: all.length,
        data: all
    })
})

// get find a department  => /api/v1/department/:id
exports.find = catchAsyncErrors(async (req,res,next) =>{
    const {id} = req.params; 
    if(!id)
        return next(new ErrorHandler('id is required',404))
        
        const data = await Department.findById(id);
    
    if(!data)
        return next(new ErrorHandler('not found',404))

    res.json({
        status:"success",
        data
    })
})
// post insert a department  => /api/v1/department
exports.store = catchAsyncErrors(async (req,res,next) =>{
    const dpto = await Department.create(req.body);
    
    res.json({
        status:"success",
        data: dpto
    })
})
// put update a department  => /api/v1/department/:id
exports.update = catchAsyncErrors(async (req,res,next) =>{
    let data = await Department.findById(req.params.id);
    
    if(!data)
        return next(new ErrorHandler('Department not found',404)) 
    
    data = await Department.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify: false
    });

    res.json({
        status:"success",
        data
    })
})

// get get leaders  => /api/v1/leader
exports.getLeader = catchAsyncErrors(async (req,res,next) =>{
    data = await Leader.find();
    res.json({
        status:"success",
        data
    })
})
