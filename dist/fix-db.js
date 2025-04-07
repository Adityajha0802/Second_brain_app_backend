"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
const db_1 = require("./db");
// Connect to MongoDB
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect("mongodb+srv://adityajha:hS6vyFLnsTa0K5ud@cluster0.jd1zy.mongodb.net/second_brain_app");
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
});
// Function to update ContentSchema with custom ID field
const updateContentSchema = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Get the existing Content collection and modify schema
        const ContentSchema = new mongoose_1.Schema({
            id: {
                type: String,
                default: () => (0, uuid_1.v4)(),
                unique: true,
                required: true
            },
            title: String,
            link: String,
            type: String,
            tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
            userId: { type: mongoose_1.default.Types.ObjectId, ref: 'users', required: true }
        });
        // Step 2: Find existing documents with null IDs and update them
        console.log("Finding documents with null IDs...");
        const documentsToFix = yield db_1.ContentModel.find({ id: null }).exec();
        console.log(`Found ${documentsToFix.length} documents with null IDs`);
        // Step 3: Update each document with a unique ID
        for (const doc of documentsToFix) {
            const newId = (0, uuid_1.v4)();
            console.log(`Updating document with _id: ${doc._id} to have id: ${newId}`);
            yield db_1.ContentModel.updateOne({ _id: doc._id }, { $set: { id: newId } });
        }
        console.log("All documents updated successfully");
        // Step 4: Apply the updated schema to the model
        // This is a demonstration - in production, schema changes need careful migration
        console.log("\nNOTE: The ContentSchema in db.ts should be updated to include:");
        console.log(`
    id: { 
      type: String, 
      default: () => uuidv4(), 
      unique: true,
      required: true 
    },`);
        return true;
    }
    catch (error) {
        console.error("Error updating ContentSchema:", error);
        return false;
    }
});
// Main function to run the fix
const fixDuplicateKeyError = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDB();
    console.log("Starting database fix for duplicate key error...");
    const success = yield updateContentSchema();
    if (success) {
        console.log("\nFix completed successfully!");
        console.log("Please update your src/db.ts file with the schema changes shown above");
    }
    else {
        console.log("\nFix encountered errors. Please check the logs above.");
    }
    // Disconnect from MongoDB
    mongoose_1.default.disconnect();
    console.log("MongoDB disconnected");
});
// Run the fix
fixDuplicateKeyError().catch(error => {
    console.error("Unexpected error:", error);
    process.exit(1);
});
