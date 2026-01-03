import mongoose from "mongoose";



const userSchema=new mongoose.Schema({
    "name":{type:String,required:true,trim:true},
    "email":{type:String,required:true,trim:true,lowercase:true,unique:true},
    "emailVerified":{type:Boolean,default:false},
    "otp":String,
    "otpExpires":Date,
    "mob":{type:String,required:true,trim:true,unique:true},
    "password":{type:String,required:true,trim:true,minLength:8},
    "role":{type:String,required:true,enum: ['seeker', 'poster']},
    
    //"location":{type:String,enum:['remote','on-site'],required:false},
    


},{timestamps:true})

const Person=mongoose.model('Person',userSchema);

const seekerSchema=new mongoose.Schema({
    "name":{type:String,required:true,trim:true},
     "user": { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true, unique: true },
    "experience":{type:Number,min: 0,max: 50,required:true},
    "skills":{type:[String],required:true, default:[]},

})

const  posterSchema=new mongoose.Schema({
    "name":{type:String,required:true,trim:true},
     "user": { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true, unique: true },
    "organisation":{type:String,trim:true,required:true},
    "position":{type:String,trim:true, match:/^[A-Za-z\s]+$/,required:true},
    "industry":{type:String,enum:['IT', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Manufacturing', 'Media', 'Real Estate', 'Other'],required:true},
    "companySize":{type:String,enum:['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],required:true}

})

const Seeker=mongoose.model('Seeker',seekerSchema)
const Poster=mongoose.model('Poster',posterSchema)




export { Person, Seeker, Poster };

