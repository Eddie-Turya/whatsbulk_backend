import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Create DB Pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Endpoint to handle WhatsApp bulk message requests
app.post('/send-bulk', async (req, res) => {
  const { sender, message, recipients } = req.body;

  if (!sender || !message || !recipients || !Array.isArray(recipients)) {
    return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  try {
    const insert = await db.query(
      `INSERT INTO message_requests (sender_number, message, recipients, created_at) VALUES (?, ?, ?, NOW())`,
      [sender, message, JSON.stringify(recipients)]
    );

    res.json({ success: true, message: 'Message request stored successfully', request_id: insert[0].insertId });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('WhatsBulk Backend Running ✅');
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
