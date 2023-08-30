// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const socketIO = require('socket.io');
// const mongoose = require('mongoose');

// const crypto = require('crypto');
// const data = require('./data.json');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// const port = process.env.PORT || 4000;

// app.use(cors({ 
//   origin: 'http://localhost:3000/', // Replace with your frontend's domain
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 204,
// }));

// const algorithm = 'aes-256-ctr';

// const mongoURI = 'mongodb+srv://prgharde:piyu123456@cluster0.mwzfslc.mongodb.net/?retryWrites=true&w=majority';
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// const messageSchema = new mongoose.Schema({
//   name: String,
//   origin: String,
//   destination: String,
//   secretKey: String,
//   timestamp: Date,
// });

// const Message = mongoose.model('Message', messageSchema);

// io.on('connection', (socket) => {
//   console.log('Listener connected');

//   socket.on('message', (encryptedMessageStream) => {
//     const encryptedMessages = encryptedMessageStream.split('|');

//     encryptedMessages.forEach((encryptedMessage) => {
//       const decipher = crypto.createDecipher(algorithm, originalMessage.secretKey); // Use the secretKey here
//       const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8');
//       const originalMessage = JSON.parse(decryptedMessage);

//       const hash = crypto.createHash('sha256');
//       hash.update(JSON.stringify(originalMessage));
//       const calculatedSecretKey = hash.digest('hex');

//       if (calculatedSecretKey === originalMessage.secretKey) {
//         const newMessage = new Message({
//           name: originalMessage.name,
//           origin: originalMessage.origin,
//           destination: originalMessage.destination,
//           secretKey: originalMessage.secretKey,
//           timestamp: new Date(),
//         });

//         newMessage.save().catch((error) => {
//           console.error('Error saving message:', error);
//         });
//       }
//     });
//   });
// });

// server.listen(port, () => {
//   console.log(`Listener service is running on port ${port}`);
// });

const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const crypto = require('crypto');
const data = require('./data.json');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 4000;

app.use(cors({ 
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
}));

const algorithm = 'aes-256-ctr';

const mongoURI = 'mongodb+srv://prgharde:piyu123456@cluster0.mwzfslc.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const messageSchema = new mongoose.Schema({
  name: String,
  origin: String,
  destination: String,
  secretKey: String,
  timestamp: Date,
});

const Message = mongoose.model('Message', messageSchema);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Listener connected');

  socket.on('message', (encryptedMessageStream) => {
    const encryptedMessages = encryptedMessageStream.split('|');

    encryptedMessages.forEach((encryptedMessage) => {
      const decipher = crypto.createDecipher(algorithm, originalMessage.secretKey); // Use the secretKey here
      const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8');
      const originalMessage = JSON.parse(decryptedMessage);

      const hash = crypto.createHash('sha256');
      hash.update(JSON.stringify(originalMessage));
      const calculatedSecretKey = hash.digest('hex');

      if (calculatedSecretKey === originalMessage.secretKey) {
        const newMessage = new Message({
          name: originalMessage.name,
          origin: originalMessage.origin,
          destination: originalMessage.destination,
          secretKey: originalMessage.secretKey,
          timestamp: new Date(),
        });

        newMessage.save().catch((error) => {
          console.error('Error saving message:', error);
        });
      }
    });
  });
});

server.listen(port, () => {
  console.log(`Listener service is running on port ${port}`);
});
