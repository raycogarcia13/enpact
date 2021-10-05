const Project = require('../models/project');
const Services = require('../models/services');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const asyncForEach = require('../utils/asyncForEach')

// get project  => /api/v1/department
exports.get = catchAsyncErrors(async (req,res,next) =>{
    let all = await Project.find({finalDateR:null,deletedAt:null});
    let todos=[];
    await asyncForEach(all, async (item,i,arr)=>{
       const t = await Services.find({project:item._id});
       todos.push({...item._doc,services:t})
    })

    res.json({
        status:"success",
        count: all.length,
        data: todos
    })
})
// get all project  => /api/v1/department
exports.all = catchAsyncErrors(async (req,res,next) =>{
    let all = await Project.find();
    let todos=[];
    await asyncForEach(all, async (item,i,arr)=>{
       const t = await Services.find({project:item._id});
       todos.push({...item._doc,services:t})
    })

    res.json({
        status:"success",
        count: all.length,
        data: todos
    })
})

// get find project  => /api/v1/department
exports.find = catchAsyncErrors(async (req,res,next) =>{
    let data = await Project.findById(req.params.id);

     if(!data)
        return next(new ErrorHandler('Project not found',404)) 

    res.json({
        status:"success",
        data
    })
})

// post insert a activities  => /api/v1/department
exports.store = catchAsyncErrors(async (req,res,next) =>{
    const data = await Project.create(req.body);
    
    res.json({
        status:"success",
        data: data
    })
})
// put update a activities  => /api/v1/department/:id
exports.update = catchAsyncErrors(async (req,res,next) =>{
    let data = await Project.findById(req.params.id);
    
    if(!data)
        return next(new ErrorHandler('Project not found',404)) 
    
    data = await Project.findByIdAndUpdate(req.params.id,req.body,{
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
    let data = await Project.findById(req.params.id);
    
    if(!data)
        return next(new ErrorHandler('Activity not found',404)) 
    
    data = await Project.findByIdAndUpdate(req.params.id,{
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

