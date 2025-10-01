import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

dotenv.config({path:path.resolve("./server/.env")});

const jwtSecret=process.env.JWT_SECRET;

const authenticate=(req,res,next)=>{

    const authHeader=req.headers['authorization']
    if(!authHeader){
        return res.status(401).json({message:"Authorization header missing"})
    }
    const token=authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"Token not found"});

    }
    jwt.verify(token,jwtSecret,(err,user)=>{
        if(err){
            return res.status(403).json({message:"Invalid or expired token"})
        }
        req.user=user
        next()
    })

}

export default authenticate
