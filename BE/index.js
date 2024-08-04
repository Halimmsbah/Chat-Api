import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { connectDB } from './db.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { messageModel, userModel } from './models.js';

dotenv.config();
const app = express();

connectDB();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  console.log(socket.id);

  socket.on("updateSocketId", async (data) => {
    if (!data.token) return;
    const { token } = data;
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const { _id } = decoded;
      await userModel.findOneAndUpdate({ _id }, { socketId: socket.id });
    } catch (error) {
      console.log(error);
      return;
    }
  });

  socket.on("getMessage", async (data) => {
    if (!data.token || !data.to) return;
    const { token, to } = data;

    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const { _id } = decoded;
      const messages = await messageModel.find({
        $or: [
          { from: _id, to },
          { from: to, to: _id }
        ]
      });

      socket.emit("retrievedMessages", { messages });
    } catch (error) {
      console.log(error);
      return;
    }
  });

  socket.on("addMessage", async (data) => {
    if (!data.token || !data.to || !data.text) return;
    const { token, to, text } = data;
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const { _id } = decoded;
      const message = await messageModel.create({ from: _id, to, text });
      const user = await userModel.findById(to);
      io.to(user.socketId).emit("newMessage", { message });
    } catch (error) {
      console.log(error);
      return;
    }
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
