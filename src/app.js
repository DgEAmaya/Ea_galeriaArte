const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const expressLayouts = require('express-ejs-layouts');

dotenv.config();
const app = express();
const db = require('./config/database');

const sessionStore = new MySQLStore({}, db);

app.use(session({
  secret: 'galeria_secreta',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);



app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

//configuracion de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

// Rutas publicas
app.use('/', require('./routes/index.routes'));

app.use('/admin', require('./routes/admin.routes'));

// Rutas privadas administrador

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
