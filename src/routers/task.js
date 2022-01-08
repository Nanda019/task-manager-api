const express=require('express')
const Task=require('../models/task')
const router=new express.Router()
const auth=require('../middleware/auth')

//create
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task =new Task({
        ...req.body,    //es6 spread operator, to copy all the data which is inside the body to this object
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


//read
// router.get('/tasks', auth, async (req, res) => {
//     try {
//         // const tasks = await Task.find({})

//         // for user authentacation and prevent other users from accessing the data use below code line
//         const tasks=await Task.find({owner:req.user._id})
//         console.log(req.tasks)
//         res.send(tasks)

//         // //or by using populate()
//         // await req.user.populate('mytasks')
//         // console.log(req.user.tasks)
//         // res.send(req.user.tasks)
//     } catch (e) {
//         res.status(500).send()
//     }
// })



//router.get with filter() feature ,  GET?completed=true
router.get('/tasks', auth, async (req, res) => {
    const match={}
    const sort={}

    if(req.query.completed)
    {
        if(req.query.completed==='true'){
            match.completed=true
        }
        else
        {
            match.completed=false
        }
    //    match.completed= req.query.completed==='true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        if(parts[1]==='desc')
        {
            sort[parts[0]]=-1
        }
        else{
            sort[parts[0]]=1
        }
        // sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        console.log("sort ",sort)
    }

    try {
        // const tasks = await Task.find({})

        // for user authentacation and prevent other users from accessing the data use below code line
        // const tasks=await Task.find({owner:req.user._id})
        // console.log(req.tasks)
        // res.send(tasks)

        //or by using populate()
        await req.user.populate({
            path:'mytasks',
            match:match,    // match returns only the corresponding values  (filter)
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),       //GET/tasks?limit=2&skip=1     (Pagination)
                sort:sort                           //GET/tasks?sortBy=createdAt:desc (Sorting)
            }
        })
        console.log(req.user.mytasks)
        res.send(req.user.mytasks)

    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth,async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id)
        //for user authentacation and prevent other users from accessing the data use below code line
        const task=await Task.findOne({_id,owner:req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})


//update
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        //or
        // const task =await Task.findById(req.params.id)

        //with user authentication
        const task =await Task.findOne({_id:req.params.id, owner:req.user._id})
        

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()


        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete
router.delete('/tasks/:id', auth,async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)

        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})


        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports=router