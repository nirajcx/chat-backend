const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const port = 4500;
app.use(cors());

app.get('/', (req, res) => {
    res.send("Chat backend is working");
});

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New Connection');

    socket.on('joined', ({ user }) => {
        console.log(`${user} has joined`);
        socket.broadcast.emit('userJoined', { user, message: `${user} has joined` });
        socket.emit('welcome', { user: 'Admin', message: `Welcome to the chat, ${user}` });
    });

    socket.on('message', ({ message, id }) => {
        io.emit('sendMessage', { user: 'User', message, id });
    });

    socket.on('disconnect', () => {
        console.log('User has left');
    });
});

server.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
