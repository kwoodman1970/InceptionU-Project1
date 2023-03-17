import express from "express";
import {offersOfHelp} from "./database.js";

export const offerRouter = express.Router();

offerRouter.get("/", (request, response) => response.send(offersOfHelp));

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
            response.json({msg:  `offer \"${offerInfo.userIndex}:  ${offerInfo.requestId}\" updated.`});
        else
        {
            response.status = 404;
            response.json({msg:  `offer \"${offerInfo.userIndex}:  ${offerInfo.requestId}\" not found.`});
        }
    });

offerRouter.delete("/", function(request, response)
    {
        const userIndex = request.body.userIndex;
        const requestId = request.body.requestId;

        if (offersOfHelp.delete(userIndex, requestId))
            response.json({msg:  `offer ${userIndex}:  \"${requestId}\" deleted.`});
        else
        {
            response.status = 404;
            response.json({msg:  `offer ${userIndex}:  \"${requestId}\"  not found.`});
        }
    });
