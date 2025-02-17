import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import { response } from "express";

const handleSignup = async (req, res)=>{
    const {fullName, email, password} = req.body;

    try{
        if(!fullName||!email||!password){
            return res.status(400).json({message:"all fields required"});
        }
        if(password.length<6){
           return res.status(400).json({message:"Password must be at least 6 characters."});
        } 
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message:"User exists with the same email."});

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashedPassword
        });
        if(newUser){
            //generate token
            generateToken(newUser._id, res);
            await newUser.save(); 
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,

            });
        }
        else{
            res.status(400).json({msg:"invalid user data"});
        }
    }
    catch(err){
        console.log("some error occurred in the controller while signing up", err);
        res.status(500).json({msg:"internal server error"});
    }
}
const handleLogin = async (req, res)=>{
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }

        generateToken(user._id, res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        });
    }catch(err){
        console.log("some error occured in controller while logging in", err);
        res.status(500).json({message:"Internal server error"});
    }
}
const handleLogout = (req, res)=>{
    try{
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message:"user Logged out successfully"});
    }catch(err){
        console.log("some error occurred in controller while logging out", err);
        res.status(500).json({message:"Internal server error"});
    }
}
const updateProfile = async (req, res)=>{ 
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            req.status(400).json({message:"Profile pic required."})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true});
        res.status(200).json(updatedUser);
    }catch(err){
        console.log("error in controller while updating profile", err);
        res.status(500).json({message:"Internal server error"});
    }
}
const checkAuth = (req, res)=>{
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.log("error is checkAuth controller", err);
        res.status(500).json({message:"Internal server error"});
    }
}
export {
    handleSignup, handleLogin, handleLogout, updateProfile, checkAuth
}