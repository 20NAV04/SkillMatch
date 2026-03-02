import {analyze} from "../scripts/ai.js";

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
        const response = await supabaseClient
        .from('job')
        .delete()
        .eq('id', id);     

        if (response.status == 204) {
            window.alert("Job deleted successfully");
            window.location.reload();
        } else {
            window.alert(`${response.statusText}`);
        }
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
    window.location.href = `./edit.html?id=${id}`;
}

function viewResults(id) {
    window.location.href = `./result.html?id=${id}`;
}

async function uploadResume (id) {
    showElement("upload-modal-wrapper");

    let confirmation = await confirmUpload();
    if (confirmation) {
        let files = document.getElementById("resume-upload").files;
        for (let i = 0; i < files.length; ++i) {
            uploadFile(files[i], id);
        }
    } else {
        console.log(`upload cancelled`);
    }

    hideElement("upload-modal-wrapper");
}


// need to add some sort of rollback feature
// if upload to resume table fails, data in bucket should be removed too
async function uploadFile(file, id) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const filepath = `${user.id}/${id}/${file.name}`;

    const { fileData, fileError } = await supabaseClient.storage.from('resumes').upload(filepath, file, {upsert: true});

    
    if (fileError) {
        window.alert(`Upload failed for ${file.name}`);
    } else {
        const resumeId = crypto.randomUUID();
        const { uploadError } = await supabaseClient
        .from('resume')
        .insert({id: resumeId, job_id: id, user_id: user.id, link: filepath, file_name: file.name});

        if (uploadError) {
            console.log(`${uploadError}`);
            window.alert("Uploading resume to database failed");
        } else {
            window.alert("Resume uploaded successfully");
            const resumeUrl = `https://omenefsdhphbepichpgv.supabase.co/storage/v1/object/public/resumes/${filepath}`;
            console.log(resumeUrl);
            analyze(resumeUrl, resumeId, id);
        }
    }
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

async function fetchJobs() {
    const { data, error } = await supabaseClient
    .from('job')
    .select(`id, title, summary, report_status`);

  if (data.length == 0) {
    showElement("zero-active"); 
  } else {
    hideElement("zero-active"); 
    data.forEach(job => {
        addJobListing(job.id, job.title, job.summary, job.report_status);
    });
  }
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

document.getElementById("searchbar").addEventListener("keyup", async (e) => {
    if (e.key === "Enter") {
        let toSearch = e.target.value;
        clearListings();
        if (toSearch == "") {
            fetchJobs();
        } else {
            const { data, error } = await supabaseClient
            .from('job')
            .select('title, *')
            .like('title', `%${e.target.value}%`);
            
            if (data.length == 0) {
                showElement("zero-active"); 
            } else {
                hideElement("zero-active");
                data.forEach(job => {
                    addJobListing(job.id, job.title, job.summary, job.report_status);
                });
            }
        }
    }
});

window.addEventListener("click", eventDelegation);
fetchJobs();

