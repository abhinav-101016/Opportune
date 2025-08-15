import jwt from "jsonwebtoken";

const authenticate=(req,res,next)=>{

    const authHeader=req.headers['authorization']
    if(!authHeader){
        return res.status(401).json({message:"Authorization header missing"})
    }
    const token=authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"Token not found"});

    }
    jwt.verify(token,"fhdhdhdhehe",(err,user)=>{
        if(err){
            return res.status(403).json({message:"Invalid or expired token"})
        }
        req.user=user
        next()
    })

}

export default authenticate
