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
    let UID = this.getUID(userInfo.id);

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
    const UID = this.getUID(id);

    return (UID >= 0 ? this._data[UID] : null);
}

users.update = function(userInfo)
{
    const UID = this.getUID(userInfo.id);

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

users.getUID = function(id)
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
    const userUID = users.getUID(requestInfo.userIndex);
    let index = this.getUID(userUID, requestInfo.topic);

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
    const UID = this.getUID(userId, topic);

    return (UID >= 0 ? this._data[UID] : null);
}

requestsForHelp.update = function(requestInfo)
{
    const userUID = requestInfo.userIndex;
    const topic = requestInfo.topic;
    const index = this.getUID(userUID, topic);

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
    const index = this.getUID(userId, topic);

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
    let userUID = users.getUID(userId);

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

requestsForHelp.getUID = function(userId, topic)
{
    const userUID = users.getUID(userId);

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
    let index = this.getUID(offerInfo.userIndex, offerInfo.requestIndex);

    if (index >= 0)
        return -1;
    else
    {
        index = offersOfHelp._data.findIndex((element) => element === undefined)

        if (index >= 0)
        {
            offersOfHelp._data[index] = offerInfo;
            return index;
        }
        else
        {
            offersOfHelp._data.push(offerInfo);
            return offersOfHelp._data.length - 1;
        }
    }
}

offersOfHelp.getAll = function()
    {return this._data.filter((element) => element !== undefined);}

offersOfHelp.get = function(userId, requestIndex)
{
    const UID = this.getUID(userId, requestIndex);

    return (UID >= 0 ? this._data[UID] : null);
}

offersOfHelp.getForUser = function(userId)
{
    const allOffers = this.getAll();
    const userUID = users.getUID(userId);

    return allOffers.filter((element) => requestsForHelp._data[element.requestIndex].userIndex === userUID);
}

offersOfHelp.update = function(offerInfo)
{
    let index = this.getUID(offerInfo.userIndex, offerInfo.requestIndex);

    if (index >= 0)
    {
        users._data[index] = offerInfo;
        return true;
    }
    else
        return false;
}

offersOfHelp.delete = function(userId, requestIndex)
{
    let index = this.getUID(userId, requestIndex);

    if (index >= 0)
    {
        offersOfHelp._data[index] = undefined;
        return true;
    }
    else
        return false;
}

offersOfHelp.deleteByUserId = function(userId)
{
    const userUID = users.getUID(userId);

    if (userUID >= 0)
        this._data.forEach(function(element, index, array)
            {
                if ((element !== undefined) && (element.userIndex === userUID))
                    array[index] = undefined
            });
}

offersOfHelp.deleteByRequestIndex = function(requestIndex)
{
    if (requestIndex >= 0)
        this._data.forEach(function(element, index, array)
            {
                if ((element !== undefined) && (element.requestIndex === requestIndex))
                    array[index] = undefined
            });
}

offersOfHelp.getUID = function(userId, requestIndex)
{
    const userIndex = users.getUID(userId);

    return offersOfHelp._data.findIndex(function(element)
        {
            return (element !== undefined) && (element.userIndex === userIndex)
                && (element.requestIndex === parseInt(requestIndex));
        });
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
