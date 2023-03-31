import dotenv from "dotenv";
import mongoose from "mongoose";

const isUID = /^[0-9a-f]{24}$/;

const userSchema = mongoose.Schema(
    {
        name:  {type:  String, required: true, unique:  true},
        phone:  String,
        email:  String,
        topicsCanHelpWith:  [String]
    });

const requestsForHelpSchema = mongoose.Schema(
    {
        userUID:  {type:  Number, required: true, unique:  true},
        topic:  {type:  String, required: true, unique:  true},
        details:  String
    });

const offersOfHelpSchema = mongoose.Schema(
    {
        userUID:  {type:  Number, required: true, unique:  true},
        requestUID:  {type:  Number, required: true, unique:  true},
        details:  String
    });

dotenv.config();

const db = await mongoose.connect(process.env.MONGO_URL).catch((error) => console.log("Connection to MongoDB failed."));

// console.log("Connected to MongoDB.");

export const users = {_data:  db.model("users", userSchema)};
export const requestsForHelp = {_data:  db.model("requests", requestsForHelpSchema)};
export const offersOfHelp = {_data:  db.model("offers", offersOfHelpSchema)};

// Users CRUD

users.create = async function(userInfo)
{
    let UID = null;

    try
    {
        const newUserInfo = await this._data.create(userInfo);

        UID = newUserInfo._id;
    }
    catch (error)
    {
        const ERROR_DOCUMENT_EXISTS = 11000;

        if (error.code !== ERROR_DOCUMENT_EXISTS)
            throw error;
    }

    return UID;
};

users.getAll = async function()
{
    return await this._data.find();
};

users.get = async function(id)
{
    const UID = await this.getUID(id);
    const userInfo = await this._data.findById(UID);

    return userInfo;
}

users.update = function(userInfo)
{
    const UID = this.getUID(userInfo.name);

    if (UID < 0)
        return false;
    else
    {
        this._data[UID] = userInfo;
        return true;
    }
}

users.delete = function(userId)
{
    const UID = this.getUID(userId);

    if (UID !== null)
    {
        /*
        When deleting a user, it's also necessary to delete their requests for
        help and their offers of help.
        */

        requestsForHelp.deleteByUserId(UID);
        offersOfHelp.deleteByUserId(UID);

        this._data[UID] = undefined;

        return true;
    }
    else
        return false;
}

users.getUID = async function(id)
{
    let UID = null;

    if(isUID.test(id))
    {
        UID = id;
    }
    else
    {
        try
        {
            const userInfo = await this._data.findOne({name:  id}).exec();

            UID = userInfo._id;
        }
        catch (error)
        {
            const ERROR_DOCUMENT_EXISTS = 11000;

            if (error.code !== ERROR_DOCUMENT_EXISTS)
                throw error;
        }
    }

    return UID;
};

process.on("SIGINT", function (exitCode)
    {
        console.log(`Closing database connection -- exit code is ${exitCode}.`);

        process.exit();
    });
