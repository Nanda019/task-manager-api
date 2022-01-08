// CRUD create read update delete

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID=mongodb.ObjectId
//or
// const{MongoClient,ObjectID}=require('mongodb')

//to create a customised ID
const id=new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)
    
    // db.collection('users').deleteMany({
    //     age:27
    // }).then((res)=>{
    //     console.log(res)
    // }).catch((err)=>{
    //     console.log(err)
    // })


    // db.collection('users').updateOne({
    //     _id:new ObjectID('61d28f91afb5458f764349ca')
    // },{
    //     $set:{
    //         name:'Yash'
    //     }
    // }).then((res)=>{
    //     console.log(res)
    // }).catch((err)=>{
    //     console.log(err)
    // })

    // db.collection('tasks').updateMany({
    //     completed:false
    // },{
    //     $set:{
    //         completed:true
    //     }
    // }).then((res)=>{
    //     console.log(res.modifiedCount)
    // }).catch((err)=>{
    //     console.log("All is true")
    // })

    // db.collection('users').insertOne({
    //     name: 'Vikram',
    //     age: 27
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user')
    //     }

    //     console.log(result.insertedId)
    // })

    db.collection('users').insertMany([
        {
            name: 'goel',
            age: 12
        }, {
            name: 'ram',
            age: 12
        }
    ], (error, result) => {
        if (error) {
            return console.log('Unable to insert documents!')
        }

        console.log(result.insertedIds)
    })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Clean the house',
    //         completed: true
    //     },{
    //         description: 'Renew inspection',
    //         completed: false
    //     },{
    //         description: 'Pot plants',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert tasks!')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection("users").findOne({_id:new ObjectID('61d28e3baeceb115674a72bc')},(error,res)=>{
    //     if(error){
    //     return console.log("Not found")
    //     }
    //     console.log(res)
    // })


    // db.collection("users").find({age:27}).toArray((error,res)=>{
    //     console.log(res)
    // })
    // db.collection("users").find({age:27}).count((error,res)=>{
    //     console.log(res)
    // })


    // db.collection('tasks').findOne({_id:new ObjectID("61d28abe7e239eeba362cc14")},(error,res)=>{
    //     console.log(res)
    // })
    // db.collection('tasks').find({completed:true}).toArray((error,res)=>{
    //     console.log(res)
    // })
})