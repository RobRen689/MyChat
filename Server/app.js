import { port } from "./config.mjs";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
app.use(express.static("public"));
let httpServer = http.createServer(app);
app.get("/", (req, res) => res.send("<h1>Hello World From Express</h1>"));

// Socket.io server
const io = new Server(httpServer, {});
// main socket routine
io.on("connection", (socket) => {
    console.log("new connection established");

    socket.on('join', (client) => {
        socket.name = client.name;
        socket.join(client.room);
        console.log(`${socket.name} joined room ${client.room}`);
        socket.emit(
            "welcome",
            `Welcome ${socket.name}, currently there are ${getNumberofUsersInRoom(client.room)} clients in room ${client.room} room`
        );

        socket.to(client.room).emit("newClient", `${socket.name} has joined this room`);
    });
});

const getNumberofUsersInRoom = (room) => 
    io.sockets.adapter.rooms.get(room)?.size;

// will pass 404 to error handler
app.use((req, res, next) => {
    const error = new Error("No such route found");
    error.status = 404;
    next(error);
});
// error handler middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
        },
    });
});
httpServer.listen(port, () => {
    console.log(`listening on port ${port}`);
});