//connection
const mongoose=require('mongoose')
const validator=require('validator')
mongoose.connect(process.env.MONGODB_URL,{
// useNewUrlParser:true,
// useCreateIndex:true
})

















// //new object for user
// const me=new User({
//     name: ' Ravi na',
//     // age:21
//     email:"Xyz@gmail.com",
//     password:"abc123!@#"
// })

// const task=new Task({
//     description:'Learn mongoose library',
//     completed:false
// })

// // saving to database use methods
// me.save().then(()=>{
// console.log(me)
// }).catch((err)=>{
// console.log('Error',err)
// })


// //tasks
// task.save().then(()=>{
//     console.log(task)
//     }).catch((err)=>{
//     console.log('Error',err)
//     })