const mongoose = require('mongoose')


const planSchema =mongoose.Schema({
    name:String,
    startingDate:{type:Date,default: Date.now()},
    matureDate:Date,
    cost:Number,
    daily:Number,
})


module.exports=mongoose.model("Plan",planSchema)