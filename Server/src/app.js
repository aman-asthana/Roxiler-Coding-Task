const express = require('express');
const app = express();

//middlewares
app.use(express.json());


//Routes
const auth = require('./routes/auth-routes')
app.use('/auth', auth)

const userRoutes = require('./routes/users-routes');
app.use('/users', userRoutes);

module.exports = app;