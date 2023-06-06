const express = require('express')
const pool = require('../helpers/database')
const router = express.Router()

router.post('/createPost', async (req, res) => {
  const {userId, postText, imageUrl} = req.body
  console.log(`${userId}, ${postText}, ${imageUrl}`)
  try{
    const result = await pool.query(`INSERT INTO posts (userId, postText, imageUrl, likes) VALUES (${userId}, "${postText}", "${imageUrl}", 0)`)
    res.sendStatus(200)
  }
  catch(err){
    res.sendStatus(400)
  }
})

router.get('/getAllPosts', async(req,res)=> {
  try {
    const posts = await pool.query(`SELECT * FROM posts`)
    res.status(200).json(posts)

  } catch (err){
    res.sendStatus(404)
  }
})

module.exports = router
