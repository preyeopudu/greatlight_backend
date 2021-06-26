const mongoose = require('mongoose')

const receiptSchema=mongoose.Schema({
    text:String,
    date:{type:Date,default:Date.now()}
})


module.exports =mongoose.model("Receipt",receiptSchema)