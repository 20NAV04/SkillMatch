async function handleLogin(e) {
    e.preventDefault();
    let email = document.getElementById("email-field").value;
    let password = document.getElementById("password-field").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
    });

    if (error) {
        window.alert(error);
        console.log(error);
    } else {
        window.location.href = './pages/home.html';
    }
}

form = document.getElementById("login-form");
form.addEventListener('submit', handleLogin);