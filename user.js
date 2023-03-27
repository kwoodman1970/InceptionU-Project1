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

export const userRouter = express.Router();

userRouter.get("/", (request, response) => response.send(users.getAll()));

userRouter.post("/", function(request, response)
    {
        const newUser = request.body;

        const index = users.create(newUser);

        if (index >= 0)
            response.json({"UID":  index});
        else
        {
            response.status = 403;
            response.json({msg:  `User \"${newUser.id}\" already in database.`});
        }
    });

userRouter.get("/:id", function(request, response)
    {
        const id = request.params.id;
        const userInfo = users.get(id);

        if ((userInfo != null))
            response.json(userInfo);
        else
        {
            response.status = 404;
            response.json({msg:  `User ${id} not found.`});
        }
    });

userRouter.get("/:id/requests", function(request, response)
    {
        const id = request.params.id;
        const userInfo = users.get(id);

        // if ((userInfo != null))
        if (false)
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
