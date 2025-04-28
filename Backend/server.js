import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/db/db.js";
import http from "http";
import initializeSocket from "./src/socketio/socket.js";

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the server
initializeSocket(server);

// Connect to the database
connectDB();

// Start the server
server.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});