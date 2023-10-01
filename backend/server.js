const express = require("express");
const chats = require("./data/data");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleWare");
const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*", // Replace with your frontend's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// Use cors middleware with options
app.use(cors(corsOptions));

dotenv.config();
connectDb();
app.use("*", (req, res, next) => {
  console.log("say hi", req.originalUrl);
  next();
});
app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.get("/api/chats/:id", (req, res) => {
  console.log("reached here");
  const id = req.params.id;
  console.log(id);

  const chat = chats.find((chat) => chat._id == id);
  res.send(chat);
});

app.use("*", notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server started on port 5000");
});
