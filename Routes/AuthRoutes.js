const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const passport=require('passport')
const User =require('../model/User')
const Plan=require('../model/Plan')




router.post('/signup',(req,res)=>{
    const newUser={username:req.body.username,name:req.body.name,referee:req.body.referee}
    const userPassword=req.body.password
    console.log(1)

    User.register(new User(newUser),req.body.password,(err,user)=>{
         if(err){ 
             res.json({error:true});}
                console.log(err)
         passport.authenticate("local")(req,res,()=>{
              res.json({auth:true,user:req.user});
         })
     })


})

router.post('/signin',passport.authenticate('local'),(req,res)=>{
    User.findOne({username:req.user.username},(err,user)=>{
        if(err){console.log(err)}
        else{
            if(user.plan.length>0){
                const today=Date.now()
                const matureDate=user.plan[0].matureDate
                
                if(user.claimed==true && today>=user.nextday){
                    user.claimed=false
                    user.save(()=>{
                        res.json({auth:true,user:user})
                    })
                }
                else{
                    res.json({auth:true,user:user})
                }
            }else{
                 res.json({auth:true,user:user});

            }
        }
        
    })
})




router.post('/reset',async (req,res)=>{
    console.log(1)
    User.findOne({username:req.body.username},(err,founduser)=>{
        if(err||founduser===null){ res.json({success:false});}
        else{
            if(req.body.secret===founduser.secret){
                founduser.setPassword(req.body.password,(err)=>{
                    if(err){ res.json({succcess:false});}
                    else{
                        founduser.save()
                         res.json({success:true});
                    }
                })
            }
            else{
                 res.json({success:false});
            }
        }
    })
})


module.exports = router  