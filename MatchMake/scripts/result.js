function clearResults() {
    let pane = document.getElementById("left");
    while (pane.firstElementChild) {
        pane.removeChild(pane.firstElementChild);
    }
}

function addResult(id, name, summary, link, score) {
    let pane = document.getElementById("left");
    pane.innerHTML += `
    <div class="job clickable" id=${id}>
        <div class="job-left">
            <div class="name">${name}</div>
            <div class="summary">${summary}</div>
            <div><a href="${link}">View Resume</a></div>
        </div>
        <div class="job-right">
            <div>Match Score</div>
            <div class="score">${score}</div>
        </div>
    </div>
    `;
}

function displayInsight(id) {
    let pane = document.getElementById("insight");
    pane.textContent = `${id}`;
}

function eventDelegation(e) {
    if (e.target.closest('.job')) {
        displayInsight(e.target.closest('.job').id);
    }
}

window.addEventListener("click", eventDelegation);