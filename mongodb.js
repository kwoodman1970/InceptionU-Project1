import dotenv from "dotenv";
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        id:  {type:  String, required: true, unique:  true},
        phone:  String,
        email:  String,
        topicsCanHelpWith:  [String]
    });

const requestsForHelpSchema = mongoose.Schema(
    {
        userIndex:  {type:  Number, required: true, unique:  true},
        topic:  {type:  String, required: true, unique:  true},
        details:  String
    });

const offersOfHelpSchema = mongoose.Schema(
    {
        userIndex:  {type:  Number, required: true, unique:  true},
        requestIndex:  {type:  Number, required: true, unique:  true},
        details:  String
    });

dotenv.config();

const db = await mongoose.connect(process.env.MONGO_URL);

console.log("Connected to MongDB.");

export const users = {model:  mongoose.model("users", userSchema)};
export const requestsForHelp = {model:  mongoose.model("requests", requestsForHelpSchema)};
export const offersOfHelp = {model:  mongoose.model("offers", offersOfHelpSchema)};

// Users CRUD

process.on("SIGINT", function (exitCode)
    {
        console.log(`Closing database connection -- exit code is ${exitCode}.`);

        process.exit();
    });
