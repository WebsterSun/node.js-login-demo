class BaseMode {
  constructor(msg,data){
    this.msg= msg
    this.data= data
  }

}
class SuccessModel extends BaseMode{
  constructor(msg,data){
    super(msg,data)
    this.code = 200
  }
}
class ErrorModel extends BaseMode{
  constructor(msg,data){
    super(msg,data)
    this.code = -1
  }
}


module.exports = {
  SuccessModel,
  ErrorModel
}