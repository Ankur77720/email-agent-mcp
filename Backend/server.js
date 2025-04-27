import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/db/db.js";
import { Server } from "socket.io";
import userModel from "./src/models/user.model.js";
import http from "http";
import getResponse from "./src/service/ai.service.js";

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: [ "GET", "POST" ],
        credentials: true,
    },
});

io.use(async (socket, next) => {
    const cookie = socket.handshake.headers.cookie;

    if (!cookie) {
        return next(new Error("Authentication error"));
    }

    const token = cookie.split(";")[ 1 ].split("=")[ 1 ];
    if (!token) {
        return next(new Error("Authentication error"));
    }

    const user = await userModel.authToken(token);
    if (!user) {
        return next(new Error("Authentication error"));
    }
    socket.user = user;

    next();
})

io.on("connection", (socket) => {
    console.log("New client connected");


    socket.on("message", async (data) => {
        const { message } = data;


        const response = await getResponse(message);

        console.log("Response from AI:", response);

        socket.emit("message", response);

    })


    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

connectDB()
server.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
})