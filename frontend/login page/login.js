
const SubmitBtn = document.getElementById('submit');
SubmitBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const login = {
        email: email,
        password: password
    }
    
    axios.post(`http://localhost:3000/login-user/${login.email}`, login).then((response) => {
        console.log(response);
        window.location.href="../main screen/main.html"
    }).catch(err => {
        console.log(err)
    })
    console.log(login.email)
    console.log(login.password)
})
