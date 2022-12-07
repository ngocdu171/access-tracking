require("dotenv").config();
import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { z } from 'zod';
import mongoose from "mongoose";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({req, res});

export type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();
// const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

const users = [
    {
        id: 1,
        username: "Mr.A"
    },
    {
        id: 2,
        username: "Mr.B"
    },
    {
        id: 3,
        username: "Mr.C"
    },
]

const appRouter = router({
  hello: publicProcedure.query(() => 'Hello World!'),
  getUsers: publicProcedure.query(async () => {
    // console.log("gia tri tra ve roi nha!");
    return {
        userArrays: await users
    }
  }),
  ///////get tbl_users from mongoDB///////
  findAllUsers: publicProcedure.query(async () => {
    return await {
        message: 'findAllUsers'
    }
  })
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors({}));

// app.use(cors({
//     origin: [customConfig.origin, "http://localhost:3000"],
//     credentials: true
// }));

////////CONNECT TO MONGODB///////////////
// const mongoUrl = `mongodb+srv://BrotherD:conmemay7@cluster0.z9fbk4y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(process.env.MONGO_URL as string).then(() => console.log("MongoDB Connected") );

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
