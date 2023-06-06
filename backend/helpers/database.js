const mariadb = require('mariadb')

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  database:process.env.DB_NAME,
  user: process.env.DB_UNAME,
  password: process.env.DB_PASS,
  connectionLimit:5
})

pool.getConnection((err,conn) => {
  if(err){
    console.error(`Something went wrong: ${err}`)
  }
  if(conn) conn.release();
  return;
});


module.exports = pool
