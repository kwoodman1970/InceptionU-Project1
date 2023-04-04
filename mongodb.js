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
        userUID:  {type:  String, required: true, unique:  true},
        topic:  {type:  String, required: true, unique:  true},
        details:  String
    });

const offersOfHelpSchema = mongoose.Schema(
    {
        userUID:  {type:  String, required: true, unique:  true},
        requestUID:  {type:  String, required: true, unique:  true},
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

users.getAll = async function() {return await this._data.find();};

users.get = async function(id)
{
    const UID = await this.getUID(id);
    const userInfo = await this._data.findById(UID);

    return userInfo;
}

users.update = async function(userInfo)
{
    const UID = await this.getUID(userInfo.name);

    if (UID === null)
        return false;
    else
    {
        const updatedUserInfo = await this._data.findByIdAndUpdate(UID, userInfo);

        return (updatedUserInfo !== null);
    }
}

users.delete = async function(userId)
{
    const UID = await this.getUID(userId);

    if (UID === null)
        return false;
    else
    {
        const deletedUserInfo = await this._data.findByIdAndDelete(UID);

        if (deletedUserInfo !== null)
        {
            /*
            When deleting a user, it's also necessary to delete their requests for
            help and their offers of help.
            */

            // requestsForHelp.deleteByUserId(UID);
            // offersOfHelp.deleteByUserId(UID);

            return true;
        }
        else
            return false;
    }
}

users.getUID = async function(id)
{
    let UID = null;

    if(isUID.test(id))
        UID = id;
    else
    {
        const userInfo = await this._data.findOne({name:  id}).exec();

        UID = (userInfo !== null ? userInfo._id : null);
    }

    return UID;
};

// Requests for help CRUD

requestsForHelp.create = async function(requestInfo)
{
    let UID = null;

    requestInfo.userUID = await users.getUID(requestInfo.userUID);

    try
    {
        const newRequestInfo = await this._data.create(requestInfo);

        UID = newRequestInfo._id;
    }
    catch (error)
    {
        const ERROR_DOCUMENT_EXISTS = 11000;

        if (error.code !== ERROR_DOCUMENT_EXISTS)
            throw error;
    }

    return UID;
};

requestsForHelp.getAll = async function() {return await this._data.find();};

requestsForHelp.get = function(userId, topic)
{
    const UID = this.getUID(userId, topic);

    return (UID !== null ? this._data[UID] : null);
}

requestsForHelp.update = function(requestInfo)
{
    const UID = this.getUID(requestInfo.userUID, requestInfo.topic);

    if (UID !== null)
    {
        this._data[UID] = requestInfo;
        return true;
    }
    else
        return false;
}

requestsForHelp.delete = function(userId, topic)
{
    const UID = this.getUID(userId, topic);

    if (UID === null)
        return false;
    else
    {
        /*
        When deleting a reqeust for help, it's also necessary to delete any
        associated offers of help.
        */

        offersOfHelp.deleteByRequestUID(UID);

        this._data[UID] = undefined;

        return true;
    }
}

requestsForHelp.deleteByUserId = function(userId)
{
    let userUID = users.getUID(userId);

    if (userUID !== null)
        this._data.forEach(function(element, index, array)
            {
                if ((element !== undefined) && (element.userUID === userUID))
                {
                    offersOfHelp.deleteByRequestUID(index);
                    array[index] = undefined
                }
            });
}

requestsForHelp.getUID = function(userId, topic)
{
    const userUID = users.getUID(userId);

    const index = requestsForHelp._data.findIndex(function(element)
        {
            return (element !== undefined) && (element.userUID === userUID)
                && (element.topic === topic);
        });

    return (index < 0 ? null : index);
};

process.on("SIGINT", function (exitCode)
    {
        console.log(`Closing database connection -- exit code is ${exitCode}.`);

        process.exit();
    });
