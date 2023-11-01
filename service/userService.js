const {exc , escape} = require("../db/mysql")
async function getUser({username,password}){
  // 转义字符防止sql注入
  username =  escape(username)
  password = escape(password)
  //escape 会自动加双引号,所以不用再加
  // let sql = `select * from user where username = '${username}' and password = '${password}';`
  let sql = `select * from user where username = ${username} and password = ${password};`
  let result =  await exc(sql)
  return result
}

async function createUser({username,password}){
  let sql = `insert into user (username, password) values (${username, password});`
  let result =  await exc(sql)
  return result
}

module.exports = {createUser,getUser}