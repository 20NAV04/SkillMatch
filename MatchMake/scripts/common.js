document.getElementById("logout-btn").addEventListener('click', async ()=> {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        window.alert(error);
        console.log(error);
    } else {
        window.location.href = "../index.html";
    }
});