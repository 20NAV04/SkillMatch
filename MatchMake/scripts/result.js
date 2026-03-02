function clearResults() {
    let pane = document.getElementById("left");
    while (pane.firstElementChild) {
        pane.removeChild(pane.firstElementChild);
    }
}

function addResult(id, name, summary, link, insight) {
    let pane = document.getElementById("left");
    pane.innerHTML += `
    <div class="job clickable" id=${id}>
        <div class="job-left">
            <div class="name">${name}</div>
            <div class="summary">${summary}</div>
            <div><a href="${link}">View Resume</a></div>
        </div>
        <div class="insight">${insight}</div>
    </div>
    `;
}

async function onLoad() {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("id");
    console.log(jobId);

    const { data, error } = await supabaseClient
    .from('resume')
    .select()

    console.log(data);

    if (error) {
        window.alert(error);
        window.location.href = "./home.html";
    } else {
        data.forEach(async resume => {
            const { data, error } = await supabaseClient
            .from('insight')
            .select()
            .eq('resume_id', resume.id);

            if (error) {
                window.alert(`${error}`);
                window.location.href = "./home.html";
            }

            const link = `https://omenefsdhphbepichpgv.supabase.co/storage/v1/object/public/resumes/${resume.link}`;
            const id = data[0].id;
            const name = data[0].name;
            const summary = data[0].summary;
            const insight = data[0].insight;

            addResult(id, name, summary, link, insight);
        });
      
    }
}

function displayInsight(id) {
    let pane = document.getElementById("insight");
    let job = document.getElementById(id);
    let insight = job.querySelector('.insight');
    pane.textContent =  insight.textContent;
}

function eventDelegation(e) {
    if (e.target.closest('.job')) {
        displayInsight(e.target.closest('.job').id);
    }
}

window.addEventListener("click", eventDelegation);
onLoad();