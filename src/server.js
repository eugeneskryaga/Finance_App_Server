import express from "express";
import transactionsRouter from "./routers/transactionsRouters.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { connectDb } from "./db/connectDb.js";
import "dotenv/config";
import { errors } from "celebrate";

const PORT = process.env.PORT;

const server = express();

server.use(express.json());

app.use(
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
