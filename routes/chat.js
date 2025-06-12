const express = require('express');
const router = express.Router();
const Embedding = require('../models/embedding');
const Document = require('../models/document');
const { generateEmbedding } = require('../utils/embedding');
const { chatWithContext } = require('../utils/ollamaChat');

// Cosine similarity between two vectors
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

// Route: GET /chat/:id
router.get('/:id', async (req, res) => {
  const documentId = req.params.id;
  const doc = await Document.findById(documentId);
  if (!doc) return res.status(404).send('Document not found');
  res.render('chat', {
  documentId,
  answer: null,
  question: null,
  title: 'AskMyPDF - Chat'
});

});

// Route: POST /chat/:id
router.post('/:id', async (req, res) => {
  const documentId = req.params.id;
  const question = req.body.question;

  // Embed the question
  const questionVector = await generateEmbedding(question);

  // Get all embeddings for this document
  const allChunks = await Embedding.find({ documentId });

  // Compute similarity
  const ranked = allChunks
    .map(chunk => ({
      chunkText: chunk.chunkText,
      score: cosineSimilarity(chunk.embedding, questionVector)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const context = ranked.map(r => r.chunkText).join('\n\n');

  // Get response from LLM using context
  const answer = await chatWithContext(question, context);

  res.render('chat', {
  documentId,
  question,
  answer,
  title: 'AskMyPDF - Chat'
});

});

module.exports = router;
