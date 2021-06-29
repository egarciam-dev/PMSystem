const path = require('path');
const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const env = require('dotenv').load();
const flash = require('connect-flash');

// Connect flash
app.use(flash());
  
// BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport
app.use(
    session({ secret: 'rHUyjs6RmVOD06OdOTsVAyUUCxVXaWci', resave: true, saveUninitialized: true })
); // session secret
app.use(passport.initialize());
app.use(passport.session());

// Express static assets
app.use(express.static("public"));

// Access public folder from root
app.use("/public", express.static("public"));

// Routes
const authRoute = require('./routes/router.js')(app, passport);

// Mobile Routes
const mobileRouter = require('./mobile/router.js')(app);

//For set layouts of html view
var expressLayouts = require("express-ejs-layouts");
const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);
app.set("view engine", "ejs");
app.use(expressLayouts);

// Dashboard Routes
const DashRoutes = require('./routes/DashRoutes.js')(app, passport);

// Models
const models = require('./models');

// Associations

//Destacamento
models.Destacamento.hasMany(models.Patrulla, {
  foreignKey: 'destacamentoID',
  allowNull: false
});

models.Patrulla.belongsTo(models.Destacamento, {foreignKey: 'destacamentoID'});

models.Destacamento.hasMany(models.Oficial, {
  foreignKey: 'destacamentoID',
  allowNull: false
});

models.Oficial.belongsTo(models.Destacamento, {foreignKey: 'destacamentoID'});

models.Destacamento.hasMany(models.Incidente, {
  foreignKey: 'destacamentoID',
  allowNull: false
});

models.Incidente.belongsTo(models.Destacamento, {foreignKey: 'destacamentoID'});

models.Destacamento.hasMany(models.user, {
  foreignKey: 'destacamentoID',
  allowNull: false
});

models.user.belongsTo(models.Destacamento, {foreignKey: 'destacamentoID'});

models.Destacamento.hasOne(models.Zona, {
  foreignKey: 'destacamentoID',
  allowNull: false
});

models.Destacamento.hasOne(models.Ubicacion, {
  foreignKey: 'destacamentoID',
  allowNull: true
});

// Patrulla
models.Patrulla.hasMany(models.Medicion, {
  foreignKey: 'patrullaID',
  allowNull: false
});

models.Medicion.belongsTo(models.Patrulla, {foreignKey: 'patrullaID'});

models.Patrulla.hasMany(models.Falla, {
  foreignKey: 'patrullaID',
  allowNull: false
});

models.Falla.belongsTo(models.Patrulla, {foreignKey: 'patrullaID'});

models.Patrulla.hasMany(models.Ubicacion, {
  foreignKey: 'patrullaID',
  allowNull: true
});


// Load passport strategies
require('./config/passport/passport.js')(passport, models.user);
require('./mobile/passport.js')(passport);

// Sync Database
models.sequelize
  .sync()
  .then(function() {
    
    console.log('Database Connected');

    app.listen(8000, function(err) {
      if (!err) console.log('Connected at http://localhost:8000');
      else console.log(err);
    });
  })
  .catch(function(err) {
    console.log(err, 'Error on Database Sync. Please try again!');
  });
