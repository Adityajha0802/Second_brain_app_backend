import mongoose,{model,Schema} from "mongoose";
import { v4 as uuidv4 } from 'uuid';
mongoose.connect("mongodb+srv://adityajha:hS6vyFLnsTa0K5ud@cluster0.jd1zy.mongodb.net/second_brain_app");

const UserSchema=new Schema({
    username:{type:String,unique: true},
    password:String
})
export const UserModel=model("users",UserSchema);

const ContentSchema=new Schema({
    id: { type: String, default: () => uuidv4(), unique: true },
    title:String,
    link:String,
    type:String,
    tags:[{type:mongoose.Types.ObjectId, ref:'Tag'}],
    userId:{type:mongoose.Types.ObjectId, ref :'users',required:true}
})
export const ContentModel=model("contents",ContentSchema);

const LinkSchema=new Schema({
    hash:String,
    userId:{type:mongoose.Types.ObjectId, ref :'users',required:true,unique:true}
})
export const LinkModel=model("Links",LinkSchema);