const path = require("path")
const fs = require("fs")
const mime = require("./ext.json")

// 读取静态资源方法 req请求对象 res相应对象  rootpath静态资源在的目录
function readFile(req,res,rootPath){
  //获取静态资源地址
  // localhost:3000/login.html?username=wzh&password=123456
  let fileName = req.url.split("?")[0]
  console.log("fileName",fileName)
  let filePath = path.join(rootPath,fileName)
  console.log("filepath",filePath)
  //
  let isExists = fs.existsSync(filePath)
  console.log("isExists",isExists)
  if(!isExists){
    return
  }
  //获取静态资源后缀名
  let fileExt = path.extname(filePath)
  let type = mime[fileExt]

  //对文本类型特殊处理
  // if(type.startWith('text')){
  //   type += "charset=utf-8;"
  // }
  console.log("type",type)
  //告诉客户端返回的数据类型
  res.writeHead(200,{
    'Content-Type':type
  })

  return new Promise((resolve, reject) => {
    fs.readFile(filePath,(err,content)=>{
    
      if(err){
        res.end("Server Error")
        reject()
      }else{
        console.log('res content')
        res.end(content)
        resolve()
      }
    })
  })


}

module.exports={
  readFile
}