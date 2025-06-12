const express = require('express');
const router = express.Router();
const Document = require('../models/document');
const { generateEmbedding } = require('../utils/embedding');
const { searchEmbedding } = require('../utils/vectordb');
const { chatWithContext } = require('../utils/ollamaChat');
const { requireAuth } = require('../middleware/auth');
const ChatHistory = require('../models/chatHistory');

// Route: GET /chat/:id
router.get('/:id',requireAuth, async (req, res) => {
  const documentId = req.params.id;
  const doc = await Document.findById(documentId);
  if (!doc) return res.status(404).send('Document not found');
  
  res.render('chat', {
    documentId,
    question: null,
    answer: null,
    title: 'AskMyPDF - Chat'
  });
});

// Route: POST /chat/:id
router.post('/:id', requireAuth, async (req, res) => {
  try {
    const documentId = req.params.id;
    const question = req.body.question;

    console.log("Generating embedding...");
    const questionEmbedding = await generateEmbedding(question);

    console.log("Searching for context...");
    const results = await searchEmbedding(questionEmbedding, documentId);
    const context = results.map(r => r.text || '').join('\n\n');

    console.log("Calling Ollama...");
    const answer = await chatWithContext(question, context);

    const userId = req.user && req.user._id ? req.user._id : undefined;

    await ChatHistory.create({
      documentId,
      question,
      answer,
      userId
    });

    res.render('chat', {
      documentId,
      question,
      answer,
      title: 'AskMyPDF - Chat'
    });
  } catch (err) {
    console.error("Error in chat route:", err);
    res.status(500).send("Something went wrong.");
  }
});


module.exports = router;
