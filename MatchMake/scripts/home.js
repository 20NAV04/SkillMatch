function clearListings() {
    let listingPane = document.getElementById('body-bottom');
    while (listingPane.children.length > 1) {
        listingPane.removeChild(listingPane.lastElementChild);
    }
}

function addJobListing(id, position, description, reportStatus) {
    let listingPane = document.getElementById('body-bottom');
    listingPane.innerHTML += `
    <div class="job" id="${id}">
        <div class="job-left">
            <div class="job-position">${position}</div>
            <div class="job-desc">${description}</div>
        </div>
        <div class="job-right">
            <div class="job-actions">
                <i class="fa-solid fa-trash clickable delete-job"></i>
                <i class="fa-solid fa-pen-to-square clickable edit-job"></i>
                <i class="fa-solid fa-upload clickable upload-job"></i>
                <i class="fa-solid fa-ranking-star clickable results-job"></i>
            </div>
            <div class="job-stats">
                <div class="report-status ${reportStatus ? "success" : "warn"}">Report ${reportStatus ? "Ready" : "Not Ready"}</div>
            </div>
        </div>
    </div>
    `;
}

// zero-active for zero listings
// upload-modal-wrapper for upload modal
// delete-confirmation for delete confirmation modal
function showElement(id, flex=true) {
    let elem = document.getElementById(id);
    elem.classList.remove('hidden');

    if (flex) {
        elem.classList.add('flex-visible');  
    } else {
        elem.classList.add('grid-visible');
    }

}

function hideElement(id, flex=true) {
    let elem = document.getElementById(id);

    if (flex) {
        elem.classList.remove('flex-visible');
    } else {
        elem.classList.remove('grid-visible');
    }

    elem.classList.add('hidden');
}

async function deleteJob(id) {
    showElement("delete-confirmation");
    let confirmation = await confirmDeletion();
    
    // to be replaced
    if (confirmation) {
        console.log(id);
    } else {
        console.log(`cancel delete ${id}`);
    }

    hideElement("delete-confirmation");
}

function confirmDeletion() {
    return new Promise(resolve => {
        let confirmBtn = document.getElementById("submit-delete-btn");
        let cancelBtn = document.getElementById("close-delete-btn");
    
        const onConfirm = () => {
            cleanup();
            resolve(true);
        };

        const onCancel = () => {
            cleanup();
            resolve(false);
        };

        function cleanup() {
            confirmBtn.removeEventListener("click", onConfirm);
            cancelBtn.removeEventListener("click", onCancel);
        };

        confirmBtn.addEventListener("click", onConfirm);
        cancelBtn.addEventListener("click", onCancel);
    });
}

// WIP
function editListing(id) {
    console.log(`editing ${id}`);
}

function viewResults(id) {
    console.log(`view results for ${id}`);
}

async function uploadResume (id) {
    showElement("upload-modal-wrapper");

    let confirmation = await confirmUpload();
    if (confirmation) {
        console.log(`uploading for job ${id}`);
    } else {
        console.log(`upload cancelled`);
    }

    hideElement("upload-modal-wrapper");
}

function confirmUpload() {
    return new Promise(resolve => {
        let confirmBtn = document.getElementById('submit-upload-btn');
        let cancelBtn = document.getElementById('close-upload-btn');
        let input = document.getElementById('resume-upload');

        const onConfirm = () => {
            if (input.files.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        };

        const onCancel = () => {
            cleanup();
            resolve(false);
        };

        function cleanup() {
            confirmBtn.removeEventListener("click", onConfirm);
            cancelBtn.removeEventListener("click", onCancel);
        };

        confirmBtn.addEventListener("click", onConfirm);
        cancelBtn.addEventListener("click", onCancel);
    });
}

function eventDelegation(e) {
    if (e.target.matches(".delete-job")) {
        let id = e.target.closest(".job").id;
        deleteJob(id);
    }
    if (e.target.matches(".edit-job")) {
        let id = e.target.closest(".job").id;
        editListing(id);
    }
    if (e.target.matches(".results-job")) {
        let id = e.target.closest(".job").id;
        viewResults(id);
    }
    if (e.target.matches(".upload-job")) {
        let id = e.target.closest(".job").id;
        uploadResume(id);
    }
    
}

window.addEventListener("click", eventDelegation);