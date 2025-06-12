const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    messages: {
      error: req.flash('error'),
      success: req.flash('success')
    }
  });
});

router.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Sign Up',
    messages: req.flash()
  });
});


router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    req.flash('error', 'Signup failed');
    res.redirect('/signup');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    req.flash('error', 'Invalid credentials');
    return res.redirect('/login');
  }
  req.session.userId = user._id;
  res.redirect('/');
});

// Logout Route
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logged out successfully.');
    res.redirect('/login');
  });
});

module.exports = router;
