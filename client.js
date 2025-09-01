// Запрашиваем кодовое слово
const secretKey = prompt("Введите кодовое слово для входа в чат:");

// Подключаемся к серверу, передавая ключ
const socket = io({
    query: { key: secretKey }
});

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        const msg = input.value;
        
        // Отображаем собственное сообщение
        const myItem = document.createElement('li');
        myItem.textContent = msg;
        myItem.classList.add('my-message');
        messages.appendChild(myItem);
        window.scrollTo(0, document.body.scrollHeight);
        
        // Отправляем сообщение на сервер
        socket.emit('chat message', msg);
        input.value = '';
    }
});

// Получаем сообщение от другого пользователя
socket.on('chat message', function(msg) {
    const otherItem = document.createElement('li');
    otherItem.textContent = msg;
    otherItem.classList.add('other-message');
    messages.appendChild(otherItem);
    window.scrollTo(0, document.body.scrollHeight);
});

// Обработка ошибки подключения
socket.on('connect_error', () => {
    alert("Не удалось подключиться к чату. Проверьте кодовое слово и обновите страницу.");
});