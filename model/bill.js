const mongoose = require('mongoose')

const billSchema=mongoose.Schema({
    text:String,
    date:{type:Date,default:Date.now()}
})

module.exports =mongoose.model("Bill",billSchema)