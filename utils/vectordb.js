const Chunk = require('../models/chunk');

/**
 * Search for most relevant chunks using cosine similarity
 * @param {number[]} queryEmbedding
 * @param {string} documentId
 * @returns {Promise<Array>} Array of top matching chunks
 */
async function searchEmbedding(queryEmbedding, documentId) {
  const results = await Chunk.aggregate([
    { $match: { documentId } },
    {
      $addFields: {
        similarity: {
          $let: {
            vars: {
              dotProduct: {
                $sum: {
                  $map: {
                    input: { $range: [0, 768] },
                    as: 'i',
                    in: {
                      $multiply: [
                        { $arrayElemAt: ['$embedding', '$$i'] },
                        { $arrayElemAt: [queryEmbedding, '$$i'] }
                      ]
                    }
                  }
                }
              },
              queryMagnitude: Math.sqrt(queryEmbedding.reduce((sum, val) => sum + val * val, 0))
            },
            in: {
              $divide: ['$$dotProduct', '$$queryMagnitude']
            }
          }
        }
      }
    },
    { $sort: { similarity: -1 } },
    { $limit: 5 },
    { $project: { text: 1, similarity: 1 } }
  ]);

  return results;
}

module.exports = {
  searchEmbedding
};
