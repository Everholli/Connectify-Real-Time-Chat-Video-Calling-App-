import { User } from "../models/User.models.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res){
    
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        };
        
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if(existingUser){
            return res.status(400).json({message: "User with this email or username already exists"});
        }  
        const idx = Math.floor(Math.random() * 100) +1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User({
            username,
            email,
            password,
            profilePic: randomAvatar
        });

        await newUser.save();

        try {
            await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.username,
            image: newUser.profilePic || "",
        });
        console.log(`Stream user created for ${newUser.username}`);
        } catch (error) {
            console.log("Error creating Stream user:", error);
        }

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET_KEY, 
            {expiresIn: '7d'});

        res.cookie("jwt", token, {
            httpOnly: true, //prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',  //prevents CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic
            },
            token
        });

        
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function login(req, res){
    try {
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({message: "Username and password are required"});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message: "Invalid username or password"});
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid username or password"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, 
            {expiresIn: '7d'});
        
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic
            },
            token
        });
    } catch (error) {
        console.log("Error in login", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export function logout(req, res){
    res.clearCookie("jwt");
    res.status(200).json({message: "Logout successful"});
} 

export async function onboarding(req, res){
    try {
        const userId = req.user._id;
        const {username, bio, nativeLanguage, learningLanguage, location} = req.body;
        if(!username || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message: "All fields are required for onboarding",
                missingFields: [
                    !username && 'username',
                    !bio && 'bio',
                    !nativeLanguage && 'nativeLanguage',
                    !learningLanguage && 'learningLanguage',
                    !location && 'location'
                ]
            });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            username,
            bio,
            nativeLanguage,
            learningLanguage,
            location
        }, {new: true}).select('-password');

        if(!updatedUser){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({
            message: "Onboarding completed successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error in onboarding:", error);
        res.status(500).json({message: "Internal server error"});
    }
}