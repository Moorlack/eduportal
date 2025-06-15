const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('feedback', (data) => {
        io.emit('newFeedback', data);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(4000, () => console.log('Server running on port 4000'));