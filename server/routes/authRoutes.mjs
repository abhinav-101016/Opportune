import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import authenticate from "../middlewares/Authenticate.mjs";
import { Person,Seeker, Poster  } from "../models/user1.mjs";
import { sendEmail } from "../utils/sendEmail.mjs";
const router=Router();




router.post('/signup', async (req, res) => {
  try {
    const { name, email, mob, password, role } = req.body;

    const existingUser = await Person.findOne({ $or: [{ email }, { mob }] });
    if (existingUser)
      return res.status(400).json({ message: "Email or mobile already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp=Math.floor(100000+Math.random()*900000).toString();
    const otpExpires=Date.now()+10*60*1000;

    const newPerson = new Person({ name, email, mob, password: hashedPassword, role,otp,otpExpires,emailVerified:false });

    await newPerson.save();
    const message = `Hi ${name},\n\nYour verification code is: ${otp}\n\nIt expires in 10 minutes.`;


   await sendEmail(email, "Verify your email - Opportune", message);
    res.status(201).send({ message: " Please verify OTP sent to your email." });
  } catch (error) {

    res.status(500).json({ error: 'Server error', details: error.message });
  }
});


router.post('/verify',async(req,res)=>{
  try{
    const {email,otp}=req.body;
    const personData=await Person.findOne({email});
    if(!personData){
      return res.status(404).json({message:"User not found"})
    }
    if(personData.otp!==otp.toString()){
      return res.status(400).json({ message: "Invalid OTP try again!" });
    }

    if(personData.otpExpires<Date.now()){
      return res.status(400).json({ message: "OTP expired" });

    }
    personData.emailVerified=true;
    personData.otp=undefined;
    personData.otpExpires=undefined ;

    await personData.save();



    return res.status(200).json({message:"Email verified successfully!"});
    

  }
  catch(error){
    res.status(500).json({message:"Error verifying OTP"});
   
}
}
)



router.post('/seeker', async (req, res) => {
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



router.post('/poster', async (req, res) => {
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

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const personData = await Person.findOne({ $or: [{ email: identifier }, { mob: identifier }] });
    if (!personData) return res.status(400).json({ message: 'No Valid User Found !!' });
    const isAuthenticated = await bcrypt.compare(password, personData.password);
    if (!isAuthenticated) return res.status(401).json({ message: "Incorrect Password" });
    const payload = { id: personData._id, email: personData.email, role: personData.role, name: personData.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong", error: error.message });
  }
});






router.put('/changepassword', authenticate, async (req, res) => {
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





export default router



