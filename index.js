const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Test
app.get('/', (req, res) => {
  res.send('✅ WhatsBulk API Running');
});

// POST: Receive bulk WhatsApp message request
app.post('/send-bulk', (req, res) => {
  const { senderNumber, message, recipients } = req.body;

  if (!senderNumber || !message || !Array.isArray(recipients)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (recipients.length > 50) {
    return res.status(400).json({ error: 'Maximum 50 recipients allowed' });
  }

  // For now, we just simulate sending messages
  const results = recipients.map((num, i) => ({
    to: num,
    status: 'queued',
    messageId: `msg_${Date.now()}_${i}`
  }));

  console.log(`[SEND] From: ${senderNumber}`);
  console.log(`[MESSAGE] ${message}`);
  console.log(`[RECIPIENTS]`, recipients);

  res.json({
    success: true,
    count: recipients.length,
    status: 'messages queued',
    data: results
  });
});

// Listen on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WhatsBulk API running on port ${PORT}`);
});
