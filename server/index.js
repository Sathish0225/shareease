import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const port = process.env.PORT || 5001;

const app = express();

// cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, auth-token"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.options("*", cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
import socketIO from "socket.io";
const io = socketIO(server, { cors: { origin: "*:*" } }); // Use default export directly

global.connectedUser = {};

io.on("connection", (socket) => {
  const { id } = socket;
  let user;
  socket.on("register", (userId) => {
    user = userId;
    connectedUser[userId] = id;
  });

  socket.on("disconnect", () => {
    delete connectedUser[user];
  });

  socket.on("subscribe", (file) => {
    socket.join(file);
  });

  socket.on("unsubscribe", (file) => {
    socket.leave(file);
  });
});

global.SocketIO = { io };

// Synchronize the models with the database
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log(err));

app.use("/api/v1", routes);

server.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});

export default app;
