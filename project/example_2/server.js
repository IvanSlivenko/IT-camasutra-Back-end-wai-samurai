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

    // var 4
    switch (request.url) {
        case '/home':
            try {
                const data = await readFile('pages/home.html')
                response.write(data)
                response.end()
            } catch (err) {
                response.write('something wrong')
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


    // var 2
    // switch (request.url) {
    //     case '/home': {
    //         setTimeout(()=>{
    //             const data = 'best free online course'
    //             response.write(data)
    //         },3000)
    //         break;
    //
    //     }
    //     default:
    //         response.write('404 Not Found')
    //
    // }
    // response.end()

    // var 3
    // switch (request.url) {
    //     case '/home': {
    //         setTimeout(()=>{
    //             const data = 'best free online course'
    //             response.write(data)
    //             response.end()
    //
    //         }, 3000)
    //         break;
    //
    //     }
    //     default:
    //         response.write('404 Not Found')
    //         response.end()
    // }

});

server.listen(3003, () => {
    console.log('Сервер запущено на http://localhost:3003');
});
