const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');

const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

// Configure CORS for Express
app.use(cors());

app.use(express.json());
app.use('/user', userRoutes);

// MongoDB connection
mongoose.connect('mongodb+srv://diego:dvD48hSyLDBEsNxX@cluster0.ma52oy9.mongodb.net/labtest', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log(`MongoDB connected ${success}`);
}).catch(err => {
  console.log(`Error while MongoDB connection ${err}`);
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chat messages
  socket.on('chatMessage', (message) => {
    console.log('Received message:', message);
    // Broadcast the message to all connected clients (except the sender)
    socket.broadcast.emit('message', message);
  });

  socket.on('userLoggedIn', (userData) => {
    console.log(`User ${userData.username} logged in`);
    io.emit('userLoggedIn', userData);
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const SERVER_PORT = 8090;
server.listen(SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${SERVER_PORT}/`);
});