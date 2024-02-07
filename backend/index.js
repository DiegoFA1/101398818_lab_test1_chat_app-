const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');

const app = express();
app.use(express.json()); // Make sure it comes back as json

const SERVER_PORT = 8090

app.use(cors({
  origin  : '*'
}));

app.use(express.json());

app.use('/user', userRoutes);
// http://localhost:8090/api/v1/user/signup
// http://localhost:8090/api/v1/user/login

mongoose.connect('mongodb+srv://diego:dvD48hSyLDBEsNxX@cluster0.ma52oy9.mongodb.net/labtest', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log(`MongoDB connected ${success}`)
}).catch(err => {
  console.log(`Error while MongoDB connection ${err}`)
});


app.listen(SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${SERVER_PORT}/`)
})