const express = require('express')
const pool = require('../helpers/database')
const router = express.Router()
const {v4:uuid} = require("uuid")

router.post('/createPost', async (req, res) => {
  const {userId, postText, imageUrl} = req.body
//  console.log(`${userId}, ${postText}, ${imageUrl}`)
  try{
    const result = await pool.query(`INSERT INTO posts (id, userId, postText, imageUrl, likes) VALUES ("${uuid()}","${userId}", "${postText}", "${imageUrl}", 0)`)
    res.sendStatus(200)
  }
  catch(err){
    res.sendStatus(400)
  }
});

router.get('/getAllPosts', async(_req,res)=> {
  try {
    const posts = await pool.query(`SELECT posts.id, posts.postText, posts.imageUrl, posts.likes, posts.created_at, users.username FROM posts LEFT JOIN users ON users.id = posts.userId ORDER BY posts.created_at DESC`)
    res.status(200).json(posts)

  } catch (err){
    res.sendStatus(404)
  }
});

router.post('/addLikeToPost', async(req,res) => {
    const { id } = req.body
    try {
      const result = await pool.query(`
        UPDATE posts 
        SET likes = likes + 1
        WHERE id = '138c636b-fb85-48df-9a48-3540fbfcbe84'
      `)
      res.status(200).json(result)
    } catch (err){
      res.sendStatus(400)
    }
});

module.exports = router
