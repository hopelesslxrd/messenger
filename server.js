// server.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const SECRET_KEY = "govno";

app.use(express.static(__dirname)); 

io.on('connection', (socket) => {
    // --- НАЧАЛО ИЗМЕНЕНИЙ ---

    // Считаем, сколько клиентов уже подключено
    const connectedClients = io.engine.clientsCount;

    // Если в чате уже есть 2 человека, не пускаем нового
    if (connectedClients > 2) {
        console.log('Достигнут лимит пользователей. Отключение нового клиента.');
        socket.disconnect(true);
        return;
    }

    // --- КОНЕЦ ИЗМЕНЕНИЙ ---

    console.log('Пользователь пытается подключиться...');
    
    const providedKey = socket.handshake.query.key;

    if (providedKey !== SECRET_KEY) {
        console.log('Неверный ключ. Отключение.');
        socket.disconnect(true);
        return;
    }

    console.log(`Пользователь успешно подключился! Всего в чате: ${connectedClients}`);

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});