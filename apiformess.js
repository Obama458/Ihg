const express = require('express');
const serverless = require('serverless-http');

const app = express();

// In-memory message queue (array acts as FIFO)
let messages = [];

// Send API: https://yourdomain.vercel.app/?send=hello
app.get('/', (req, res) => {
  const msg = req.query.send;
  if (!msg) {
    return res.status(400).json({ status: 'error', sent: '' });
  }
  messages.push(msg);
  res.json({ status: 'success', sent: msg });
});

// Receive API: https://yourdomain.vercel.app/receive
app.get('/receive', (req, res) => {
  if (messages.length === 0) {
    return res.json({ status: 'no messages', message: '' });
  }
  const msg = messages.shift(); // FIFO
  res.json({ status: 'success', message: msg });
});

// Export the app wrapped in serverless-http
module.exports.handler = serverless(app);