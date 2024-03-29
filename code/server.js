import express from "express";
import dotenv from "dotenv";

dotenv.config();

import {userRouter} from "./user.js";
import {requestRouter} from "./request.js";
import {offerRouter} from "./offer.js";

const PORT = 5002;
const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/request", requestRouter);
app.use("/offer", offerRouter);

app.get("/", (request, response) => response.send("Server is running."));

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
