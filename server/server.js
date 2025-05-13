const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (or specify your frontend URL)
    methods: ["GET", "POST"]
  }
});

app.use(cors()); // Apply CORS middleware

let videoState = { videoId: "", time: 0 };
let userCount = 0;

io.on("connection", (socket) => {
  userCount++;
  io.emit("userCountUpdate", userCount);

  socket.emit("syncState", videoState);

  socket.on("updateVideo", (data) => {
    videoState = data;
    io.emit("syncState", videoState);
  });

  socket.on("disconnect", () => {
    userCount = Math.max(userCount - 1, 0);
    io.emit("userCountUpdate", userCount);
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
