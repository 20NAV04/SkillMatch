async function validateLogin() {
    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
        window.alert("You must be logged in to access this page");
        window.location.href = "../index.html";
    }
}

validateLogin();