import mongoose from "mongoose";
import { connectDB } from "./config/db.mjs";
import multer from "multer";
import cloudinary from "./config/cloudinaryConfig.mjs";

import path from "path";
import { Router } from "express";
import bcrypt from 'bcrypt';
import cors from 'cors';
import express from 'express';
import authenticate from "./middlewares/Authenticate.mjs";
import Application from "./models/Applications.mjs";
import jwt from "jsonwebtoken";
import { Person, Seeker, Poster } from "./models/user1.mjs";
import JobData from "./models/jobData.mjs";
import dotenv from "dotenv"
dotenv.config({path:path.resolve("./server/.env")});
import authRoutes from "./routes/authRoutes.mjs";









const PORT=process.env.PORT||1200;

const jwtSecret=process.env.JWT_SECRET;
const corsOrigin=process.env.CORS_ORIGIN;

const app = express();
const router = express.Router();

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

const storage =multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedtypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, allowedtypes.includes(ext));
};
const upload = multer({ storage, fileFilter });

app.use("/uploads", express.static("uploads"));
app.use("/", router);

//DATABASE CONNECTION


await connectDB();




app.get('/', (req, res) => res.send("HELLO THERE"));

//AUTHENTICATION ROUTES

app.use("/api/auth",authRoutes);


app.post('/postajob', authenticate, async (req, res) => {
  try {
    const personId = req.user.id;
    const person = await Person.findById(personId);
    if (!person) return res.status(404).send('User not found');
    const poster = await Poster.findOne({ user: personId });
    if (!poster) return res.status(403).send("You are not a poster");
    const companyName = poster.organisation;
    const { jobtitle, jobtype, locationtype, description, compensation, skills, experience, location, deadline } = req.body;
    const postedon = Date.now();
    const Job = new JobData({ jobtitle, jobtype, locationtype, posterid: personId, organisation: companyName, description, compensation, skills, location, deadline, postedon, experience });
    await Job.save();
    res.status(201).json({ message: "Job Posted Successfully" });
  } catch (error) {
    return res.send("Something Went Wrong");
  }
});


app.get('/dashboard', authenticate, async (req, res) => {
  const userId = req.query.userId;
  const personData = await Person.findById(userId);
  if (!personData) return res.status(404).json({ message: "User not found" });
  try {
    if (personData.role === "poster") {
      const jobPosted = await JobData.countDocuments({ posterid: userId });
      const posterData = await Poster.findOne({ user: userId });
      res.status(200).json({ name: personData.name, email: personData.email, mob: personData.mob, role: "Recruiter", membersince: personData.createdAt, organisation: posterData?.organisation || "", position: posterData?.position || "", industry: posterData?.industry || "", jobposted: jobPosted });
    }
    else if(personData.role==="seeker"){
      const jobsApplied=await Application.countDocuments({personId:userId});
      const seekerData=await Seeker.findOne({user:userId});
      

      res.status(200).json({name:personData.name,email:personData.email,mob:personData.mob,role:"Seeker",membersince:personData.createdAt,experience:seekerData.experience||" ",
        jobsApplied:jobsApplied || " ",skills:seekerData.skills || []
      })

    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong", error: error.message });
  }
});

app.post('/deleteprofile', authenticate, async (req, res) => {
  const { password, userId } = req.body;
  const personData = await Person.findById(userId);
  if (!personData) return res.status(404).json({ message: "No user found" });
  const isAuthenticated = await bcrypt.compare(password, personData.password);
  if (!isAuthenticated) return res.status(400).json({ message: "Incorrect Password" });
  try {
    const role = personData.role;
    if (role === "poster") {
      await Person.findByIdAndDelete(userId);
      await Poster.findOneAndDelete({ user: userId });
      await JobData.deleteMany({ posterid: userId });
    } else if (role === "seeker") {
      await Person.findByIdAndDelete(userId);
      await Seeker.findOneAndDelete({ user: userId });
      await Application.deleteMany({
personId:userId})
    }
    return res.status(200).json({ message: "Profile Deleted Sucessfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something Went Wrong", error: error.message });
  }
});

app.get('/browsejobs', authenticate, async (req, res) => {
  const userId = req.user.id;
  const personData = await Seeker.findOne({ user: userId });
  if (!personData) return res.status(404).json({ message: "Not a job seeker" });
  const jobs = await JobData.find({ skills: { $in: personData.skills } });
  return res.status(200).json(jobs);
});

app.get('/applydata', authenticate, async (req, res) => {
  const jobId = req.query.jobId;
   
  const jobData = await JobData.findById(jobId);
  return res.status(200).json(jobData);
});


import streamifier from "streamifier";

router.post('/applicationsubmitted', upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Resume file is required" });

    const { jobId, personId, whyhire } = req.body;
    const seekerData = await Seeker.findOne({ user: personId });
    if (!seekerData) return res.status(404).json({ message: "Seeker is invalid" });

    const name = seekerData.name || "";
    const experience = seekerData.experience || "";
    const skills = seekerData.skills || [];

    const uploadResume = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "resumes", resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    };

    const result = await uploadResume();

    const ApplicationData = new Application({
      name,
      experience,
      skills,
      jobId,
      personId,
      whyhire,
      startimmediately: req.body.startimmediately === "true",
      resume: result.secure_url
    });

    await ApplicationData.save();
    res.status(201).json({ message: "Application Submitted", resumeURL: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/jobsposted',authenticate,async(req,res)=>{
  const userId=req.query.userId;
  try {
    const jobsPosted=await JobData.find({posterid:userId });
  return res.status(200).json(jobsPosted);

    
  } catch (error) {
    return res.status(500).json("Failed to fetch the jobs !");
    
  }
  
})
app.delete('/deleteJob/:jobId',authenticate,async(req,res)=>{
  const {jobId}=req.params;
  
  try{
    await JobData.findByIdAndDelete(jobId);
    
    return res.status(200).json("Deleted Successfully");
  
  }
  catch(error){
    
    return res.status(500).json("Something is not correct");

  }
  
})

app.get('/applications',authenticate,async(req,res)=>{
  const jobId=req.query.jobId;
  try {
     const applications=await Application.find({jobId:jobId});
     if(applications){
       res.status(200).json(applications);
      }

    
  } catch (error) {
    res.status(500).json("Something Went Wrong");
    
  }
 

})

app.put('/status', authenticate, async (req, res) => {
  const id=req.query.id;
  const  {status1}  = req.body;

  try {
    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = status1;
    await application.save();

    return res.status(200).json({ message: "Status Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});





app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
