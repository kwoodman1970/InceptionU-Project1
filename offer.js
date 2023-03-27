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

        if (userId !== undefined)
        {
            const userIndex = users.getIndexOf(userId);
            const allForUser = offersOfHelp.filter((element) => (element !== null) && (requestsForHelp[element.requestIndex].userIndex === userIndex));

            response.json(allForUser);
        }
        else
            response.json(offersOfHelp);
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
            response.json({msg:  `offer ${newrequest.userIndex}:${newrequest.requestIndex} already in database.`});
        }
    });

offerRouter.get("/:userIndex/:requestIndex", function(request, response)
    {
        const userIndex = parseInt(request.params.userIndex);
        const requestIndex = parseInt(request.params.requestIndex);

        let index = offersOfHelp.getIndexOf(userIndex, requestIndex);

        if (index >= 0)
            response.json(offersOfHelp[index]);
        else
        {
            response.status = 404;
            response.json({msg:  `offer ${userIndex}:${requestIndex} not found.`});
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
