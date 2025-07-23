const http = require('http');
const fs = require('fs');
const path = require('path');

let requestsCount = 0;

const server = http.createServer((request, response) => {

    // Віддаємо іконку, якщо браузер просить її
    if (request.url === '/favicon.ico') {
        const iconPath = path.join(__dirname, '..', 'images', 'u-green.png');
        fs.readFile(iconPath, (err, data) => {
            if (err) {
                response.writeHead(404);
                response.end();
                return;
            }
            response.writeHead(200, { 'Content-Type': 'image/x-icon' });
            response.end(data);
        });
        return;
    }

    response.setHeader('Content-Type', 'text/plain; charset=utf-8'); // Додаємо заголовок
    // console.log('Запит:', request.method, request.url);


    let message = '';

    switch (request.url) {
        case '/students':
            message = 'Students';
            break;
        case '/':
        case '/courses':
            message = 'Front + Back';
            break;
        case '/test':
            message = 'Test';
            break;
        default:
            message = '404 Not Found';
    }

    if (request.url === '/favicon.ico' || request.url === '/.well-known/appspecific/com.chrome.devtools.json') {
        response.statusCode = 204; // No Content
        return response.end();
    }
    requestsCount++;
    message += ` | UmanProger ${requestsCount}`;

    response.end(message); // записуємо відповідь одним рядком
});

server.listen(3003, () => {
    console.log('Сервер запущено на http://localhost:3003');
});
