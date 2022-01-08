const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const Task=require('./task')

//in order to use middleware use schema function instead of normally declearing into a mongoose.model
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true   //to remove spaces at the ends
    },
    email:{
        type: String,
        required:true,
        trim:true,
        unique:true,  //to have a unique mail id in our database
        lowercase:true, //converts to lowercase
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email ID ')
            }
        }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7, //minimum the string should contain 7 characters
        validate(value){
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password cannot be "password"')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    propic:{
        type:Buffer     // for uploading profile picture of a user
    }

},
{
    timestamps:true
})


//virtual property - for relating user and task files
userSchema.virtual('mytasks',{
    ref:'Task',
    localField:'_id',  //user's ID
    foreignField:'owner' //in task.js model (user ID)
})




// .pre=> to do some task before saving in our database
// .post => to do some task after saving in our database
//for middleware use normal function not ()=> arrow function
userSchema.pre('save',async function(next){
    const user=this
    // console.log('user ',user)
    // console.log('just testing')

    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8)
        console.log(user.password)
    }


    next()          // to go to the next task (i.e) saving to database
})

//to delete all the tasks once a user profile is deleted
userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})

    next()
})


userSchema.statics.findbycredentials=async (email,password)=>{
    const user=await User.findOne({email:email})

    if(!user)
    {
        throw new Error('Unable to login. No user found')
    }

    const isvalidate=await bcrypt.compare(password,user.password)
    if(!isvalidate)
    {
        throw new Error('Unable to login. Check your password')
    }
    return user
}



userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token:token})
    await user.save()
    return token
}

//to show users only the required informations (eg. not showing password)
// userSchema.methods.getPublicProfile=function(){
//     const user=this
//     const userObject=user.toObject()
//     delete userObject.password  //to hide password
//     delete userObject.tokens    //to hide tokens
//     delete userObject.propic
//     return userObject
// }

// instead of above code we can use toJSON methods

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    delete userObject.propic

    return userObject
}









//models User
const User=mongoose.model('User',userSchema)

module.exports=User