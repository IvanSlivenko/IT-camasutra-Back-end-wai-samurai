import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3000;

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
  courses: [
    { id: 1, title: "front-end" },
    { id: 2, title: "back-end" },
    { id: 3, title: "automation ga" },
    { id: 4, title: "devops" },
  ],
};

// app.get('/', (req, res) => {
//   // const a = 4;
//   // if (a > 5) {
//   //   res.send('ok')
//   // }else{
//   //   res.send('Hello World! a =< 5')
//   // }

//   // res.send({message: 'UmanProger'})
// or
//   // res.json(1000)
// or
//   // res.sendStatus(404)

// })

// app.get('/samurais', (req, res) => {
//   res.send('Hello samurais Test')
// })

// app.post('/samurais', (req, res) => {
//   res.send('We hav created samurai method POST !!')
// })

// app.get("/courses", (req, res) => {
//   res.json(db.courses);
// });

app.get("/courses", (req, res) => {
  
  let foundCourses = db.courses
  if(req.query.title){
    foundCourses = foundCourses.filter(c=> c.title.indexOf(req.query.title as string)  > -1 )
  }
  res.json(foundCourses);
});

app.get("/courses/:id", (req, res) => {
  const foundCourse = db.courses.find((c) => c.id === +req.params.id);

  if (!foundCourse) {
    res.sendStatus(404);
    return;
  }

  res.json(foundCourse);
});

app.post("/courses", (req, res)=>{
  const createdCourse = {
    id: +(new Date()),
    title: req.body.title
  }
  db.courses.push(createdCourse)
  res.json(createdCourse)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
