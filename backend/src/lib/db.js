import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
       const conn =  await mongoose.connect(process.env.MONGODB_URI);
       console.log(`mongoDB connected successfully : ${conn.connection.host}`);

    }catch(err){
        console.log(`error while connecting to the mongodb server: ${err}`);
    }
}

export {connectDB};