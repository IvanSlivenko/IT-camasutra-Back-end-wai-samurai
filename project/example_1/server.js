
//Example 1
// let counter = 0
// console.log('counter',counter)
// setInterval(()=>{console.log('counter',counter)},1000)

// Example 2
const http = require('http')

let requestsCount = 0;

// Створюємо сервер
const server = http.createServer((request, response)=>{

    requestsCount++

    switch (request.url){
        //localhost:3003/students
        case '/students' :
            response.write('Students')
            break;
        //localhost:3003/courses
        case '/courses' :
            response.write('Front + Back')
            break;
        case '/test' :
            response.write('test')
            break;
        default :
            response.write(' 404 Not found')
    }

    //Запишемо в респонс
    // response.write('UmanProger ' + requestsCount)

    // Завершити респонс
    response.end()
})

//Прослуховуємо порт 3003
server.listen(3003, () => {
    console.log('Сервер запущено на http://localhost:3003');
});
