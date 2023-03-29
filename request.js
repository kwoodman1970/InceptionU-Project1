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
        const allRequests = requestsForHelp.getAll();

        if (userId !== undefined)
        {
            const userInfo = users.get(request.query.userId);

            if (userInfo !== null)
            {
                const allForUser = allRequests.filter((element) => userInfo.topicsCanHelpWith.includes(element.topic));

                response.json(allForUser);
            }
            else
                response.json([]);
        }
        else
            response.json(allRequests);
    });

requestRouter.post("/", function(request, response)
    {
        const newRequest = request.body;

        const UID = requestsForHelp.create(newRequest);

        if (UID !== null)
            response.json({"UID":  UID});
        else
        {
            response.status = 403;
            response.json({msg:  `Request ${newRequest.userIndex}:  \"${newRequest.topic}\" already in database.`});
        }
    });

requestRouter.get("/:topic", function(request, response)
    {
        const topic = request.params.topic;
        const allRequests = requestsForHelp.getAll();
        const matches = allRequests.filter((element) => element.topic === topic);

        response.json(matches);
    });

requestRouter.get("/:topic/:userId", function(request, response)
    {
        const topic = request.params.topic;
        const userId = request.params.userId;
        const requestInfo = requestsForHelp.get(userId, topic);

        if (requestInfo !== null)
            response.json(requestInfo);
        else
        {
            response.status = 404;
            response.json({msg:  `Request ${userId}:  \"${topic}\" not found.`});
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

requestRouter.delete("/:topic/:userId", function(request, response)
    {
        const topic = request.params.topic;
        const userId = request.params.userId;

        if (requestsForHelp.delete(userId, topic))
            response.json({msg:  `Request ${userId}:  \"${topic}\" deleted.`});
        else
        {
            response.status = 404;
            response.json({msg:  `Request ${userId}:  \"${topic}\" not found.`});
        }
    });
