import express from "express";
import {users, requestsForHelp, offersOfHelp} from "./database.js";

export const offerRouter = express.Router();

//offerRouter.get("/", (request, response) => response.send(offersOfHelp));

offerRouter.get("/", function(request, response)
    {
        const userId = request.query.userId;

        if (userId !== undefined)
        {
            console.log(`Got GET request for \"${userId}\"`);

            const userIndex = users.getIndexOf(userId);
            const user = users[userIndex];

            console.log(`userIndex = ${userIndex}, user.id = \"${user.id}\"`);

            const allForUser = offersOfHelp.filter((element) => (element !== null) && (requestsForHelp[element.requestIndex].userIndex === userIndex));

            response.json(allForUser);
        }
        else
        {
            console.log(`Got GET request for all`);
            response.json(offersOfHelp);
        }
    });

offerRouter.post("/", function(request, response)
    {
        const newOffer = request.body;

        const index = offersOfHelp.create(newOffer);

        if (index >= 0)
            response.json({"index":  index});
        else
        {
            response.status = 403;
            response.json({msg:  `offer \"${newrequest.id}\" already in database.`});
        }
    });

offerRouter.get("/:userIndex/:requestId", function(request, response)
    {
        const userIndex = parseInt(request.params.userIndex);
        const requestId = parseInt(request.params.requestId);

        let index = offersOfHelp.getIndexOf(userIndex, requestId);

        console.log(`User Index is ${userIndex}, requestId is ${requestId}, Index is ${index}`);

        if (index >= 0)
        {
            response.json(offersOfHelp[index]);
        }
        else
        {
            response.status = 404;
            response.json({msg:  `offer \"${userIndex}:  ${requestId}\" not found.`});
        }
    });

offerRouter.patch("/", function(request, response)
    {
        const offerInfo = request.body;

        if (offersOfHelp.update(offerInfo))
            response.json({msg:  `offer ${offerInfo.userIndex}:${offerInfo.requestIndex} updated.`});
        else
        {
            response.status = 404;
            response.json({msg:  `offer ${offerInfo.userIndex}:${offerInfo.requestIndex} not found.`});
        }
    });

offerRouter.delete("/", function(request, response)
    {
        const userIndex = request.body.userIndex;
        const requestIndex = request.body.requestIndex;

        if (offersOfHelp.delete(userIndex, requestIndex))
            response.json({msg:  `offer ${userIndex}:${requestIndex} deleted.`});
        else
        {
            response.status = 404;
            response.json({msg:  `offer ${userIndex}:${requestIndex}  not found.`});
        }
    });
