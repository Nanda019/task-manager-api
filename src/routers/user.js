const express=require('express')
const User=require('../models/user')
const router=new express.Router()
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp = require('sharp')


router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token=await user.generateAuthTokens()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findbycredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        // console.log(user)
        // const str="Hello "+user.name+ ". Have a great day"
        // res.send({user:user.getPublicProfile(),token}).status(200)  // getPublicProfile() => //to show users only the required informations (eg. hiding password)
        res.send({user:user,token:token})
        // res.send("Hello ",user.name)
    }
    catch(e){
        res.status(400).send(e)
    }

})


router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

//for using the auth.js for a individual router, give that function inside the router function
//this route handler will run only when the next() in called in auth.js
// router.get('/users',auth, async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.status(201).send(users)
//     } catch (e) {
//         res.status(500).send()
//     }
    
// })

//read profile the above .get() method prints all the user's details but below .get() method only prints the particular user details
router.get('/users/me',auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

// //update

// router.patch('/users/:id', auth , async (req, res) => {
//     const updates = Object.keys(req.body)
//     console.log(req.body)
//     console.log(updates)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => {
//         return allowedUpdates.includes(update)
//     })

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         // some advanced funstions bypasses mongoose middleware so to avoid this use normal functions

//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

//         //so instead of above code use below code

//         const user = await User.findById(req.user.id) //no need for authenticated users
//         console.log(user)
//         updates.forEach((update)=>{
//             console.log(update)
//             req.user[update]=req.body[update]
//         })
//         await user.save()

//         if (!user) { 
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })



//update
//update using authentication
router.patch('/users/me', auth , async (req, res) => {
    const updates = Object.keys(req.body)
    console.log(req.body)
    console.log(updates)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // some advanced funstions bypasses mongoose middleware so to avoid this use normal functions

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        //so instead of above code use below code

        updates.forEach((update)=>{
            console.log(update)
            req.user[update]=req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.delete('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

//delete using authentication
router.delete('/users/me', auth,async (req, res) => {
    try {
        await req.user.remove()

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

//for uploading profile picture
const upload=multer({
    // dest:'propics',
    limits:{
        fileSize:1000000    //max. 1MB
    },
    fileFilter(req,file,cb)     //cb is callback function
    {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return cb(new Error('please upload a jpg, jpeg or png files only'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/propic',auth,upload.single('propic'),async (req,res)=>{
    const buffer=await sharp(req.file.buffer).png().resize({width:250,height:250}).toBuffer()
    // req.user.propic=req.file.buffer     //it saves the binary value of that image to the user database
    req.user.propic=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/propic',auth,upload.single('propic'),async(req,res)=>{
    req.user.propic=undefined
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


//to get profile picture of a user
router.get('/users/:id/propic',async(req,res)=>{
    try{
        const user =await User.findById(req.params.id)
        if(!user || !user.propic)
        {
            throw new Error()
        }
        res.set('Content-Type','image/png')     //default express will set this as res.set('Content-type','application/json') 
        res.send(user.propic)
    }
    catch(e){
        res.status(404).send()
    }
})


module.exports=router