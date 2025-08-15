import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Person from './models/user.mjs';
import bcrypt from 'bcrypt'

const mongoURL='mongodb+srv://Abhinav:123@cluster0.wkfokpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

await mongoose.connect(mongoURL)
.then(
    console.log("DATABASE CONNECTED SUCCESSFULLY")
)
.catch(err=>console.error("CONNECTION FAILED ",err));



const app=express()
app.use(cors())
app.use(express.json())


app.post('/SignUp',async (req,res)=>{
 try {
    const {name,email,mob,password}=req.body

    const hashedPassword=await bcrypt.hash(password,10);



    const newPerson= new Person({
        name,email,mob,password:hashedPassword})
    await newPerson.save(); 

    res.status(201).json({ message: "Sign Up Successful" });

    
    
   
   
 } catch (error) {
    if(error.code===11000){
        return res.status(400).json({ error: 'Email or mobile already exists' });
    }
    res.status(500).json({ error: 'Server error', details: error.message });
    
 }
    



})


app.post('/api/login', async (req,res)=>{
    const {email,mob,password}=req.body;



})

app.listen(4200,()=>{
    console.log("server Running")
})