import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    "jobtitle":{type:String,required:true,trim:true},
    "organisation":{type:String},
    "description":{type:String,required:true},
    "compensation": {
        type: {
            minAmount: { type: Number, min: 0 }, // Minimum amount
            maxAmount: { type: Number, min: 0 }, // Maximum amount (optional, for range)
            currency: { type: String, default: "INR" ,enum:["INR","USD","EUR"]}, // e.g., "USD", "EUR", "INR"
            period: {
                type: String,
                enum: ["Hourly", "Daily", "Weekly", "Monthly", "Annually", "Project-based"],
                required: true
            },
            isNegotiable: { type: Boolean, default: false }, 
           
           
        },
        required: true 
    },
    "jobtype":{type:String,enum:["Full-Time","Part-Time","Freelance"],required:true},
    "skills":{type:[String],required:true},
    "experience":{type:String,enum:["Fresher","1-3 years","4-8 years","8+ years"],required:true},
    "locationtype":{type:String,enum:["On-Site","Remote"],required:true},
    "location":{type:String},
    "deadline":{type:Date,required:true},
    "postedon":{type:Date,default:Date.now()},
    "posterid": { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
     
})

const JobData=mongoose.model('JobData',postSchema);
export default JobData