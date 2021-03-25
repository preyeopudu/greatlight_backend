const mongoose = require('mongoose')
const passportLocalMongoose=require('passport-local-mongoose')
const Plan =require('./Plan')
const Receipt=require('../model/Receipt')

const userSchema=new mongoose.Schema({
    username:String,
    name:String,
    referee:String,
    bonus:{type:Boolean,default:false},
    plan:[Plan.schema],
    referalAmount:{type:Number,default:0},
    referal:{type:Number,default:0},
    secret:String,
    Amount:{type:Number,default:0},
    deposit:{type:Number,default:0},
    nextday:Date,
    notice:{type:Boolean,default:true},
    active:{type:Boolean,default:false},
    claimed:{type:Boolean,default:false},
    receipt:[Receipt.schema]
    ///for admin
})


userSchema.plugin(passportLocalMongoose)
module.exports =mongoose.model("User",userSchema)