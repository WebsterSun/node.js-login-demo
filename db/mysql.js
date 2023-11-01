let mysql  = require("mysql")

const connection = mysql.createConnection({
  host:"lcoalhost",
  user:"me",
  password:"pass",
  database:"mydb"
})
// connection.connect()

const exc = (sql)=>{
  return new Promise((resolve,reject)=>{
    connection.query(sql,(err,result)=>{
      if(err){
        reject(err)
      }else{
        resolve(result)
      }
    })
  })
}

module.exports = {
  exc,
  escape:mysql.escape   //mysql去除特殊字符的方法,防止SQL注入
};