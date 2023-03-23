import express from "express";
import {users, requestsForHelp} from "./database.js";

export const userRouter = express.Router();

userRouter.get("/", (request, response) => response.send(users));

userRouter.post("/", function(request, response)
    {
        const newUser = request.body;

        const index = users.create(newUser);

        if (index >= 0)
            response.json({"index":  index});
        else
        {
            response.status = 403;
            response.json({msg:  `User \"${newUser.id}\" already in database.`});
        }
    });

userRouter.get("/:id", function(request, response)
    {
        const id = request.params.id;
        const index = users.getIndexOf(id);

        if ((index >= 0) && (users[index] != null))
            response.json(users[index]);
        else
        {
            response.status = 404;
            response.json({msg:  `User ${id} not found.`});
        }
    });

userRouter.get("/:id/requests", function(request, response)
    {
        const id = request.params.id;
        const index = users.getIndexOf(id);

        if (index >= 0)
        {
            const matches = requestsForHelp.filter((element) => (element !== null) && (element.userIndex === index));

            response.json(matches);
        }
        else
        {
            response.status = 404;
            response.json({msg:  `User ${id} not found.`});
        }
    });

/*
requestRouter.get("/", function(request, response)
    {
        const topic = request.query.topic;

        if (topic)
        {
            console.log(`Got GET request for \"${topic}\"`);

            const allByTopic = requestsForHelp.filter((element) => element.topic === topic);
            const matches =

            response.json(allByTopic);
        }
        else if (userId)
        {
            console.log(`Got GET request for \"${userId}\"`);

            const allByUser = requestsForHelp.filter((element) => element.userIndex === parseInt(userId));

            response.json(allByUser);
        }
        else
        {
            console.log(`Got GET request for all`);
            response.json(requestsForHelp);
        }
    });
*/

userRouter.patch("/", function(request, response)
    {
        const userInfo = request.body;

        if (users.update(userInfo))
            response.json({msg:  `User \"${userInfo.id}\" updated.`});
        else
        {
            response.status = 404;
            response.json({msg:  `User \"${userInfo.id}\" not found.`});
        }
    });

userRouter.delete("/", function(request, response)
    {
        const id = request.body.id;

        if (users.delete(id))
            response.json({msg:  `User \"${id}\" deleted.`});
        else
        {
            response.status = 404;
            response.json({msg:  `User ${id} not found.`});
        }
    });
