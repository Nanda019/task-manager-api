const express = require('express')
require('./db/mongoose')

// const User = require('./models/user')
// const Task = require('./models/task')

const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
const jwt = require('jsonwebtoken')

const app = express()
// const port = process.env.PORT || 3000
const port=process.env.PORT             //dev.env file

// //express middlewares-------------------------------------
// app.use((req,res,next)=>{
//     console.log(req.method)
//     if(req.method==='GET')
//     {
//         res.send('GET requests are disabled')
//     }
//     else{
//         next()
//     }
// })


// //during service maintenance
// app.use((req,res,next)=>{
// res.send('This site is under construction. Come back later')
// })


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// //--------------passwaord-authentication----------------
// const bcrypt=require('bcrypt')
// const myfunc=async()=>{
//     const password="Red123!"
//     const hashedpassword=await bcrypt.hash(password,8)
//     console.log(password)
//     console.log(hashedpassword)
    
//     const ismatch= await bcrypt.compare(password,hashedpassword)
//     console.log(ismatch)
// }
// myfunc()



const Task=require('./models/task')
const User = require('./models/user')
// const main=async()=>{
//     // const task=await Task.findById('61d6f0be06c43f6ecb410f36')
//     // await task.populate('owner') //create a relationship between user and task files
//     // console.log(task.owner)

//     const user=await User.findById('61d6dd5dfba2fbbdd2290c62')
//     await user.populate('mytasks')
//     console.log(user.mytasks)
// }

// main()

const multer=require('multer')

//multer for uploading files (trail)

const upload=multer({
    dest:'images', //folder name
    limits:{
        fileSize:1000000    //max. 1 MB
    },
    fileFilter(req,file,cb)     //cb is a callback function
    { 

        // if(file.originalname.endsWith('.pdf'))   // to upload pdf files only
        if(!file.originalname.match(/\.(doc|docx)$/)) //\.(doc|docx)$ is a regex for uploading .doc/.docx files
        {
            return cb(new Error('please uplaod a .doc (or) .docx file only'))
        }   
        cb(undefined,true)
    }
})
app.post('/upload',upload.single('upload'),(req,res)=>{  //upload.single('upload') is a middleware where 'upload' is a key given in postman (form-data )
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})



app.listen(port,()=>{
console.log("Server up on ",port)
})