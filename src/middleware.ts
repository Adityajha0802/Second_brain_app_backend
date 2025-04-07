import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export const userMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const header=req.headers["authorization"];
    const decodeduser=jwt.verify(header as string,JWT_SECRET);
    if(decodeduser){
        //@ts-ignore
        req.userId=decodeduser.id;
        next();
    }
    else{
        res.status(403).json({
            message:"You havenot logged in"
        })

    }
}
//Todo:how to override the type of Request object