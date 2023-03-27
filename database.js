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
    while ((this.length > 0) && (this[this.length - 1] === null))
        this.pop();
}

// Users CRUD

users.create = function(userInfo)
{
    let UID = this._getUID(userInfo.id);

    if (UID >= 0)
        return -1;
    else
    {
        UID = this._data.findIndex((element) => element === undefined)

        if (UID >= 0)
        {
            this._data[UID] = userInfo;
            return UID;
        }
        else
        {
            this._data.push(userInfo);
            return this._data.length - 1;
        }
    }
};

users.getAll = function()
    {return this._data.filter((element) => element !== undefined);}

users.get = function(id)
{
    const UID = this._getUID(id);

    return (UID >= 0 ? this._data[UID] : null);
}

users.update = function(userInfo)
{
    const UID = this._getUID(userInfo.id);

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
    const UID = this._getUID(userId);

    if (UID >= 0)
    {
        /*
        When deleting a user, it's also necessary to delete their requests for
        help and their offers of help.
        */

        // requestsForHelp.deleteByUserId(UID);
        // offersOfHelp.deleteByUserId(UID);

        this._data[UID] = undefined;

        return true;
    }
    else
        return false;
}

users._getUID = function(id)
{
    const isAllDigits = /^\d+$/;

    if(isAllDigits.test(id))
        return (this._data[parseInt(id)] !== undefined ? parseInt(id) : -1);
    else
        return this._data.findIndex(function(element)
            {
                return (element !== undefined) && (element.id === id);
            });
};

users._data.trim = trimArray;

// Requests for help CRUD

requestsForHelp.create = function(requestInfo)
{
    const userUID = users._getUID(requestInfo.userIndex);
    let index = this._getUID(userUID, requestInfo.topic);

    if (index >= 0)
        return -1;
    else
    {
        requestInfo.userIndex = userUID;
        index = requestsForHelp._data.findIndex((element) => element === undefined)

        if (index >= 0)
        {
            requestsForHelp._data[index] = requestInfo;
            return index;
        }
        else
        {
            requestsForHelp._data.push(requestInfo);
            return requestsForHelp._data.length - 1;
        }
    }
};

requestsForHelp.getAll = function()
    {return this._data.filter((element) => element !== undefined);}

requestsForHelp.get = function(userId, topic)
{
    const UID = this._getUID(userId, topic);

    return (UID >= 0 ? this._data[UID] : null);
}

requestsForHelp.update = function(requestInfo)
{
    const userUID = requestInfo.userIndex;
    const topic = requestInfo.topic;
    const index = this._getUID(userUID, topic);

    if (index >= 0)
    {
        this._data[index] = requestInfo;
        return true;
    }
    else
        return false;
}

requestsForHelp.delete = function(userId, topic)
{
    const index = this._getUID(userId, topic);

    if (index < 0)
        return false;
    else
    {
        /*
        When deleting a reqeust for help, it's also necessary to delete any
        associated offers of help.
        */

        // offersOfHelp.deleteByRequestIndex(index);

        this._data[index] = undefined;

        return true;
    }
}

requestsForHelp.deleteByUserId = function(userId)
{
    let userUID = users._getUID(userId);

    if (userUID >= 0)
        this._data.forEach(function(element, index, array)
            {
                if ((element !== undefined) && (element.userIndex === userUID))
                {
                    // offersOfHelp.deleteByRequestIndex(index);
                    array[index] = undefined
                }
            });
}

requestsForHelp._getUID = function(userId, topic)
{
    const userUID = users._getUID(userId);

    return requestsForHelp._data.findIndex(function(element)
        {
            return (element !== undefined) && (element.userIndex === userUID)
                && (element.topic === topic);
        });
};

requestsForHelp._data.trim = trimArray;

// Offers of help CRUD

offersOfHelp.create = function(offerInfo)
{
    let index = this._getUID(offerInfo.userIndex,
        offerInfo.requestIndex);

    if (index >= 0)
        return -1;
    else
    {
        index = offersOfHelp.findIndex((element) => element === null)

        if (index >= 0)
        {
            offersOfHelp[index] = offerInfo;
            return index;
        }
        else
        {
            offersOfHelp.push(offerInfo);
            return offersOfHelp.length - 1;
        }
    }
}

offersOfHelp._getUID = function(userId, requestIndex)
{
    const userIndex = users._getUID(userId);

    return offersOfHelp.findIndex(function(element)
        {
            return (element !== null) && (element.userIndex === userIndex)
                && (element.requestIndex === requestIndex);
        });
};

offersOfHelp.update = function(offerInfo)
{
    let index = this._getUID(offerInfo.userIndex,
        offerInfo.requestIndex);

    if (index >= 0)
    {
        users[index] = offerInfo;
        return true;
    }
    else
        return false;
}

offersOfHelp.delete = function(userId, requestIndex)
{
    let index = this._getUID(userId, requestIndex);

    if (index >= 0)
    {
        offersOfHelp[index] = null;
        return true;
    }
    else
        return false;
}

offersOfHelp.deleteByUserId = function(userId)
{
    let userIndex = users._getUID(userId);

    if (userIndex >= 0)
        this.forEach(function(element, index, array)
            {
                if ((element !== null) && (element.userIndex === userIndex))
                    array[index] = null
            });
}

offersOfHelp.deleteByRequestIndex = function(requestIndex)
{
    if (requestIndex >= 0)
        this.forEach(function(element, index, array)
            {
                if ((element !== null) && (element.requestIndex === requestIndex))
                    array[index] = null
            });
}

offersOfHelp.trim = trimArray;

process.on("SIGINT", function (exitCode)
    {
        // users._data.trim();
        // requestsForHelp._data.trim();
        // offersOfHelp._data.trim();

        // fs.writeFileSync(usersFilename, JSON.stringify(users._data, null, 4));
        // fs.writeFileSync(requestsForHelpFilename, JSON.stringify(requestsForHelp._data, null, 4));
        // fs.writeFileSync(offersOfHelpFilename, JSON.stringify(offersOfHelp._data, null, 4));

        console.log(`Data files saved -- exit code is ${exitCode}.`);

        process.exit();
    });
