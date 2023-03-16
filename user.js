import express from "express";
import {users, requestsForHelp, offersOfHelp} from "./database.js";

export const userRouter = express.Router();

userRouter.get("/", (reqeust, response) => response.send(users));

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

userRouter.get("/", function(request, response)
    {
        if (request.body.id)
        {
            const user = request.body;

            const index = users.get(user.id);

            if ((index < users.length) || (users[index] != null))
            {
                response.json(users[index]);
            }
            else
            {
                response.status = 404;
                response.json({msg:  `User ${user.id} not found.`});
            }
        }
        else
            response.json(users);
    });

userRouter.get("/:id", function(request, response)
    {
        const id = request.params.id;

        let index = users.getIndexOf(id);

        if ((index <= 0) || (id === "0"))
            index = parseInt(request.params.id);

        if ((index < users.length) || (users[index] != null))
        {
            response.json(users[index]);
        }
        else
        {
            response.status = 404;
            response.json({msg:  `User ${id} not found.`});
        }
    });

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
        {
            response.json({msg:  `User \"${id}\" deleted.`});
        }
        else
        {
            response.status = 404;
            response.json({msg:  `User ${id} not found.`});
        }
    });
