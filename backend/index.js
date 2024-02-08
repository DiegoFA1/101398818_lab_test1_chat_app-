const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');
const chatRoutes = require('./routes/ChatRoutes');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

var groupMessage = require('./models/GroupMessage')
// Configure CORS for Express
app.use(cors({
  origin: '*'
}));

app.use(express.json());
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

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
  socket.on('userLoggedIn', (userData) => {
    console.log(`User ${userData.username} logged in`);

    io.emit('userLoggedIn', userData);
  });

  socket.on('chatMessage', (message) => {
    console.log('Socket received message:', message);

    io.emit('chatMessage', message);
  });

  socket.on('join', (userData, group) => {
    console.log(`User ${userData} joined group ${group}`);
    io.emit('join', userData);
  });


  socket.on('groupLeft', (userData,group) => {
    console.log(`User ${userData} left group ${group}`);
    
    const message = new groupMessage({
      from_user: userData,
      message: userData + ' Left the group',
      date_sent: new Date(),
      room: group
    });
    message.save();
    io.emit('groupLeft', message);
    
  });

  
});

const SERVER_PORT = process.env.PORT || 8090;
server.listen(SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${SERVER_PORT}/`);
});

const path = require('path')

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')))

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../frontend/build/index.html'))
})