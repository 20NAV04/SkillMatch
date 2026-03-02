let form = document.getElementById("job-form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabaseClient.auth.getUser()
    let title = document.getElementById("title").value;
    let summary = document.getElementById("summary").value;
    let description = document.getElementById("description").value;
    let skills = document.getElementById("skills").value;
    let qualifications = document.getElementById("qualifications").value;

    const { error } = await supabaseClient
    .from('job')
    .insert({title: title, summary: summary, description: description, skills: skills, qualifications: qualifications, user_id: user.id});

    if (error) {
        window.alert(error);
        console.log(error);
    } else {
        window.alert("Job added successfully");
        window.location.href = './home.html';
    }
});