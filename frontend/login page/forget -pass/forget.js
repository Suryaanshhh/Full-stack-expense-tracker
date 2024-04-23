

const BTN=document.getElementById("submit");
BTN.addEventListener('click',function(e){
    e.preventDefault()
    const mail =document.getElementById("email").value;
    const user={
        mail:mail
    }
    axios.post('http://localhost:3000/forget-password',user).then((response)=>{
        console.log(response);
        alert("Email sent successfully")
    })
})