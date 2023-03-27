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

export const requestRouter = express.Router();

requestRouter.get("/", function(request, response)
    {
        const userId = request.query.userId;

        if (userId !== undefined)
        {
            const userIndex = users.getIndexOf(userId);
            const user = users[userIndex];
            const allForUser = requestsForHelp.filter((element) => (element !== null) && (user.topicsCanHelpWith.includes(element.topic)));

            response.json(allForUser);
        }
        else
            response.json(requestsForHelp);
    });

requestRouter.post("/", function(request, response)
    {
        const newRequest = request.body;

        const index = requestsForHelp.create(newRequest);

        if (index >= 0)
            response.json({"index":  index});
        else
        {
            response.status = 403;
            response.json({msg:  `Request ${newRequest.userIndex}:  \"${newRequest.topic}\" already in database.`});
        }
    });

requestRouter.get("/:topic", function(request, response)
    {
        const topic = request.params.topic;
        const matches = requestsForHelp.filter((element) => (element !== null) && (element.topic === topic));

        response.json(matches);
    });

requestRouter.get("/:topic/:userIndex", function(request, response)
    {
        const topic = request.params.topic;
        const userIndex = parseInt(request.params.userIndex);
        const index = requestsForHelp.getIndexOf(userIndex, topic);

        if (index >= 0)
            response.json(requestsForHelp[index]);
        else
        {
            response.status = 404;
            response.json({msg:  `Request ${userIndex}:  \"${topic}\" not found.`});
        }
    });

requestRouter.patch("/", function(request, response)
    {
        const requestInfo = request.body;

        if (requestsForHelp.update(requestInfo))
            response.json({msg:  `Request ${requestInfo.userIndex}:  \"${requestInfo.topic}\" updated.`});
        else
        {
            response.status = 404;
            response.json({msg:  `Request ${requestInfo.userIndex}:  \"${requestInfo.topic}\" not found.`});
        }
    });

requestRouter.delete("/", function(request, response)
    {
        const userIndex = request.body.userIndex;
        const topic = request.body.topic;

        if (requestsForHelp.delete(userIndex, topic))
            response.json({msg:  `Request ${userIndex}:  \"${topic}\" deleted.`});
        else
        {
            response.status = 404;
            response.json({msg:  `Request ${userIndex}:  \"${topic}\"  not found.`});
        }
    });
