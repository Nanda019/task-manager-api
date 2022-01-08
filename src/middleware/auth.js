//middleware

const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth=async (req,res,next)=>{
   try{
       const token=req.header('Authorization').replace('Bearer ','')
    //    console.log(token)
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded)
    const user= await User.findOne({_id:decoded._id,'tokens.token':token})  //'tokens.token':token is used to check if the token is still present in our tokens array or not timeed out
    console.log(user)
        if(!user){
            throw new Error()
        }
        req.user=user //to give this user data to the route handler(GET, PUT etc...)
        req.token=token //for logging out purpose
        next()
   }
   catch(e){
       res.status(401).send({error: 'Please authenticate'})
   }
}

module.exports=auth