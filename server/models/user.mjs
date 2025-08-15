import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    "name":{type:String,required:true,trim:true},
    "email":{type:String,required:true,unique:true,match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,lowercase:true,
        trim:true
    },
    "mob":{type:String,required:true,unique:true, match: /^[6-9]\d{9}$/,trim:true},
    "password":{type:String,required:true,minLength:8}
},{
    timestamps:true
})

const Person= mongoose.model('Person',userSchema)
export default Person;