import { Router } from "express";
import express from 'express';
import authenticate from "../middlewares/Authenticate.mjs";
import Application from "../models/Applications.mjs";
const router= Router();

router.delete("/withdraw/:id",authenticate,async(req,res)=>{
    try {
        const personId=req.user.id;
        const applicationId=req.params.id;
        const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if(application.personId.toString()!==personId){
       return res.status(403).json({ message: "Unauthorized to delete this application" });
    }
    await Application.findByIdAndDelete(applicationId);
    res.status(200).json({message:"Application deleted successfully"});
  
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        
    }

}) 
export default router;