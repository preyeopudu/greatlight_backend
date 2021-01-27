const express = require('express');
const bodyParser=require('body-parser')
const passport=require('passport')
const flash=require('connect-flash')
const LocalStrategy=require('passport-local')
const passportLocalMongoose=require('passport-local-mongoose')

const app=express()

const mongoose=require('mongoose')

const uri='mongodb+srv://opudupreye:programmer8@cluster0.lzrhg.mongodb.net/<greatlight>?retryWrites=true&w=majority'




// const uri= 'mongodb://localhost:27017/greatlight'

mongoose.connect(uri, {useNewUrlParser: true,useUnifiedTopology: true})
.then(() => {
  console.log('MongoDB Conected…')
})
.catch(err => console.log(err))


const authRoutes=require('./Routes/AuthRoutes')
const userRoutes=require('./Routes/UserRoutes')
const planRoutes=require('./Routes/planRoutes')
const adminRoutes=require('./Routes/AdminRoutes')

const User=require('./model/User')
app.set('view engine', 'ejs');
app.use(flash())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(require('express-session')({
    secret:"Billion Traderx",
    resave:false,
    saveUninitialized:false
}))
app.use(bodyParser.json());
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
  res.locals.error=req.flash("error")
  res.locals.success=req.flash('success')
  next()
})

app.use(adminRoutes)
app.use(authRoutes)
app.use(userRoutes)
app.use(planRoutes)





// User.remove({},(err)=>{
//   if(err){console.log(err)}
//   else{
//     console.log("All users deleted")
//   }
// })








let port=process.env.PORT||5000
app.listen(port,process.env.IP, () => {
    console.log(`Server started on port ${port}`);
});