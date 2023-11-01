$('#register').click(()=>{
  let username = $("#username").val()
  let password = $("#password").val()
  $.post('/api/user/register',{username,password},(res)=>{
    console.log('register res')
  })
})