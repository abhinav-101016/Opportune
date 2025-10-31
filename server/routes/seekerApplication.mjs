import { Router } from "express";
import express from 'express';
import authenticate from "../middlewares/Authenticate.mjs";
import Application from "../models/Applications.mjs";
const router= Router();



router.get('/seekerapplications',authenticate,async(req,res)=>{
  if (req.user.role !== 'seeker') {
   
    return res.status(403).json({ message: "Access denied. Only seekers can view applications." });
  }
  const id=req.user.id;
  try {
     const applications=await Application.find({personId:id}).populate('jobId','jobtitle organisation compensation  location locationtype jobtype');
     if(applications){
       res.status(200).json(applications);
      }

    
  } catch (error) {
    res.status(500).json("Something Went Wrong");
    
  }
 

})
export default router;