const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (err) {
    console.error('Failed to parse PDF:', err); // More detailed log
    return ''; // Return empty string on failure
  }
}

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


async function extractChunksFromPDF(filePath) {
  const text = await extractTextFromPDF(filePath);
  if (!text || text.length < 10) throw new Error('Empty or unreadable PDF content.');
  return chunkText(text);
}

module.exports = { extractChunksFromPDF, extractTextFromPDF };
