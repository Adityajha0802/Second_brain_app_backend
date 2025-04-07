import express from "express";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";


const app=express();
app.use(express.json());
app.use(cors());



app.post("/api/v1/signup",async (req,res)=>{
    //Todo:zod validation,hash the password
    const username=req.body.username;
    const password=req.body.password;
    try{
    await UserModel.create({
        username:username,
        password:password
    })

    res.json({
        message:"User signed up"
    })
    }catch(e){
        res.status(411).json({
            message:"User already exists"
        })
    }

})

app.post("/api/v1/signin",async (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const existinguser=await UserModel.findOne({
        username,
        password
    });
    if(existinguser){
        const token=jwt.sign({
            id:existinguser._id
        },JWT_SECRET);
        res.json({
            token
        })
    }
    else{
        res.status(403).json({
            message:"Incorrect Credentials"
        })
    }
})

app.post("/api/v1/content",userMiddleware,async (req,res)=>{
    const link=req.body.link;
    const type=req.body.type;
    await ContentModel.create({
        link,
        title:req.body.title,
        type,

        //@ts-ignore
        userId:req.userId,
        tags:[]
    })

    
        res.json({
            message:"Content added"
        })
    
})

app.get("/api/v1/content",userMiddleware,async (req,res)=>{
    //@ts-ignore
    const userId=req.userId;
    const content=await ContentModel.find({
        userId:userId
    }).populate("userId","username")
    res.json({
        content
    })
})

app.delete("/api/v1/content",userMiddleware,async(req,res)=>{
    const contentId=req.body.contentId;

    await ContentModel.deleteMany({
        _id:contentId,
        //@ts-ignore
        userId:req.userId
    })

    res.json({
        message:"Deleted"
    })
})

app.post("/api/v1/brain/share",userMiddleware,async(req,res)=>{
    const share=req.body.share;
    if(share){
    const existinglink=await LinkModel.findOne({
        //@ts-ignore
        userId:req.userId
    })
    if(existinglink){
        res.json({
            hash:existinglink.hash
        })
        return;
    }
   
    const hash=random(10);
    await LinkModel.create({
        //@ts-ignore
        userId:req.userId,
        hash:hash

    })
    res.json({
        message:"/share/"+hash
    })
    }
    else{
        await LinkModel.deleteOne({
            //@ts-ignore
            userId:req.userId
        })
    
        res.json({
        message:"Removed link"
        })
    }
    
})

app.get("/api/v1/brain/:shareLink",async(req,res)=>{
    const hash=req.params.shareLink;

    const link=await LinkModel.findOne({
        hash:hash
    })

    if(!link){
        res.status(411).json({
            message:"Sorry Incorrect input"
        })
        return;
    }
    //userId
    const content=await ContentModel.find({
        userId:link.userId
    })

    const user=await UserModel.findOne({
        _id:link.userId
    })
    if(!user){
        res.status(411).json({
            message:"user not found.. error should ideally not happen"
        })
        return;
    }

    res.json({
        username:user.username,
        content:content
    })
})

app.listen(3000);


