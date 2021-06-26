const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const User =require('../model/User')
const Plan=require('../model/Plan')
const Withdraw=require('../model/Withdraw')
const Receipt=require('../model/Receipt')
const Notification=require('../model/Notification')
const Crypto=require('../model/crypto')

router.get('/user/:user', (req, res) => {
    User.findOne({username:req.params.user},(err,user)=>{
        if(err||user==null){ res.json(err);}
        else{
            if(user.plan.length>0){
                const today=new Date()
                if(user.claimed==true&&today>=user.nextday){
                    user.claimed=false
                    user.save(()=>{
                         res.json({user:user});
                    })
                }
                else{
                     res.json({user:user});
                }

            }else{
                res.json({user:user});
            }
             
        }
    })
});


router.post('/:user/secret', (req, res) => {
        const secret=req.body.secretuser
        User.findOne({username:req.params.user},(err,user)=>{
            if(err){
                 res.json({success:false});
            }else{
                 user.secret=req.body.secretuser
                 user.save((err)=>{
                     if(err){
                        res.json({success:false})
                     }
                     else{
                         console.log(user.secret)
                        res.json({success:true,user:user})
                        
                     }
                 })
            }
        })
});


router.post('/:user/claim', (req, res) => {
         
    User.findOne({username:req.params.user},(err,user)=>{
        if(err){
             res.json({success:false});
        }else{
            const today=new Date()
            const matureDate=user.plan[0].matureDate
             user.Amount=Number(user.plan[0].daily)+Number(user.Amount)
             user.nextday=Date.now()+24*60*60*1000
            
             if(new Date()>=matureDate){
                 Plan.findByIdAndDelete(user.plan[0]._id,(err)=>{
                     if(err){console.log(err)}
                     else{
                         console.log(matureDate)
                         console.log(new Date())
                         user.plan.pop()
                         user.active=false
                         user.nextday=null
                         user.save(()=>{
                              res.json({user:user});
                         })
                     }
                 })
             }

             else{
                 user.claimed=true
                 user.save((err)=>{
                     if(err){console.log(err)}
                     else{ res.json({user:user});}
                 })
                 
             }
        }
        
    })
});


router.post('/:user/crypto', (req, res) => {
    const userFiat={
        wallet:req.body.wallet,
        amount:req.body.amount,
    }
    const amount=Number(req.body.amount)

    User.findOne({username:req.params.user},(err,user)=>{
        if(err||user==null){console.log(err)}

        else{
            if(user.plan.length>0){
                 res.json({active:true});
            }
            else{
                if(user.Amount<userFiat.amount){
                    res.json({insufficient:true});
               }
               else if(user.Amount>=userFiat.amount){
                   user.Amount=Number(user.Amount)-Number(amount)
                   
                   
                   user.save((err)=>{
                       if(err){
                           console.log(err)
                       }
                       else{
                           Crypto.create(userFiat,(err,withdraw)=>{})
                            res.json({user:user});
                       }
                   })
                   
               }
            }
        }
    })
});


router.post('/:user/withdraw', (req, res) => {
    const userFiat={
        accountName:req.body.accountName,
        amount:req.body.amount,
        accountNumber:req.body.accountNumber,
        bank:req.body.bank,
        user:req.params.user
    }
    const amount=Number(req.body.amount)

    User.findOne({username:req.params.user},(err,user)=>{
        if(err||user==null){console.log(err)}

        else{
            if(user.plan.length>0){
                 res.json({active:true});
            }
            else{
                if(user.Amount<userFiat.amount){
                    res.json({insufficient:true});
               }
               else if(user.Amount>=userFiat.amount){
                   user.Amount=Number(user.Amount)-Number(amount)
                   
                   
                   user.save((err)=>{
                       if(err){
                           console.log(err)
                       }
                       else{
                           Withdraw.create(userFiat,(err,withdraw)=>{})
                            res.json({user:user});
                       }
                   })
                   
               }
            }
        }
    })
});

router.post('/:user/transfer',(req,res)=>{
    const amount=req.body.amount
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user==null){ res.json({err:"user does not exist"});}
        else{
            User.findOne({username:req.body.user},(err,recipient)=>{
                if(err||recipient==null||req.params.user==req.body.user){res.json({userFalse:true})}
                else{
                    if(user.deposit>=amount||user.Amount>=amount){
                        if(user.deposit>=amount ){
                            Receipt.create({text:`${user.name} transferred ${amount} NGN to you.`},(err,recipientReceipt)=>{
                                 if(user.deposit>=amount){
                                    Receipt.create({text:`you transferred ${amount} NGN to ${recipient.name}.`},(err,userReceipt)=>{
                                        user.receipt.push(userReceipt)
                                        user.deposit=Number(user.deposit)-Number(amount)
                                        user.ip=req.headers['x-forwarded-for']
                                        user.save(()=>{
                                            res.json({success:true,user})
                                            recipient.receipt.push(recipientReceipt)
                                            recipient.deposit=Number(recipient.deposit)+Number(amount)
                                            recipient.save()
                                        })
                                    })
                                }
                            })
                            
                        }else if(user.Amount>=amount){
                            Receipt.create({text:`${user.name} transferred ${amount} NGN to you.`},(err,recipientReceipt)=>{
                                if(user.deposit>=amount){
                                   Receipt.create({text:`you transferred ${amount} NGN to ${recipient.name}.`},(err,userReceipt)=>{
                                       user.receipt.push(userReceipt)
                                       user.deposit=Number(user.Amount)-Number(amount)
                                       user.ip=req.headers['x-forwarded-for']
                                       user.save(()=>{
                                           res.json({success:true,user})
                                           recipient.receipt.push(recipientReceipt)
                                           recipient.deposit=Number(recipient.deposit)+Number(amount)
                                           recipient.save()
                                       })
                                   })
                               }
                           })
                        }
                    }
                   else{ res.json({success:false});}
                }
            })
        }
    }) 
})

router.get('/notifications', (req, res) => {
    Notification.find({},(err,allNotifications)=>{
        if(err){ console.log(err)}
        else{
            res.json({notifications:allNotifications});
        }
         
    })
});


router.post('/:user/notify', (req, res) => {
    User.findOne({username:req.params.user},(err,user)=>{
        user.notice=false
        user.save(()=>{
            if(err){
                console.log(err);
            }else{
                res.json(user);
            }
             
        })
    })
});


// Notification.remove({},()=>{
//     console.log('removed')
// })

module.exports = router  