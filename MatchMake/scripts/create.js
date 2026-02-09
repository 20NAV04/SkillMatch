let form = document.getElementById("job-form");
form.onsubmit = e => {
    e.preventDefault();
    console.log("form submitted");
}