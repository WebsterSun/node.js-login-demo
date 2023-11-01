
const queryString = require("querystring")
const staticServer = require("./utils/staticServer")
const path = require("path")
const rootPath = path.join(__dirname,"public")
const userRouterHandle = require("./router/user")
const {redisGet} = require("./db/redis")

//定义全局session容器变量
const SESSION_CONTAINER = {}

const setEnd = (res,data)=>{
  res.writeHead(200,{
    "Cotent-Type":"application/json;charset=utf-8;"
  })
  res.end(JSON.stringify(data))
}

// 获取 cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  console.log('d.toGMTString() is ', d.toGMTString())
  return d.toGMTString()
}

const initCookieSession = async (req,res)=>{
  //处理cookie
  console.log(req.headers.cookie) // username=abc;age=18
  req.cookie = {}
  if(req.headers.cookie){
    req.headers.cookie.split(';').forEach(item => {
      let keyvalue= item.split("=")
      req.cookie[keyvalue[0]]= keyvalue[1]
    });
  }
  // 服务端设置cookie 缺点是cookie会暴露很危险

  //为了解决这个问题，采用session，即server端存储用户信息：cookie中存userid(无关紧要的唯一标识，可随机生成)，server端对应username
  // 解决方案：在session中存储userId和username的映射，客户端用cookie存userId后，服务端拿到后去session找对应的username映射。

  // 获取用户唯一标识(userId)
  req.userId = req.cookie.userId
  if(!req.userId){  //第一次请求没有标识就随机生成一个
    req.userId = `${Date.now()}_${Math.random()}`
    //给当前用户分配容器
    // SESSION_CONTAINER[req.userId] = {}

    req.session ={}

    //这里省略了加密操作
    // 限制前台修改cookies httpOnly
    // 限制过期时间 expires=${getCookieExpires()
    res.setHeader("Set-Cookie",`userId=${req.userId};path=/;httpOnly; expires=${getCookieExpires()}`)
  }

  // //给当前用户分配容器
  // if(!SESSION_CONTAINER[req.userId]){
  //   SESSION_CONTAINER[req.userId]={}
  // }

  if(!res.session){
    res.session =await redisGet(req.userId)||{}
  }
  
  //把当前用户容器放在全局方便使用
  // req.session = SESSION_CONTAINER[req.userId]

  //session的问题
  // 目前session是js 变量，放在nodejs进程内存中。

  // 第一，进程内存有限，访问量过大，内存暴增怎么办？

  // 第二，正式上线是多进程，进程之间无法共享。现在企业都是在一台机器上跑多个node进程来提升效率和使用率,但是每个进程的内存是相互隔离的,所以登录状态没法共享

  // 三 , session会在服务端关闭时释放存储空间,但服务端每次更新都要重启,或者运维同学运维也要重启,导致频繁的需要用户登录体验不好

  // 解决方案:redis
  //第一: redis集群可以突破内存限制
  //第二: 只要redis不重启数据就不会消失
  //三:存在redis的数据每个node进程都可以访问
  //四: redis性能好速度快


}

const initParams = (req)=>{
  req.method = req.method.toLocaleLowerCase()
  req.path = req.url.split("?")[0]

  let params = ""
  return new Promise((resolve, reject) => {
      
    if(req.method === 'get'){

      params = req.url.split("?")[1]
      req.query=queryString.parse(params)
      resolve()

    }else if(method === 'post'){
      req.on("data",(chunk)=>{
        params+=chunk
      })
      req.on("end",()=>{
        req.body = queryString.parse(params)
        resolve()
      })

    }
  })
}
const serverHandle = async(req,res)=>{
  //处理cookie和session
  await initCookieSession(req,res)
  //返回静态网页
  await staticServer.readFile(req,res,rootPath)


  res.setEnd = setEnd

  // 处理api请求
  initParams(req).then(async ()=>{
    console.log(req.method)
    console.log(req.path)
    console.log(req.query)
    console.log(req.body)


    let userData = await userRouterHandle(req,res)
    if(userData){
      // res.end(JSON.stringify(userData))
      return setEnd(res,userData)
    }

  })
}
module.exports = serverHandle