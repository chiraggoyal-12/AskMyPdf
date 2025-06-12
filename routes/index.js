const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Document = require('../models/document');
const Chunk = require('../models/chunk'); // ✅ Use MongoDB-based chunks
const { generateEmbedding } = require('../utils/embedding');
const { requireAuth } = require('../middleware/auth');

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

const chunkText = (text, chunkSize = 500) => {
  const words = text.split(' ');
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
};

// Route: GET /
router.get('/', requireAuth, (req, res) => {
  res.render('home', {
    title: 'AskMyPDF - Upload',
    messages: {
      error: req.flash('error'),
      success: req.flash('success')
    }
  });
});

// Route: POST /upload
router.post('/upload', requireAuth, upload.single('pdf'), async (req, res) => {
  try {
    console.log("Upload started");

    if (!req.file) {
      req.flash('error', 'No file uploaded.');
      return res.redirect('/');
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    console.log("File uploaded to:", filePath);

    const fileBuffer = fs.readFileSync(filePath);
    console.log("Read file buffer");

    const parsed = await pdfParse(fileBuffer);
    console.log("Parsed PDF");

    const text = parsed.text.trim();
    if (!text) {
      req.flash('error', 'Could not extract text. Try another PDF.');
      return res.redirect('/');
    }

    console.log("Text extracted");

    const chunks = chunkText(text);
    console.log(`Chunked text into ${chunks.length} parts`);

    const doc = new Document({
      filename: req.file.filename,
      originalname: req.file.originalname
    });
    await doc.save();
    const documentId = doc._id.toString();

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);
      await Chunk.create({
        documentId,
        text: chunks[i],
        embedding
      });
    }

    console.log("Embeddings stored");

    req.flash('success', 'PDF uploaded and processed successfully!');
    res.redirect(`/chat/${doc._id}`);

  } catch (err) {
    console.error("Upload error:", err);
    req.flash('error', 'Could not process this PDF. Try a different file.');
    res.redirect('/');
  }
});

module.exports = router;
