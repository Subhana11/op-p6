// importation du package express
const express =require ('express');
// imporattion du package bodyParser
const bodyParser= require ('express');
// importation du package mongoose
const mongoose = require('mongoose');
// importation du package path
const path = require('path');

require("dotenv").config();

const saucesRoutes= require('./routes/sauces');
const userRoutes = require('./routes/user');
// connection à MongoDB 
mongoose.connect(process.env.DB_URL,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  // qui peut accéder à l'api
    res.setHeader('Access-Control-Allow-Origin', '*');
    // quels headers sont authorisés
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // quels methods sont possible
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyParser.json());
  // gestion des routes principal
  app.use ('/api/sauces', saucesRoutes);
  app.use ('/api/auth', userRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images')));

  module.exports = app;