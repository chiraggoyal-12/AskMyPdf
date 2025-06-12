const express = require('express');
const router = express.Router();
const Document = require('../models/document');
const ChatHistory = require('../models/chatHistory');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  const userId = req.user._id;

  const documents = await Document.find({ userId }).sort({ createdAt: -1 });

  // You can optionally count questions per document too
  const docData = await Promise.all(documents.map(async doc => {
    const count = await ChatHistory.countDocuments({ documentId: doc._id });
    return {
      _id: doc._id,
      originalname: doc.originalname,
      createdAt: doc.createdAt,
      questionCount: count
    };
  }));

  res.render('dashboard', {
    title: 'Your Dashboard',
    docs: docData
  });
});

module.exports = router;
