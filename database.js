//const directory = "/c/Projects/Project1/code/";
const directory = "";
const usersFilename = "users.json";
const requestsForHelpFilename = "requests.json";
const offersOfHelpFilename = "offers.json";

export let users = [];
export let requestsForHelp = [];
export let offersOfHelp = [];

import fs from "fs";

users = JSON.parse(fs.readFileSync(directory + usersFilename));
requestsForHelp = JSON.parse(fs.readFileSync(directory + requestsForHelpFilename));
offersOfHelp = JSON.parse(fs.readFileSync(directory + offersOfHelpFilename));

function trimArray()
{
    while ((this.length > 0) && (this[this.length - 1] === null))
        this.pop();
}

// Users CRUD

users.create = function(userInfo)
{
    let index = this.getIndexOf(userInfo.id);

    if (index >= 0)
        return -1;
    else
    {
        index = this.findIndex((element) => element === null)

        if (index >= 0)
        {
            this[index] = userInfo;
            return index;
        }
        else
        {
            this.push(userInfo);
            return this.length - 1;
        }
    }
};

users.getIndexOf = function(id)
{
    const isAllDigits = /^\d+$/;

    if(isAllDigits.test(id))
        return parseInt(id);
    else
        return this.findIndex(function(element)
            {
                return (element !== null) && (element.id === id);
            });
};

users.update = function(userInfo)
{
    const index = this.getIndexOf(userInfo.id);

    if (index < 0)
        return false;
    else
    {
        this[index] = userInfo;
        return true;
    }
}

users.delete = function(userId)
{
    const index = this.getIndexOf(userId);

    if (index >= 0)
    {
        /*
        When deleting a user, it's also necessary to delete their requests for
        help and their offers of help.
        */

        requestsForHelp.deleteByUserId(index);
        offersOfHelp.deleteByUserId(index);

        this[index] = null;

        return true;
    }
    else
        return false;
}

users.trim = trimArray;

// Requests for help CRUD

requestsForHelp.create = function(requestInfo)
{
    const userId = requestInfo.userId;
    const requestIndex = requestInfo.requestIndex;

    let index = this.getIndexOf(userId, requestIndex);

    if (index >= 0)
        return -1;
    else
    {
        index = requestsForHelp.findIndex((element) => element === null)

        if (index >= 0)
        {
            requestsForHelp[index] = requestInfo;
            return index;
        }
        else
        {
            requestsForHelp.push(requestInfo);
            return requestsForHelp.length - 1;
        }
    }
};

requestsForHelp.getIndexOf = function(userId, topic)
{
    const userIndex = users.getIndexOf(userId);

    return requestsForHelp.findIndex(function(element)
        {
            return (element !== null) && (element.userIndex === userIndex)
                && (element.topic === topic);
        });
};

requestsForHelp.update = function(requestInfo)
{
    const userIndex = requestInfo.userIndex;
    const topic = requestInfo.topic;
    const index = this.getIndexOf(userIndex, topic);

    if (index >= 0)
    {
        this[index] = requestInfo;
        return true;
    }
    else
        return false;
}

requestsForHelp.delete = function(userIndex, requestIndex)
{
    console.log(`Got delete request for ${userIndex}:  ${requestIndex}.`);

    const index = this.getIndexOf(userIndex, requestIndex);

    if (index < 0)
        return false;
    else
    {
        /*
        When deleting a reqeust for help, it's also necessary to delete any
        associated offers of help.
        */

        offersOfHelp.deleteByRequestIndex(index);

        this[index] = null;

        return true;
    }
}

requestsForHelp.deleteByUserId = function(userId)
{
    let userIndex = users.getIndexOf(userId);

    if (userIndex >= 0)
        this.forEach(function(element, index, array)
            {
                if ((element !== null) && (element.userIndex === userIndex))
                {
                    offersOfHelp.deleteByRequestIndex(index);
                    array[index] = null
                }
            });
}

requestsForHelp.trim = trimArray;

// Offers of help CRUD

offersOfHelp.create = function(offerInfo)
{
    let index = this.getIndexOf(offerInfo.userIndex,
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

offersOfHelp.getIndexOf = function(userId, requestIndex)
{
    const userIndex = users.getIndexOf(userId);

    return offersOfHelp.findIndex(function(element)
        {
            return (element !== null) && (element.userIndex === userIndex)
                && (element.requestIndex === requestIndex);
        });
};

offersOfHelp.update = function(offerInfo)
{
    let index = this.getIndexOf(offerInfo.userIndex,
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
    let index = this.getIndexOf(userId, requestIndex);

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
    let userIndex = users.getIndexOf(userId);

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
        users.trim();
        requestsForHelp.trim();
        offersOfHelp.trim();

        fs.writeFileSync(directory + usersFilename, JSON.stringify(users, null, 4));
        fs.writeFileSync(directory + requestsForHelpFilename, JSON.stringify(requestsForHelp, null, 4));
        fs.writeFileSync(directory + offersOfHelpFilename, JSON.stringify(offersOfHelp, null, 4));

        console.log(`Data files saved -- exit code is ${exitCode}.`);

        process.exit();
    });
