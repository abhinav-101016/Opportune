import mongoose from "mongoose";
import multer from "multer";
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









const PORT=process.env.PORT||1200;
const mongo_URL=process.env.MONGODB_URL;
const jwtSecret=process.env.JWT_SECRET;
const corsOrigin=process.env.CORS_ORIGIN;

const app = express();
const router = express.Router();

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const fileFilter = (req, file, cb) => {
  const allowedtypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, allowedtypes.includes(ext));
};
const upload = multer({ storage, fileFilter });

app.use("/uploads", express.static("uploads"));
app.use("/", router);

const mongoURL = mongo_URL;
await mongoose.connect(mongoURL)
  .then(() => console.log("Database Connected"))
  .catch(err => console.error("Can't connect to database", err));

app.get('/', (req, res) => res.send("HELLO THERE"));

app.post('/signup', async (req, res) => {
  try {
    const { name, email, mob, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPerson = new Person({ name, email, mob, password: hashedPassword, role });
    await newPerson.save();
    res.status(201).send({ message: "SignUp Successful" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email or mobile already exists' });
    }
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.post('/seeker', async (req, res) => {
  try {
    const { email, experience, skills } = req.body;
    const personData = await Person.findOne({ email: email });
    if (!personData) return res.status(500).json({ message: 'Something Went Wrong !!' });
    const { name, role } = personData;
    if (role === 'seeker') {
      const newSeeker = new Seeker({ user: personData._id, name, experience: Number(experience), skills });
      await newSeeker.save();
      res.status(200).json({ message: 'Profile Completed Successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

app.post('/poster', async (req, res) => {
  try {
    const { organisation, position, industry, companySize, email } = req.body;
    const personData = await Person.findOne({ email: email });
    if (!personData) return res.status(500).json({ message: 'Something Went Wrong !!' });
    const { name, role } = personData;
    if (role === 'poster') {
      const newPoster = new Poster({ user: personData._id, name, organisation, position, industry, companySize });
      await newPoster.save();
      res.status(200).json({ message: "Profile Completed Sucessfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong", error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const personData = await Person.findOne({ $or: [{ email: identifier }, { mob: identifier }] });
    if (!personData) return res.status(400).json({ message: 'No Valid User Found !!' });
    const isAuthenticated = await bcrypt.compare(password, personData.password);
    if (!isAuthenticated) return res.status(401).json({ message: "Incorrect Password" });
    const payload = { id: personData._id, email: personData.email, role: personData.role, name: personData.name };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: "Login Successful", token: token });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong", error: error.message });
  }
});

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

app.put('/changepassword', authenticate, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword, user_id } = req.body;
  const personData = await Person.findById(user_id);
  if (!personData) return res.status(404).json({ message: "User not found" });
  const isAuthenticated = await bcrypt.compare(oldPassword, personData.password);
  if (!isAuthenticated) return res.status(401).json({ message: "Password is Incorrect" });
  if (newPassword === confirmPassword) {
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    personData.password = newHashedPassword;
    await personData.save();
    return res.status(200).json({ message: "Password Changed Sucessfully" });
  } else {
    return res.status(400).json({ message: "New Passwords do not match" });
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

router.post('/applicationsubmitted', upload.single("resume"), async (req, res) => {
  try {
    
    if (!req.file) return res.status(400).json({ error: "Resume file is required" });
    const startimmediately = req.body.startimmediately === "true";
    const { jobId, personId, whyhire } = req.body;
    const seekerData=await Seeker.findOne({user:personId});
    if(!seekerData){
      return res.status(404).json({message:"Seeker is invalid"});
    }

     const name = seekerData.name || "";
    const experience = seekerData.experience || "";
    const skills = seekerData.skills || [];


   
    
    const ApplicationData = new Application({ name,experience,skills,jobId, personId, whyhire, startimmediately, resume: req.file.path });
    await ApplicationData.save();
    res.status(201).json({ message: "Application Submitted" });
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
