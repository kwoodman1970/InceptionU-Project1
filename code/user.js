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

userRouter.get("/", async (request, response) => response.send(await users.getAll()));

userRouter.post("/", async function(request, response)
    {
        const newUser = request.body;

        const UID = await users.create(newUser);

        if (UID !== null)
            response.json({"UID":  UID});
        else
        {
            response.status = 403;
            response.json({msg:  `User \"${newUser.name}\" already in database.`});
        }
    });

userRouter.get("/:id", async function(request, response)
    {
        const id = request.params.id;
        const userInfo = await users.get(id);

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
        const UID = users.getUID(id);

        if (UID != null)
        {
            const allRequests = requestsForHelp.getAll();
            const matches = allRequests.filter((element) => element.userUID === UID);

            response.json(matches);
        }
        else
        {
            response.status = 404;
            response.json({msg:  `User ${id} not found.`});
        }
    });

userRouter.patch("/", async function(request, response)
    {
        const userInfo = request.body;

        if (await users.update(userInfo))
            response.json({msg:  `User \"${userInfo.name}\" updated.`});
        else
        {
            response.status = 404;
            response.json({msg:  `User \"${userInfo.name}\" not found.`});
        }
    });

userRouter.delete("/:id", async function(request, response)
    {
        const id = request.params.id;

        if (await users.delete(id))
            response.json({msg:  `User \"${id}\" deleted.`});
        else
        {
            response.status = 404;
            response.json({msg:  `User ${id} not found.`});
        }
    });
