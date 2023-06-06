const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.APP_PORT

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

app.listen(port, ()=> {
  console.log(`App listening on port ${port}`)
})

app.get('/', (req, res) => {
  res.send('Hello world!')
});

const userRouter = require('./routes/user')
app.use('/user', userRouter)

const postRouter = require('./routes/post')
app.use('/post', postRouter)
