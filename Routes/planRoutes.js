const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const User =require('../model/User')
const Plan=require('../model/Plan')

router.post('/:user/plan/:plan', (req, res) => {
    planName=req.params.plan
    let bonus
    let plan
    if(planName=="emerald"){
        plan={name:"EMERALD",cost:15000,daily:750,matureDate:Date.now()+29*24*60*60*1000}
        bonus=750
    }
    else if(planName=='ruby'){
        plan={name:"RUBY",cost:30000,daily:1500,matureDate:Date.now()+29*24*60*60*1000}
        bonus=1500
    }
    else if(planName=="sapphire"){
        plan={name:"SAPPHIRE",cost:60000,daily:3000,matureDate:Date.now()+29*24*60*60*1000}
        bonus=3000
    }
    else if(planName=="onyx"){
        plan={name:"ONYX",cost:120000,daily:6000,matureDate:Date.now()+29*24*60*60*1000}
        bonus=6000
    }
    else if(planName=="chrysolite"){
        plan={name:"CHRYSOLITE",cost:240000,daily:12000,matureDate:Date.now()+29*24*60*60*1000}
        bonus=12000
    }
    else if(planName=="agate"){
        plan={name:"AGATE",cost:480000,daily:24000,matureDate:Date.now()+29*24*60*60*1000}
        bonus=24000
    }
    else if(planName=="amethyst"){
        plan={name:"AMETHYST",cost:960000,daily:48000,matureDate:Date.now()+29*24*60*60*1000}
        bonus=48000
    }
    
    User.findOne({username:req.params.user},(err,user)=>{
        if(err ||user==null){console.log(err)}
        else{
            if(user.plan.length>0){ res.json({active:true});}
            else if(user.plan.length==0){
                if(user.Amount>=plan.cost||user.deposit>=plan.cost){
                    Plan.create(plan,(err,plan)=>{
                        if(user.deposit>=plan.cost){
                            user.deposit=Number(user.deposit)-plan.cost
                        }else if(user.Amount>=plan.cost){
                            user.Amount=Number(user.Amount)-plan.cost
                        }
                        if(user.bonus==false){
                            User.findOne({username:user.referee},(err,foundrefree)=>{
                                if(err||foundrefree==null){
                                    user.nextday=Date.now()
                                    user.plan.push(plan)
                                    user.active=true
                                    user.bonus=true
                                    user.save(()=>{res.json({user})})
                                }
                                else{
                                    if(user.username!=foundrefree.username){
                                        foundrefree.deposit=Number(foundrefree.deposit)+Number(bonus)
                                        foundrefree.referalAmount=Number(foundrefree.referalAmount)+Number(bonus)
                                        foundrefree.referal=Number(foundrefree.referal)+1
                                        foundrefree.save()

                                        user.nextday=Date.now()
                                        user.active=true
                                        user.bonus=true
                                        user.plan.push(plan)
                                        user.save(()=>{res.json({user})})
                                    }
                                }
                            })
                        }else{
                            user.bonus=true
                            user.active=true
                            user.plan.push(plan)
                            user.save(()=>{res.json({user})})
                        }
                    })
                }
                else{
                    res.json({insufficient:true})
                }
            }
        }
    })
});






module.exports = router  