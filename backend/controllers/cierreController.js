const Times = require('../models/ct');
const TimesNoProd = require('../models/timesNoProd');
const Projector = require('../models/projector');
const Month = require('../models/month');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const asyncForEach = require('../utils/asyncForEach')

const {countHourMonth} = require('../utils/dateLib')

// post get my ct  => /api/v1/month
exports.openMonth = catchAsyncErrors(async (req,res,next) =>{

    const {month,year} = req.body

    const all = await Month.find({
        status:'open'
    })
    
    if(all.length>0)
        return next(new ErrorHandler(`monyt opened ${all.lenth}`,403))
        
    if(!month || !year)
        return next(new ErrorHandler('missing parameters',401))


    const newed = await Month.create({
        month,
        year
    }) 
    

    return res.json({
        status:"success",
        data:newed
    })
    
})

// put get my ct  => /api/v1/month
exports.readyClose = catchAsyncErrors(async (req,res,next) =>{

    const {month,year} = req.params

    const cierre = await Month.findOne({
        month,
        year,
        status:'open'
    });

    if(!cierre)
        return next(new ErrorHandler('El mes no existe o no esá abierto',302))

    
    const services = await Times.find({
        month,
        year
    }).populate({path:'service'});
    
    const times = await TimesNoProd.find({
        month,
        year
    }).populate({path:'activity'});
    

    const projector = await Projector.find()
    .populate({path:'department'});
    
    let all=[];

    await asyncForEach(projector,async ( item )=>{
        const ser = services.filter(ser=>ser.projector == ''+item._id);
        
        const serOr = [];
        await asyncForEach(ser, async (item)=>{
            const k = serOr.findIndex(it=>it._id == ''+item.service._id)
            if(k!=-1){
                serOr[k].times.push({
                    id:item._id,
                    cantHours:item.cantHours,
                    date:item.date,
                    day:item.day,
                    month:item.month,
                    year:item.year
                })
            }else{
                let newed = {
                    ...item.service._doc,
                    times:[]
                }

                newed.times.push({
                    id:item._id,
                    cantHours:item.cantHours,
                    date:item.date,
                    day:item.day,
                    month:item.month,
                    year:item.year
                })

                serOr.push(newed);
            }
        })

        const mynt = times.filter(ser=>ser.projector._id == ''+item._id);
        const noProdt = mynt.reduce((sum,it)=>{
            if(it.activity.rating)
            return sum+it.cantHours
            return sum+0;
        },0)
        const actOr = [];
        await asyncForEach(mynt, async (item)=>{
            const k = actOr.findIndex(it=>it._id == ''+item.activity._id)
            if(k!=-1){
                actOr[k].times.push({
                    id:item._id,
                    cantHours:item.cantHours,
                    date:item.date,
                    day:item.day,
                    month:item.month,
                    year:item.year
                })
            }else{
                let newed = {
                    ...item.activity._doc,
                    times:[]
                }

                newed.times.push({
                    id:item._id,
                    cantHours:item.cantHours,
                    date:item.date,
                    day:item.day,
                    month:item.month,
                    year:item.year
                })

                actOr.push(newed);
            }
        })
        
        let p ={
            id:item._id,
            name:item.name,
            department:item.department,
            activities: actOr,
            actRating: noProdt,
            actTotal: mynt.reduce((sum,it)=>{return sum+it.cantHours},0),
            services: serOr,
            servTotal: ser.reduce((sum,it)=>{return sum+it.cantHours},0),
        }
        all.push(p);
    })

    let daysMonth = countHourMonth(month,year);

    return res.json({
        status:"success",
        data:all
    })
    
})

// put get my ct  => /api/v1/month
exports.closeMonth = catchAsyncErrors(async (req,res,next) =>{

    const {month,year }  = req.params
    const {prodbruta, prodmerca}  = req.body

    const cierre = await Month.findOne({
        month,
        year,
        status:'open'
    });

    if(!cierre)
        return next(new ErrorHandler('El mes no existe o no esá abierto',302))
    
    const services = await Times.find({
        month,
        year
    }).populate({path:'service'});
    
    const times = await TimesNoProd.find({
        month,
        year
    }).populate({path:'activity'});
    

    const projector = await Projector.find()
    .populate({path:'department'});
    
    let all=[];

    await asyncForEach(projector,async ( item )=>{
        const ser = services.filter(ser=>ser.projector == ''+item._id);
        
        let serOr = [];
        await asyncForEach(ser, async (item)=>{
            const k = serOr.findIndex(it=>it.service == ''+item.service._id)
            if(k!=-1){
                serOr[k].time += item.cantHours
            }else{
                let newed = {
                    service:item.service._id,
                    time:item.cantHours
                }
                serOr.push(newed);
            }
        })

        const suma = serOr.reduce((sum,it)=>{return sum+=it.time},0);

        let mynt = times.filter(ser=>(ser.projector == ''+item._id ) && ser.activity.rating);
        
        await asyncForEach(serOr, async (item,i,list)=>{
            const percent = (item.time/suma)*100;
            await asyncForEach(mynt, async (act)=>{
                const p = (act.cantHours*percent)/100;
                list[i].time+=p;
            })
        })

        let p ={
            id:item._id,
            name:item.name,
            services: serOr
        }
        all.push(p);
    })

    const final = all.map(it=>{
        return {
            projector: it.id,
            times: it.services
        }
    });


    // let daysMonth = countHourMonth(month,year);

    cierre.prod_bruta = prodbruta;
    cierre.prod_merc = prodmerca;
    cierre.cierre = final;
    cierre.status = 'closed';
    await cierre.save();

    const newMonth = await Month.create({
        month: parseInt(month)+1,
        year,
        status:'open'
    });

    return res.json({
        status:"success",
        mesage:"month closed",
        times: final  
    })
    
})
