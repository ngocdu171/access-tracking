import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";

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
});

const app = express();
const port = 4000;
app.use(cors({}));

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
