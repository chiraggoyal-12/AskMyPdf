const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Document = require('../models/document');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Route: GET /
router.get('/', (req, res) => {
  res.render('home', {
  title: 'AskMyPDF - Upload',
  messages: {
    error: req.flash('error'),
    success: req.flash('success')
  }
});


});

// Route: POST /upload
router.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    req.flash('info', 'No file uploaded.');
    return res.redirect('/');
  }

  // Save PDF metadata in MongoDB
  const doc = new Document({
    filename: req.file.filename,
    originalname: req.file.originalname
  });

  await doc.save();

  // Redirect to chat or next step (parsing)
  req.flash('info', 'PDF uploaded successfully!');
  res.redirect(`/chat/${doc._id}`);
});

module.exports = router;
