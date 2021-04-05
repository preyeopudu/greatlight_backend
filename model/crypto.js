const mongoose = require('mongoose')

const cryptoSchema=mongoose.Schema({
    paymentDate:{type:Date,default: Date.now()},
    amount:Number,
    address:String
})

module.exports=mongoose.model('Crypto',cryptoSchema)