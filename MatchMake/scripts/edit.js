async function onLoad() {
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("id");
    const { data, error } = await supabaseClient
    .from('job')
    .select()
    .eq('id', listingId);

    if (error) {
        window.alert(error);
        window.location.href = "./home.html";
    } else {
        document.getElementById("title").value = data[0].title;
        document.getElementById("summary").value = data[0].summary;
        document.getElementById("description").value = data[0].description;
        document.getElementById("skills").value = data[0].skills;
        document.getElementById("qualifications").value = data[0].qualifications;
    }

}

let form = document.getElementById("job-form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("id");
    const { data: { user } } = await supabaseClient.auth.getUser()
    let title = document.getElementById("title").value;
    let summary = document.getElementById("summary").value;
    let description = document.getElementById("description").value;
    let skills = document.getElementById("skills").value;
    let qualifications = document.getElementById("qualifications").value;

    const { error } = await supabaseClient
    .from('job')
    .update({title: title, summary: summary, description: description, skills: skills, qualifications: qualifications})
    .eq('id', listingId);

    if (error) {
        window.alert(error);
        console.log(error);
    } else {
        window.alert("Job updated successfully");
        window.location.href = './home.html';
    }
});

onLoad();