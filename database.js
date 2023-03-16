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

users.getIndexOf = function(userId)
{
    return this.findIndex((element) => element.id === userId);
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
        if (element.userIndex === index)
            array[i] = null
    }

    if (index >= 0)
    {
        /*
        When deleting a user, it's also necessary to delete their requests for
        help and their offers of help.
        */

        requestsForHelp.forEach(nullifyAssociated);
        offersOfHelp.forEach(nullifyAssociated);

        trimArray(requestsForHelp);
        trimArray(offersOfHelp);

        /*
        let offerIndex = offersOfHelp.findIndex((element) => element.useIndex = index);

        while (offerIndex >= 0)
        {
            offerDelete(offerIndex);

            offerIndex = offersOfHelp.findIndex((element) => element.useIndex = index);
        }
        */

        this[index] = null;

        this(requestsForHelp);

        return true;
    }
    else
        return false;
}

// Requests for help CRUD

requestsForHelp.create = function(requestInfo)
{
    let index = this.getIndexOf(requestInfo.userIndex,
        requestInfo.topic);

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
}

requestsForHelp.getIndexOf = function(userIndex, topic)
{
    return requestsForHelp.findIndex(function(element)
        {
            return (element.userIndex === userIndex)
                && (element.topic === topic);
        });
};

requestsForHelp.update = function(requestInfo)
{
    let index = this.getIndexOf(requestInfo.userIndex,
        requestInfo.topic);

    if (index >= 0)
    {
        users[index] = requestInfo;
        return true;
    }
    else
        return false;
}

requestsForHelp.delete = function(userIndex, topic)
{
    let index = this.getIndexOf(userIndex, topic);

    function nullifyAssociated(element, i, array)
    {
        if (element.userIndex === index)
            array[i] = null
    }

    /*
    When deleting a reqeust for help, it's also necessary to delete any
    associated offers of help.
    */

    offersOfHelp.forEach(nullifyAssociated);

    this[index] = null;

    trimArray(this);
    trimArray(offersOfHelp);
}

// Offers of help CRUD

offersOfHelp.create = function(offerInfo)
{
    let index = this.getIndexOf(offerInfo.userIndex,
        offerInfo.topic);

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

offersOfHelp.getIndexOf = function(userIndex, requestIndex)
{
    return offersOfHelp.findIndex(function(element)
        {
            return (element.userIndex === userIndex)
                && (element.requestIndex === requestIndex);
        });
};

offersOfHelp.update = function(reqeustInfo)
{
    let index = this.getIndexOf(offerInfo.userIndex,
        offerInfo.topic);

    if (index >= 0)
    {
        users[index] = reqeustInfo;
        return true;
    }
    else
        return false;
}

offersOfHelp.delete = function(userIndex, requestIndex)
{
    let index = this.getIndexOf(userIndex, requestIndex);

    offersOfHelp[index] = null;
}

console.log(users[0]);
console.log(requestsForHelp[0]);
console.log(offersOfHelp[0]);

console.log("Deleting user...");
users.delete("Noah E. Tall");
console.log(requestsForHelp[0]);
console.log(offersOfHelp[0]);
