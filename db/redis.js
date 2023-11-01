const redis = require("redis")

// const client = redis.createClient(6379, '127.0.0.1')

// client.on('error',(error)=>{
//   console.error(error);
// })

function redisSet(key,value){
  if(typeof value === 'object'){
    value = JSON.stringify(value)
  }
  // client.set(key,value,redis.print)
}

function redisGet(key){
  return new Promise((resolve, reject) => {
    
    // client.get(key,(err,value)=>{
    //   if(err){
    //     reject(err)
    //   }
    //   try {
    //     resolve(JSON.parse(value))
    //   } catch (error) {
    //     resolve(value)
    //   }
    // })
  })
}


module.exports = {redisSet,redisGet}