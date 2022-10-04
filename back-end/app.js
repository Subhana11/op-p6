const express =require ('express');
const bodyParser= require ('express');
const mongoose = require('mongoose');

const saucesRoutes= require('./routes/sauces.js');
const userRoutes = require('./routes/user.js');

mongoose.connect('mongodb+srv://SRAZA:Mongodb1@cluster1.4aaysyn.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyParser.json());

  app.use ('/api/sauces', saucesRoutes);
  app.use ('/api/auth',userRoutes);

  module.exports = app;