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

    const allAct = await Activity.find({deletedAt:null});
    const allServices = await Services.find({finalDateR:null,deletedAt:null, team:_id});
    // services
    const services = await Ct.find({projector:_id,date});
   
    const noProd = await TimesNoProd.find({projector:_id,date});

    let all = [];
    allAct.forEach(item => {
        let time = noProd.find(act=>act.activity==''+item._id+'');
        time = time?time.cantHours:0
        all.push({type:'activity',id:item._id,name:item.name, time, editable:item.editable})
    });
    allServices.forEach(item => {
        let time = services.find(act=>act.service._id==''+item._id+'');
        time = time?time.cantHours:0
        all.push({type:'service',id:item._id,name:item.name,code:item.code, time})
    });

    return res.json({
        status:"success",
        count: services.length+noProd.length,
        services,
        activities:noProd,
        all:all
    })
})

// put update/store ct  => /api/v1/department
exports.store = catchAsyncErrors(async (req,res,next) =>{
    const me = req.user.projector._id;
    const {id,type,cantHours,date} = req.body

    if(!id || !type || cantHours < 0 || !date)
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

// post get times in the month  => /api/v1/times
exports.times = catchAsyncErrors(async (req,res,next) =>{
    const {filter,id,month,year} = req.body;
    let all;
    if(filter == 'service'){
        let serv = await Services.findById(id).populate({path:'team',populate:{path:'projector'}});;
        all = serv.team;
    }else if(filter == 'department'){
        all = await Projector.find({department:id});
    }

    let times=[];

    await asyncForEach(all,async (item) => {
        let prod;
        if(filter == 'service')
            prod = await Ct.find({month:month-1,year,service:id,projector:item._id});
        else
            prod = await Ct.find({month:month-1,year,projector:item._id});
        const noprod = await TimesNoProd.find({month:month-1,year,projector:item._id});
        await times.push({
            projector:item,
            productives: await prod.reduce((sum,it)=>{return sum+=it.cantHours},0),
            noProductives: await noprod.reduce((sum,it)=>{return sum+=it.cantHours},0)
        });
    });


    return res.json({
        status:"success",
        times
    })
})

// post get my ct  => /api/v1/department
exports.getadmin = catchAsyncErrors(async (req,res,next) =>{
    const { date, id } = req.body

   const allAct = await Activity.find({deletedAt:null});
   const allServices = await Services.find({finalDateR:null,deletedAt:null, team:id});
   // services
   const services = await Ct.find({projector:id,date});
  
   const noProd = await TimesNoProd.find({projector:id,date});

   let all = [];
   allAct.forEach(item => {
       let time = noProd.find(act=>act.activity==''+item._id+'');
       time = time?time.cantHours:0
       all.push({type:'activity',id:item._id,name:item.name, time, editable:item.editable})
   });
   allServices.forEach(item => {
       let time = services.find(act=>act.service._id==''+item._id+'');
       time = time?time.cantHours:0
       all.push({type:'service',id:item._id,name:item.name,code:item.code, time})
   });

   return res.json({
       status:"success",
       count: services.length+noProd.length,
       services,
       activities:noProd,
       all:all
   })
})

// put update/store ct  => /api/v1/department
exports.storeadmin = catchAsyncErrors(async (req,res,next) =>{
   const {me,id,type,cantHours,date} = req.body

   if(!id || !type || cantHours < 0 || !date)
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