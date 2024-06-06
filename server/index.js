const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = socketIo(server, {
        cors: {
            origin: 'http://localhost:3000', // Replace with the origin of your Next.js client
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    let players = [];

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('select-color', (color) => {
            const player = { id: socket.id, color };
            players = players.filter(p => p.id !== socket.id);
            players.push(player);
            io.emit('update-players', players);
        });

        socket.on('disconnect', () => {
            players = players.filter(p => p.id !== socket.id);
            io.emit('update-players', players);
        });
    });

    server.listen(4000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:4000');
    });
});
