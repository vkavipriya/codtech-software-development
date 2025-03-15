const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

let documents = {}; // Store documents in memory (Use DB in production)

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join-document", (docId) => {
    socket.join(docId);
    socket.emit("load-document", documents[docId] || "");
  });

  socket.on("edit-document", ({ docId, content }) => {
    documents[docId] = content;
    socket.to(docId).emit("update-document", content);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
