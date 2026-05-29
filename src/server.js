import express from "express";
import cors from "cors";
import transactionsRouter from "./routers/transactionsRouters.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { connectDb } from "./db/connectDb.js";
import { errors } from "celebrate";
import "dotenv/config";

const PORT = process.env.PORT;

const server = express();

server.use(express.json());

server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

server.use(transactionsRouter);

server.use(notFoundHandler);

server.use(errors());
server.use(errorHandler);

await connectDb();

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

export default server;
