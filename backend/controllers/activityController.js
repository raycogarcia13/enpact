const Activity = require('../models/activities');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const asyncForEach = require('../utils/asyncForEach')

// get activities  => /api/v1/department
exports.get = catchAsyncErrors(async (req,res,next) =>{
    let all = await Activity.find({deletedAt:null});
    res.json({
        status:"success",
        count: all.length,
        data: all
    })
})
// get all activities  => /api/v1/department
exports.all = catchAsyncErrors(async (req,res,next) =>{
    let all = await Activity.find();
    res.json({
        status:"success",
        count: all.length,
        data: all
    })
})

// post insert a activities  => /api/v1/department
exports.store = catchAsyncErrors(async (req,res,next) =>{
    const data = await Activity.create(req.body);
    
    res.json({
        status:"success",
        data: data
    })
})
// put update a activities  => /api/v1/department/:id
exports.update = catchAsyncErrors(async (req,res,next) =>{
    let data = await Activity.findById(req.params.id);
    
    if(!data)
        return next(new ErrorHandler('Activity not found',404)) 
    
    data = await Activity.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify: false
    });

    res.json({
        status:"success",
        data
    })
})
// delet delete a activities  => /api/v1/department/:id
exports.remove = catchAsyncErrors(async (req,res,next) =>{
    let data = await Activity.findById(req.params.id);
    
    if(!data)
        return next(new ErrorHandler('Activity not found',404)) 
    
    data = await Activity.findByIdAndUpdate(req.params.id,{
        deletedAt:Date.now()
    },{
        new:true,
        runValidators:true,
        useFindAndModify: false
    });

    res.json({
        status:"success",
        data
    })
})

