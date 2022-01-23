import app from "./server.js";
import { socketIOServer } from "./socket.js";
import dotenv from "dotenv";
import "process";
import mongoose from "mongoose";
dotenv.config();

// exiting server on interrupt - CTRL + C
process.on("SIGINT", () => {
  console.info("Exiting\n");
  process.exit(0);
});

// Port
const PORT = process.env.PORT || 5000;

// Connect to DB
const uri = process.env.DB_CONNECTION;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(uri, connectionParams)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

// Listening for Requests
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});

// Listening to SocketIO Requests
socketIOServer.listen(3000, () => {
  console.log("Socket IO on port 3000");
});
