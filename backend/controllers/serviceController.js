const Services = require('../models/services');
const Projector = require('../models/projector');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const asyncForEach = require('../utils/asyncForEach')

// get project  => /api/v1/department
exports.get = catchAsyncErrors(async (req,res,next) =>{
    let all = await Services.find({finalDateR:null,deletedAt:null})
        .populate('project')
        .populate('projectManager')
        .populate({path:'team',populate:{path:'projector'}});
    
    res.json({
        status:"success",
        count: all.length,
        data: all
    })
})
// get all project  => /api/v1/department
exports.all = catchAsyncErrors(async (req,res,next) =>{
    let all = await Services.find() 
        .populate('project')
        .populate('projectManager');
    
    res.json({
        status:"success",
        count: all.length,
        data: all
    })
})

// get find project  => /api/v1/department
exports.find = catchAsyncErrors(async (req,res,next) =>{
    let data = await Services.findById(req.params.id);

     if(!data)
        return next(new ErrorHandler('Service not found',404)) 

    res.json({
        status:"success",
        data
    })
})

// post insert a activities  => /api/v1/department
exports.store = catchAsyncErrors(async (req,res,next) =>{
    const data = await Services.create(req.body);
    
    res.json({
        status:"success",
        data: data
    })
})
// put insert a activities  => /api/v1/department
exports.store = catchAsyncErrors(async (req,res,next) =>{
    const data = await Services.create(req.body);
    
    res.json({
        status:"success",
        data: data
    })
})
// put update a activities  => /api/v1/department/:id
exports.update = catchAsyncErrors(async (req,res,next) =>{
    let data = await Services.findById(req.params.id);
    
    if(!data)
        return next(new ErrorHandler('Service not found',404)) 
    
    data = await Services.findByIdAndUpdate(req.params.id,req.body,{
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
    let data = await Services.findById(req.params.id);
    
    if(!data)
        return next(new ErrorHandler('Service not found',404)) 
    
    data = await Services.findByIdAndUpdate(req.params.id,{
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
// put add projector to team  => /api/v1/service/:id/team
exports.setProjectors = catchAsyncErrors(async (req,res,next) =>{
   let service = await Services.findById(req.params.id);
    if(!service)
        return next(new ErrorHandler('Service not found',404)) 
    
    const {team} = req.body;

    await asyncForEach(team,async(item)=>{
        const p = await Projector.findById(item);
        if(p){
            if(!service.team.find(it=>it==item))
                service.team.push(item);
        }

    })
    team.forEach( async (item)=>{
    });
    
    await service.save();

    res.json({
        status:"success",
        data:service
    })
})
// delete remove projector to team  => /api/v1/service/:id/team
exports.removeProjectors = catchAsyncErrors(async (req,res,next) =>{
    let service = await Services.findById(req.params.id);
    if(!service)
        return next(new ErrorHandler('Service not found',404)) 
    
    const {team} = req.body;
    // data = await Services.findByIdAndUpdate(req.params.id,{
    //     deletedAt:Date.now()
    // },{
    //     new:true,
    //     runValidators:true,
    //     useFindAndModify: false
    // });

    res.json({
        status:"success",
        data:team
    })
})

