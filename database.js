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

function trimArray(array)
{
    let lastNonNullIndex = array.findLastIndex((element) => element !== null);

    if (lastNonNullIndex >= 0)
        array.splice(lastNonNullIndex + 1);
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

    function nullifyAssociated(element, i, array)
    {
        if ((element !== null) && (element.userIndex === index))
            array[i] = null;
    }

    if (index >= 0)
    {
        /*
        When deleting a user, it's also necessary to delete their requests for
        help and their offers of help.
        */

        requestsForHelp.forEach(nullifyAssociated);
        offersOfHelp.forEach(nullifyAssociated);

        this[index] = null;

        trimArray(requestsForHelp);
        trimArray(offersOfHelp);
        trimArray(this);

        return true;
    }
    else
        return false;
}

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
    console.log(`Got delete request for ${userIndex}:  \"${requestIndex}\".`);

    const index = this.getIndexOf(userIndex, requestIndex);

    if (index < 0)
        return false;
    else
    {
        function nullifyAssociated(element, i, array)
        {
            if ((element !== null) && (element.userIndex === index))
                array[i] = null;
        }

        /*
        When deleting a reqeust for help, it's also necessary to delete any
        associated offers of help.
        */

        offersOfHelp.forEach(nullifyAssociated);

        this[index] = null;

        trimArray(offersOfHelp);
        trimArray(this);

        return true;
    }
}

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
    console.log(offerInfo);

    let index = this.getIndexOf(offerInfo.userIndex,
        offerInfo.requestIndex);

    console.log(index);

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

/*
console.log(users[0]);
console.log(requestsForHelp[0]);
console.log(offersOfHelp[0]);

console.log("Deleting user...");
users.delete("Noah E. Tall");
console.log(requestsForHelp[0]);
console.log(offersOfHelp[0]);
*/