const axios = require('axios');

/**
 * Generate embedding vector using Ollama's HTTP API
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>}
 */
async function generateEmbedding(text) {
  try {
    const response = await axios.post('http://localhost:11434/api/embeddings', {
      model: 'nomic-embed-text',
      prompt: text,
    });

    return response.data.embedding;
  } catch (error) {
    console.error('Embedding generation failed:', error.response?.data || error.message);
    throw new Error('Failed to generate embedding');
  }
}

module.exports = {
  generateEmbedding,
};
