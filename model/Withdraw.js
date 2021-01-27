const mongoose = require('mongoose')

const withdrawSchema=mongoose.Schema({
    accountName:String,
    amount:Number,
    accountNumber:String,
    bank:String,
    user:String
})


module.exports=mongoose.model('Withdraw',withdrawSchema)