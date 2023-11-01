
const {registerUer,loginUser} = require("../controller/userController")
const {redisSet} = require("../db/redis")


const userRouterHandle=async (req,res)=>{
  if(req.method === 'post' && req.path ==='/apu/user/login'){
    let result =await loginUser(req.body)
    if(result.code === 200){
      req.session.username = result.data.username
      req.session.password = result.data.password
      // ...

      //同步到redis中
      redisSet(req.userId,req.session)
    }
    return result
  }
  if(req.method === 'post' && req.path ==='/apu/user/register'){
    let result =await registerUer(req.body)
    return result
  }
}

module.exports = userRouterHandle