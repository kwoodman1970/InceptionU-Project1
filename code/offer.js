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
            response.json({msg:  `Offer ${newOffer.userUID}:${newOffer.requestUID} already in database.`});
        }
    });

offerRouter.get("/:userId/:requestUID", function(request, response)
    {
        const userId = request.params.userId;
        const requestUID = request.params.requestUID;

        let offer = offersOfHelp.get(userId, requestUID);

        if (offer !== null)
            response.json(offer);
        else
        {
            response.status = 404;
            response.json({msg:  `Offer ${userId}:${requestUID} not found.`});
        }
    });

offerRouter.patch("/", function(request, response)
    {
        const offerInfo = request.body;

        if (offersOfHelp.update(offerInfo))
            response.json({msg:  `Offer ${offerInfo.userUID}:${offerInfo.requestUID} updated.`});
        else
        {
            response.status = 404;
            response.json({msg:  `Offer ${offerInfo.userUID}:${offerInfo.requestUID} not found.`});
        }
    });

offerRouter.delete("/:userId/:requestUID", function(request, response)
{
    const userId = request.params.userId;
    const requestUID = request.params.requestUID;

        if (offersOfHelp.delete(userId, requestUID))
            response.json({msg:  `Offer ${userId}:${requestUID} deleted.`});
        else
        {
            response.status = 404;
            response.json({msg:  `Offer ${userId}:${requestUID}  not found.`});
        }
    });
