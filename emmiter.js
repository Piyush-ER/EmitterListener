const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const crypto = require('crypto');
const data = require('./data.json');
// const cors = require('cors'); // Import the cors middleware

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 5000;

const algorithm = 'aes-256-ctr';
const secretKey = '123456';

// // Use cors middleware to allow requests from your frontend's origin
// app.use(cors({
//   origin: 'http://localhost:3000/', // Replace with your frontend's domain
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 200
// }));

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

io.on('connection', (socket) => {
  console.log('Emitter connected');

  setInterval(() => {
    const encryptedMessages = [];

    for (let i = 0; i < Math.floor(Math.random() * (499 - 49 + 1)) + 49; i++) {
      const name = getRandomElement(data.names);
      const origin = getRandomElement(data.cities);
      const destination = getRandomElement(data.cities);
      const originalMessage = { name, origin, destination };

      const hash = crypto.createHash('sha256');
      hash.update(JSON.stringify(originalMessage));
      const secretKey = hash.digest('hex');

      const cipher = crypto.createCipher(algorithm, secretKey);
      const encryptedMessage = cipher.update(JSON.stringify(originalMessage), 'utf8', 'hex');
      encryptedMessages.push(encryptedMessage);
    }

    const encryptedMessageStream = encryptedMessages.join('|');
    socket.emit('message', encryptedMessageStream);
  }, 10000); // Emit message stream every 10 seconds
});

server.listen(port, () => {
  console.log(`Emitter service is running on port ${port}`);
});
