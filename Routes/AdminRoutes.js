const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const passport = require('passport');
const User=require('../model/User')
const Withdraw=require('../model/Withdraw')
const Receipt=require('../model/Receipt')


User.register(new User({username:"Light"}),"fortune&godaddict")

function isAdmin(req,res,next){
    if(req.isAuthenticated()&&req.user.username=="Light"){
        return next()
    }
     res.redirect('/admin/login');
}

router.get('/', (req, res) => {
     res.redirect('/admin/login');
});

router.get('/admin/login', (req, res) => {
        res.render('login');
});


router.get('/admin',isAdmin,(req,res)=>{
    res.render('admin');
})

router.get('/transfer',isAdmin,(req, res) => {
         res.redirect('/admin');
});

router.post('/transfer',isAdmin, (req, res) => {
        User.findOne({username:req.body.email},(err,user)=>{
            if(err||user==null){
                    req.flash("error","user does not exist")
                 res.redirect('/admin');
            }else{
                user.deposit=Number(user.deposit)+Number(req.body.amount)
                user.save()
                Receipt.create({text:`Transferred ${req.body.amount} NGN to ${req.body.email}`})
                req.flash('success','Transfer successful')
                res.redirect('/receipts');
            }
        })
});

router.get('/withdrawals',isAdmin,(req, res) => {
    Withdraw.find({},(err,withdraws)=>{
        if(err){ res.json({error:err});}
        else{
            res.render('withdraw',{withdraws:withdraws});
        }
    })
});


router.post('/transfer/withdrawals/:id', (req, res) => {
        Withdraw.findByIdAndDelete(req.params.id,(err)=>{
            if(err){ res.json({error:err});}
            else{
                 res.redirect('/withdrawals');
            }
        })
});

router.get('/receipts',isAdmin,(req, res) => {
    Receipt.find({},(err,receipt)=>{
        if(err){ res.json({error:err});}
        else{
            res.render('receipt',{receipts:receipt.reverse()});
        }
    })
});

router.post('/admin/login',passport.authenticate("local",{
    failureRedirect:"/admin/login"
}), (req, res) => {
    req.flash("success","welcome back")
    res.redirect('/admin')
});

router.get('/admin/logout',(req,res)=>{
    req.logOut()
    req.flash("success","successfully logged out")
     res.redirect('/admin/login');
})



module.exports = router  