const usersFilename = "users.json";
const requestsForHelpFilename = "reqeusts.json";
const offersOfHelpFilename = "offers.json";

export let users = [];
export let requestsForHelp = [];
export let offersOfHelp = [];

import fs from "fs";

users = JSON.stringify(fs.readFileSync(usersFilename));
requestsForHelp = JSON.stringify(fs.readFileSync(requestsForHelpFilename));
offersOfHelp = JSON.stringify(fs.readFileSync(offersOfHelpFilename));

// Users CRUD

users.getIndexOf = function(userId)
{
    return this.findIndex((element) => element.id === userId);
};

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

        let requestIndex = requestsForHelp.findIndex((element) => element.useIndex = index);

        while (requestIndex >= 0)
        {
            requestDelete(requestIndex);

            requestIndex = requestsForHelp.findIndex((element) => element.useIndex = index);
        }

        let offerIndex = offersOfHelp.findIndex((element) => element.useIndex = index);

        while (offerIndex >= 0)
        {
            offerDelete(offerIndex);

            offerIndex = offersOfHelp.findIndex((element) => element.useIndex = index);
        }

        this[index] = null;
        return true;
    }
    else
        return false;
}

// Requests for help CRUD

requestsForHelp.getIndexOf = function(userIndex, topic)
{
    return requestsForHelp.findIndex(function(element)
        {
            return (element.userIndex === userIndex)
                && (element.topic === topic);
        });
};

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

requestsForHelp.update = function(reqeustInfo)
{
    const index = users.findIndex((element) => element.id === reqeustInfo.id);

    if (index >= 0)
    {
        users[index] = reqeustInfo;
        return true;
    }
    else
        return false;
}

export function requestDelete(requestId)
{
    /*
    When deleting a reqeust for help, it's also necessary to delete any offers
    of help.
    */

    for (let offer of offersOfHelp)
    if (offer.id === index)
        offerDelete(offer.id);

    requestsForHelp[requestId] = null;
}

export function offerDelete(offerId)
{
    offersOfHelp[offerId] = null;
}

function findElementsOf(array, callback)
{
    const result = [];

    for (element of array)
    {
        if callback(element)
            result.push(element);
    }

    return result;
}