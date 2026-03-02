async function handleRegister(e) {
    e.preventDefault();
    let email = document.getElementById("email-field").value;
    let password = document.getElementById("password-field").value;
    let passwordConfirmation = document.getElementById("password-confirm-field").value;

    if (password != passwordConfirmation) {
        window.alert("Passwords do not match!");
        return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    });

    if (error) {
        window.alert(error);
        console.log(error);
    } else {
        window.alert("A confirmation email has been sent to the email that you have provided.");
    }
}

let form = document.getElementById("register-form")
form.addEventListener('submit', handleRegister);