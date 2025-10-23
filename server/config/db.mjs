import mongoose from "mongoose";

export const connectDB=async()=>{
    const mongo_URL=process.env.MONGODB_URL;
    const mongoURL = mongo_URL;
    await mongoose.connect(mongoURL)
  .then(() => console.log("Database Connected"))
  .catch(err => console.error("Can't connect to database", err));


}

