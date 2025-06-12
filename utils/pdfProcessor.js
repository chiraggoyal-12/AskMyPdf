const fs = require('fs');
const pdfParse = require('pdf-parse');

// Split text into chunks with overlap
function chunkText(text, maxLength = 700, overlap = 200) {
  const chunks = [];
  let i = 0;

  while (i < text.length) {
    let end = i + maxLength;
    if (end > text.length) end = text.length;
    const chunk = text.slice(i, end);
    chunks.push(chunk.trim());
    i += maxLength - overlap;
  }

  return chunks;
}

// Main function to extract and chunk PDF
async function extractChunksFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  const text = pdfData.text.replace(/\s+/g, ' ').trim();
  return chunkText(text);
}

module.exports = { extractChunksFromPDF };
