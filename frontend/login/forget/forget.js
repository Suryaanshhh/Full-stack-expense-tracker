

const BTN=document.getElementById("submit");
BTN.addEventListener('click',function(e){
    e.preventDefault()
    const token = localStorage.getItem("token")
    const mail =document.getElementById("email").value;
    const user={
        mail:mail
    }
    axios.post('http://16.170.71.187:3000/forget-password',user,{
        headers:{Authorisation:token}
    }).then((response)=>{
        console.log(response);
        alert("Email sent successfully")
    })
})