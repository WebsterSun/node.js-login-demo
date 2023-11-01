$('#login').click(()=>{
  let username = $("#username").val()
  let password = $("#password").val()
  $.get('/api/user/login',{username,password},(res)=>{
    console.log('login res')
  })
})