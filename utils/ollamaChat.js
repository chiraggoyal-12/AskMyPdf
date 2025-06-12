const { spawn } = require('child_process');

function chatWithContext(question, context) {
  return new Promise((resolve, reject) => {
    const ollama = spawn('ollama', ['run', 'llama3']);

    let output = '';
    let error = '';

    ollama.stdout.on('data', (data) => {
      output += data.toString();
    });

    ollama.stderr.on('data', (data) => {
      error += data.toString();
    });

    ollama.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject('LLM error: ' + error);
      }
    });

    const prompt = `You are an AI assistant. Answer the question based ONLY on the following context:\n\n${context}\n\nQuestion: ${question}\nAnswer:`;
    ollama.stdin.write(prompt);
    ollama.stdin.end();
  });
}

module.exports = { chatWithContext };
