const http = require('http');
const fs = require('fs');
const path = require('path');


const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

const readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(data)
            }
        })
    })


}

const server = http.createServer(async (request, response) => {

     // Додаємо заголовки CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Якщо браузер робить preflight-запит (OPTIONS), відразу відповідаємо
    if (request.method === 'OPTIONS') {
        response.writeHead(204);
        response.end();
        return;
    }


    // var 4
    switch (request.url) {
        case '/home':
            try {
                response.write('Home')
                response.end()
            } catch (err) {
                response.write('something wrong')
                response.end()
            }
            break;

        case '/contacts':
            try {
                response.write('contacts')
                response.end()
            } catch (err) {
                response.write('something wrong witch contacts')
                response.end()
            }
            break;    

        case '/about': {
            await delay(3000)
            response.write('About course')
            response.end()
            break;
        }

        default:
            response.write('404 Not Found')
            response.end()
    }
});

server.listen(3003, () => {
    console.log('Сервер запущено на http://localhost:3003');
});
