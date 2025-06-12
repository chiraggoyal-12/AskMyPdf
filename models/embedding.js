const mongoose = require('mongoose');

const embeddingSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  chunkText: { type: String, required: true },
  embedding: { type: [Number], required: true } // embedding vector as an array of floats
});

module.exports = mongoose.model('Embedding', embeddingSchema);
