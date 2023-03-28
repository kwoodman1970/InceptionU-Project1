import express from "express";
import dotenv from "dotenv";

dotenv.config();

let imports = null;

if (process.env.DB === "JSON")
    imports = await import("./database.js");
else if  (process.env.DB === "MongoDB")
    imports = await import("./mongodb.js");
else
    throw new Error(`Database specified in \".env\" (\"${process.env.DB}\") not supported.`);

const users = imports.users;
const requestsForHelp = imports.requestsForHelp;
const offersOfHelp = imports.offersOfHelp;

export const offerRouter = express.Router();

offerRouter.get("/", function(request, response)
    {
        const userId = request.query.userId;
        const allOffers = offersOfHelp.getAll();

        if (userId !== undefined)
            response.json(offersOfHelp.getForUser(userId));
        else
            response.json(allOffers);
    });

offerRouter.post("/", function(request, response)
    {
        const newOffer = request.body;

        const UID = offersOfHelp.create(newOffer);

        if (UID !== null)
            response.json({"UID":  UID});
        else
        {
            response.status = 403;
            response.json({msg:  `Offer ${newOffer.userIndex}:${newOffer.requestIndex} already in database.`});
        }
    });

offerRouter.get("/:userId/:requestId", function(request, response)
    {
        const userId = request.params.userId;
        const requestId = request.params.requestId;

        let offer = offersOfHelp.get(userId, requestId);

        if (offer !== null)
            response.json(offer);
        else
        {
            response.status = 404;
            response.json({msg:  `Offer ${userId}:${requestId} not found.`});
        }
    });

offerRouter.patch("/", function(request, response)
    {
        const offerInfo = request.body;

        if (offersOfHelp.update(offerInfo))
            response.json({msg:  `Offer ${offerInfo.userIndex}:${offerInfo.requestIndex} updated.`});
        else
        {
            response.status = 404;
            response.json({msg:  `Offer ${offerInfo.userIndex}:${offerInfo.requestIndex} not found.`});
        }
    });

offerRouter.delete("/", function(request, response)
    {
        const userId = request.body.userIndex;
        const requestId = request.body.requestIndex;

        if (offersOfHelp.delete(userId, requestId))
            response.json({msg:  `Offer ${userId}:${requestId} deleted.`});
        else
        {
            response.status = 404;
            response.json({msg:  `Offer ${userId}:${requestId}  not found.`});
        }
    });
