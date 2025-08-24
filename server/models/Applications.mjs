import mongoose, { model, Schema } from "mongoose";
const applicationSchema =new mongoose.Schema({
    "jobId":{
        type:mongoose.Schema.Types.ObjectId,
        ref:"JobData",
        required:true


    },
    "personId":{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Person",
        required:true,



    },
    "whyhire":{
        type:String,
        required:true

    },
    "startimmediately":{
        type:String,
        required:true

    },
    "resume":{
        type:String,
        

    },
    "status":{
        type:String,

        
        enum:["pending","accepted","rejected"],
        default:"pending"

    },
    "date":{
        type:Date,
        default:Date.now

    }
   


}



)
 const Application=model("Application",applicationSchema);
 export default Application;

