import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverId } from "../lib/socket.js";

const getUsersForSidebar = async (req, res)=>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    }catch(err){
        console.log("Error in getUsersForSidebar controller: ",err);
        res.status(500).json({message:"Internal server error"});
    }
}

const getMessages = async (req, res)=>{
    try{
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}  
            ]
        })
        res.status(200).json(messages);
    }catch(err){
        console.log("Error in getMessages controller: ", err);
        res.status(500).json({message:"Internal server error"});
    }
}

const sendMessage = async (req, res)=>{
    try{
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            //upload the image to the cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save();
        const receiverSocketId =  getReceiverId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        //realtime functionality will be implemented here => socket.io;
        res.status(201).json(newMessage);
        
    }catch(err){
        console.log("Error in sendMessage controller: ", err);
        res.status(500).json({message:"Internal server error"});
    }
}
export {
    getUsersForSidebar, getMessages, sendMessage
}