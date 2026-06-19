import jwt from 'jsonwebtoken';
import { User } from '../models/User.models.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "Unauthorized - No token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!decoded){
            return res.status(401).json({message: "Unauthorized - Invalid token"});
        }

        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({message: "Unauthorized - User not found"});
        }

        // try {
        //     await upsertStreamUser({
        //         id: updateUser._id.toString(),
        //         name: updateUser.username,    
        //         image: updateUser.profilePic || "",
        //     });
        //     console.log(`Stream user has been updated after onboarding for ${updateUser.username}`);
            
        // } catch (streamError) {
        //     console.log("Error updating Stream user after onboarding:", streamError.message);
        // }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(401).json({message: "Unauthorized - Invalid token"});
    }
}