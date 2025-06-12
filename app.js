require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const MongoStore = require('connect-mongo');

const indexRoutes = require('./routes/index');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');



const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/askmypdf', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Add this after setting up mongoose
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/askmypdf' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session + Flash
app.use(session({
  secret: 'askmypdf_secret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Flash locals
app.use((req, res, next) => {
  res.locals.message = req.flash('info');
   res.locals.user = req.user || null;
  next();
});


// Routes
app.use('/', indexRoutes);
app.use('/chat', chatRoutes);
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 AskMyPDF running at http://localhost:${PORT}`);
});
