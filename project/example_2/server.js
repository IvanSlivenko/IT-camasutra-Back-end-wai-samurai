const http = require('http');
const fs = require('fs');
const path = require('path');



const server = http.createServer((request, response) => {

    // var 4
    switch (request.url) {
        case '/home': {
            // const data = fs.readFileSync('pages/home.html')
            const data = fs.readFile('pages/home.html', (err, data)=>{
                if(err){
                    response.write(err)
                }
                else {
                    response.write(data)
                    response.end()
                }
            })
            break;
        }
        case '/about': {
            setTimeout(()=>{
                    const data = fs.readFile('pages/about.html',(err, data)=>{
                    if(err){
                        response.write('err')
                    }
                    else {
                        response.write(data)
                        response.end()
                    }
                })

            },3000)
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
