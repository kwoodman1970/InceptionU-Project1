import express from "express";
import {users, requestsForHelp} from "./database.js";

export const requestRouter = express.Router();

//requestRouter.get("/", (request, response) => response.send(requestsForHelp));

requestRouter.get("/", function(request, response)
    {
        const userId = request.query.userId;

        if (userId !== undefined)
        {
            console.log(`Got GET request for \"${userId}\"`);

            const userIndex = users.getIndexOf(userId);
            const user = users[userIndex];

            console.log(`userIndex = ${userIndex}, user.id = \"${user.id}\"`);

            const allForUser = requestsForHelp.filter((element) => (element !== null) && (user.topicsCanHelpWith.includes(element.topic)));

            response.json(allForUser);
        }
        else
        {
            console.log(`Got GET request for all`);
            response.json(requestsForHelp);
        }
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
            response.json({msg:  `Request \"${newRequest.id}\" already in database.`});
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

        console.log(`User Index is ${userIndex}, Topic is \"${topic}\", Index is ${index}`);

        if (index >= 0)
        {
            response.json(requestsForHelp[index]);
        }
        else
        {
            response.status = 404;
            response.json({msg:  `Request \"${userIndex}:  ${topic}\" not found.`});
        }
    });

requestRouter.patch("/", function(request, response)
    {
        const requestInfo = request.body;

        if (requestsForHelp.update(requestInfo))
            response.json({msg:  `Request \"${requestInfo.userIndex}:  ${requestInfo.topic}\" updated.`});
        else
        {
            response.status = 404;
            response.json({msg:  `Request \"${requestInfo.userIndex}:  ${requestInfo.topic}\" not found.`});
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
