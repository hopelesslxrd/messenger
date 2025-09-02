// server.js

// Подключаем необходимые модули
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

// Создаем приложение Express
const app = express();
// Создаем HTTP сервер на основе Express
const server = http.createServer(app);
// Подключаем Socket.IO к HTTP серверу
const io = new Server(server);

// Указываем Express, что нужно отдавать статичные файлы из текущей папки
app.use(express.static(__dirname));

// Маршрут для корневого URL, который отдает наш HTML файл
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Слушаем событие 'connection' - когда новый пользователь подключается к чату
io.on('connection', (socket) => {
  console.log('Пользователь подключился');

  // Слушаем событие 'disconnect' - когда пользователь отключается
  socket.on('disconnect', () => {
    console.log('Пользователь отключился');
  });

  // Слушаем кастомное событие 'chat message', которое будет присылать клиент
  socket.on('chat message', (msg) => {
    // Получив сообщение, рассылаем его всем подключенным клиентам
    // включая отправителя
    io.emit('chat message', msg);
  });
});

// Запускаем сервер на порту 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
