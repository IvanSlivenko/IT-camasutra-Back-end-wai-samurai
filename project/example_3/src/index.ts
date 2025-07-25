import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  // const a = 4;
  // if (a > 5) {
  //   res.send('ok')
  // }else{
  //   res.send('Hello World! a =< 5')
  // }

  // res.send({message: 'UmanProger'})
  // res.json(1000)
  res.sendStatus(404)
  
})

// app.get('/samurais', (req, res) => {
//   res.send('Hello samurais Test')
// })

// app.post('/samurais', (req, res) => {
//   res.send('We hav created samurai method POST !!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
