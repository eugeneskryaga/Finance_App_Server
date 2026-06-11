import express from "express";
import cors from "cors";
import transactionsRouter from "./routers/transactionsRouters.js";
import authRouter from "./routers/auth.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { connectDb } from "./db/connectDb.js";
import { errors } from "celebrate";
import "dotenv/config";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(",");

const server = express();

server.use(express.json());
server.use(cookieParser());

server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS due to untrusted origin"));
      }
    },
    credentials: true,
  }),
);

server.use("/auth", authRouter);
server.use("/transactions", transactionsRouter);

server.use(notFoundHandler);

server.use(errors());
server.use(errorHandler);

await connectDb();

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

export default server;
