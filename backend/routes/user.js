const express = require('express')
const bcrypt = require('bcrypt')
const {v4: uuid} = require("uuid")
//const SqlString = require('sqlstring')

const router = express.Router()
const pool = require('../helpers/database')

router.get('/getUser/:id', async (req, res) => {
  const id = req.params.id
  const rows = await pool.query(`SELECT username FROM users WHERE id = "${id}"`)
  res.status(200).json(rows)
  
});

router.post('/register', async function (req, res){
  try {
    const {username, password} = req.body
    const encryptedPw = await bcrypt.hash(password, 10)
    const result = await pool.query(`INSERT INTO users (id, username, password) VALUES ("${uuid()}","${username}","${encryptedPw}")`)
    
    res.sendStatus(200)
  } catch(err){
    res.status(400).send(`Something went wrong: ${err.message}`)
  }
})

router.post('/login',  async function (req,res) {
  const {username, password} = req.body

  try{
    const user = await pool.query(`SELECT password, id FROM users WHERE username = "${username}";`)
    const isValid = await bcrypt.compare(password, user[0].password)

    if(isValid){
      res.status(200).json({"isValid":isValid, "id": user[0].id})
    }
    else {
      res.status(400).send("Invalid password")
    }
  } catch(err) {
    res.status(404).send("User not found")
  }
})


module.exports = router
