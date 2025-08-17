import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import cors from 'cors'
import express from 'express'
import authenticate from "./middlewares/Authenticate.mjs";
import { Types } from "mongoose";


import jwt from "jsonwebtoken";
import { Person,Seeker ,Poster } from "./models/user1.mjs";
import JobData from "./models/jobData.mjs";


const mongoURL='mongodb+srv://Abhinav:123@cluster0.wkfokpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

await mongoose.connect(mongoURL).then(
    console.log("Database Connected")
).catch(
    err=>console.error("Can't connect to database", err)
)

const app=express();
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("HELLO THERE")
})

app.post('/signup',async(req,res)=>{
    try {
        const {name,email,mob,password,role}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    const newPerson=new Person({
        name,email,mob,password:hashedPassword,role
    })
    await newPerson.save()
   

    res.status(201).send({message:"SignUp Successful"});
        
    } catch (error) {
        if(error.code===11000){
             return res.status(400).json({ error: 'Email or mobile already exists' });
        }
       res.status(500).json({ error: 'Server error', details: error.message });
        
    }
  

})

app.post('/seeker',async(req,res)=>{

    try {
         const {email,experience,skills}=req.body;
        
        const personData=await Person.findOne({email:email})
         if(!personData){
             return res.status(500).json({message:'Something Went Wrong !!'})
         }
        const {name,mob,password,role}=personData
       

        if(role==='seeker'){
            try {
                const newSeeker=new Seeker({
                   user: personData._id, name,experience: Number(experience),skills
                })
                await newSeeker.save()
                res.status(200).json({message:'Profile Completed Successfully'})
                
            } catch (error) {

                res.status(500).json({message:'Something went wrong' ,error:error.message})
                
            }
        }
    
        
    } catch (error) {
        res.status(500).json({message:'Something went wrong' ,error:error.message})

        
    }
    
       
    }
    )
    

app.post('/poster',async(req,res)=>{
    try {
        const { organisation,position,industry,companySize, email}=req.body
    const personData=await Person.findOne({email:email})
    if(!personData){
        return res.status(500).json({message:'Something Went Wrong !!'})
    }
    const {mob,password,name,role}=personData
    if(role==='poster'){
        try {
            const newPoster=new Poster({
                user:personData._id,name,organisation,position,industry,companySize
            })

            await newPoster.save()
            res.status(200).json({message:"Profile Completed Sucessfully"})
            
        } catch (error) {
            res.status(500).json({message:"Something Went Wrong",error:error.message})
            
        }
    }
    
    
        
    } catch (error) {
         res.status(500).json({message:"Something Went Wrong",error:error.message})
        
    }
    
    

})

app.post('/login',async(req,res)=>{
    try {
        const {identifier,password}=req.body
        const personData=await Person.findOne({$or:[{email:identifier},{mob:identifier}]});
        if(!personData){
            return res.status(400).json({message:'No Valid User Found !!'})
        }

        
       

        const hashedPassword=personData.password;
        
        const isAuthenticated=await bcrypt.compare(password,hashedPassword)
        if(!isAuthenticated){
            return res.status(401).json({message:"Incorrect Password"})
        }


        
        
        const payload={
            id:personData._id,
            email:personData.email,
            role: personData.role,
            name:personData.name
            
        }
        const token=jwt.sign(payload,"fhdhdhdhehe",{expiresIn:'1h'})

        res.status(200).json({
    message: "Login Successful",
    token: token,
    

});

        
    } catch (error) {

       res.status(500).json({ message: "Something Went Wrong", error: error.message });

        
    }
})

app.post('/postajob',authenticate,async (req,res)=>{
    try {
        const personId=req.user.id;
        const person=await Person.findById(personId);
        if(!person){
            return res.status(404).send('User not found')
        }
        const poster=await Poster.findOne({user:personId})
        if(!poster){
            return res.status(403).send("You are not a poster")
        }
        const companyName=poster.organisation;
        const {jobtitle,jobtype,locationtype,description,compensation,skills,experience,location,deadline}=req.body;
        const postedon=Date.now()
        const Job=new JobData({
            jobtitle,jobtype,locationtype,posterid:personId,organisation:companyName,description,compensation,skills,location,deadline,postedon,experience
        })
        await Job.save();
        res.status(201).json({ message: "Job Posted Successfully" });


        
    } catch (error) {
        return res.send("Something Went Wrong")
        
    }

})

app.put('/changepassword',authenticate,async(req,res)=>{
    const {oldPassword,newPassword,confirmPassword,user_id}=req.body;
    const personData=await Person.findById(user_id);
    if(!personData){
         return res.status(404).json({ message: "User not found" });

    }
    const hashedPassword=personData.password
    const isAuthenticated=await bcrypt.compare(oldPassword,hashedPassword);
    if(!isAuthenticated){
        return res.status(401).json({message:"Password is Incorrect"})


    }
    if(newPassword===confirmPassword){
    const newHashedPassword=await bcrypt.hash(newPassword,10)
    personData.password=newHashedPassword
     await personData.save()
     return res.status(200).json({message:"Password Changed Sucessfully"})
    }
    else{
         return res.status(400).json({message:"New Passwords do not match"})
    }



})

app.get('/dashboard',authenticate,async(req,res)=>{
    const userId=req.query.userId
    
    const personData=await Person.findById(userId);
    if(!personData){
        res.status(404).json({message:"User not found"})
    }
    try {
        if(personData.role==="poster"){

            const jobPosted=await JobData.countDocuments({posterid:userId});
            const jobData=await JobData.find({posterid:userId})
            const posterData=await Poster.findOne({user:userId})
            
            res.status(200).json({
                name:personData.name,
                email:personData.email,
                mob:personData.mob,
                role:"Recruiter",
                membersince:personData.createdAt,
                organisation: posterData?.organisation || "",
                position: posterData?.position || "",
                industry: posterData?.industry || "",
                jobposted:jobPosted
            })


        }
        
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong", error: error.message });
        
    }


app.post('/deleteprofile',authenticate,async(req,res)=>{
    const {password,userId}=req.body;
    
    const personData=await Person.findById(userId);
     if(!personData){

        return res.status(404).json({message:"No user found"})
    }
    const hashedPassword=personData.password
    const isAuthenticated=await bcrypt.compare(password,hashedPassword);
    if(!isAuthenticated){
        return res.status(400).json({message:"Incorrect Password"})

    }

    
   
    try {

        const role=personData.role;
    if(role==="poster"){
        await Person.findByIdAndDelete(userId)
        await Poster.findOneAndDelete({user:userId})
        await JobData.deleteMany({posterid:userId})

    }
    else if(role==="seeker"){
        await Person.findByIdAndDelete(userId)
        await Seeker.findOneAndDelete({user:userId})

    }
    return res.status(200).json({message:"Profile Deleted Sucessfully"})
        
    } catch (error) {
        return res.status(500).json({ message: "Something Went Wrong", error: error.message });
        
    }
    



})



})
app.get('/browsejobs',authenticate,async (req,res)=>{
    const userId=req.user.id
    
    const personData=await Seeker.findOne({user:userId});
    if(!personData){
        
        return res.status(404).json({message:"Not a job seeker"})
        
    }
    const skills= personData.skills;
    const jobs=await JobData.find({skills:{$in:skills}});
    return res.status(200).json(jobs)

})
app.get('/applydata',authenticate,async (req,res)=>{
    const jobId=req.query.jobId
   
    const jobData=await JobData.findById(jobId)
    
    return res.status(200).json(jobData)
})








app.listen(1200,()=>{
    console.log("Server running on port 1200")
})