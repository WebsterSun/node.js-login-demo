const { createUser,getUser } = require("../service/userService")
const { userRegisterFail} =require("../model/user")
const {SuccessModel,ErrorModel} =require("../model/resultMode")

async function  registerUer (data){
  //校验格式、用户查重步骤省略
  try {
    let result = await createUser(data)
    return new SuccessModel({msg:"注册成功"})
  } catch (error) {
    return new ErrorModel(userRegisterFail)
  }

}

async function  loginUser (data){
  //校验格式、用户查重步骤省略
  try {
    let result = await getUser(data)
    if(result){
      //密码校验
      return new SuccessModel({msg:"登录成功"})
    }
  } catch (error) {
    return new ErrorModel(userRegisterFail)
  }

}

module.exports = {
  registerUer,
  loginUser
}