const directory = "";
const usersFilename = directory + "users.json";
const requestsForHelpFilename = directory + "requests.json";
const offersOfHelpFilename = directory + "offers.json";

import fs from "fs";

export const users = {_data:  JSON.parse(fs.readFileSync(usersFilename))};
export const requestsForHelp = {_data:  JSON.parse(fs.readFileSync(requestsForHelpFilename))};
export const offersOfHelp = {_data:  JSON.parse(fs.readFileSync(offersOfHelpFilename))};

function trimArray()
{
    while ((this.length > 0) && (this[this.length - 1] === undefined))
        this.pop();
}

// Users CRUD

users.create = function(userInfo)
{
    let UID = this.getUID(userInfo.name);

    if (UID !== null)
        UID = null;
    else
    {
        UID = this._data.findIndex((element) => element === undefined)

        if (UID >= 0)
            this._data[UID] = userInfo;
        else
        {
            this._data.push(userInfo);
            UID = this._data.length - 1;
        }
    }

    return UID;
};

users.getAll = function()
    {return this._data.filter((element) => element !== undefined);}

users.get = function(id)
{
    const UID = this.getUID(id);

    return (UID !== null ? this._data[UID] : null);
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

users.getUID = function(id)
{
    const isUID = /^\d+$/;

    let index = null;

    if(isUID.test(id))
        index = (this._data[parseInt(id)] !== undefined ? parseInt(id) : -1);
    else
        index = this._data.findIndex(function(element)
            {
                return (element !== undefined) && (element.name === id);
            });

    return (index < 0 ? null : index);
};

users._data.trim = trimArray;

// Requests for help CRUD

requestsForHelp.create = function(requestInfo)
{
    requestInfo.userUID = users.getUID(requestInfo.userUID);

    let UID = this.getUID(requestInfo.userUID, requestInfo.topic);

    if (UID !== null)
        UID = null;
    else
    {
        UID = requestsForHelp._data.findIndex((element) => element === undefined)

        if (UID >= 0)
            requestsForHelp._data[UID] = requestInfo;
        else
        {
            requestsForHelp._data.push(requestInfo);
            UID = requestsForHelp._data.length - 1;
        }
    }

    return UID;
};

requestsForHelp.getAll = function()
    {return this._data.filter((element) => element !== undefined);}

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

requestsForHelp._data.trim = trimArray;

// Offers of help CRUD

offersOfHelp.create = function(offerInfo)
{
    let UID = this.getUID(offerInfo.userUID, offerInfo.requestUID);

    if (UID !== null)
        UID = null;
    else
    {
        UID = offersOfHelp._data.findIndex((element) => element === undefined)

        if (UID >= 0)
            offersOfHelp._data[UID] = offerInfo;
        else
        {
            offersOfHelp._data.push(offerInfo);
            UID = offersOfHelp._data.length - 1;
        }
    }

    return UID;
}

offersOfHelp.getAll = function()
    {return this._data.filter((element) => element !== undefined);}

offersOfHelp.get = function(userId, requestUID)
{
    const UID = this.getUID(userId, requestUID);

    return (UID !== null ? this._data[UID] : null);
}

offersOfHelp.getForUser = function(userId)
{
    const allOffers = this.getAll();
    const userUID = users.getUID(userId);

    console.log(`User Id is \"${userId}\", user UID is ${userUID}`);

    return allOffers.filter((element) => requestsForHelp._data[element.requestUID].userUID === userUID);
}

offersOfHelp.update = function(offerInfo)
{
    let UID = this.getUID(offerInfo.userUID, offerInfo.requestUID);

    if (UID !== null)
    {
        this._data[UID] = offerInfo;
        return true;
    }
    else
        return false;
}

offersOfHelp.delete = function(userId, requestIndex)
{
    let UID = this.getUID(userId, requestIndex);

    if (UID !== null)
    {
        this._data[UID] = undefined;
        return true;
    }
    else
        return false;
}

offersOfHelp.deleteByUserId = function(userId)
{
    const userUID = users.getUID(userId);

    if (userUID !== null)
        this._data.forEach(function(element, index, array)
            {
                if ((element !== undefined) && (element.userUID === userUID))
                    array[index] = undefined
            });
}

offersOfHelp.deleteByRequestUID = function(requestUID)
{
    if (requestUID >= 0)
        this._data.forEach(function(element, index, array)
            {
                if ((element !== undefined) && (element.requestUID === requestUID))
                    array[index] = undefined
            });
}

offersOfHelp.getUID = function(userId, requestUID)
{
    const userUID = users.getUID(userId);
    const UID = offersOfHelp._data.findIndex(function(element)
        {
            return (element !== undefined) && (element.userUID === userUID)
                && (element.requestUID === parseInt(requestUID));
        });

    return (UID < 0 ? null : UID);
};

offersOfHelp._data.trim = trimArray;

process.on("SIGINT", function (exitCode)
    {
        users._data.trim();
        requestsForHelp._data.trim();
        offersOfHelp._data.trim();

        fs.writeFileSync(usersFilename, JSON.stringify(users._data, null, 4));
        fs.writeFileSync(requestsForHelpFilename, JSON.stringify(requestsForHelp._data, null, 4));
        fs.writeFileSync(offersOfHelpFilename, JSON.stringify(offersOfHelp._data, null, 4));

        console.log(`Data files saved -- exit code is ${exitCode}.`);

        process.exit();
    });
