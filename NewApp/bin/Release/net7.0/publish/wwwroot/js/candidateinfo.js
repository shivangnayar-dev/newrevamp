document.addEventListener("DOMContentLoaded", function () {
    let candidateData = {};
    let step = 0;

    function startCandidateProcess() {
        askName();
    }
    startCandidateProcess();

function askName() {
    const promptText = document.getElementById("promptText");
    promptText.innerText = "Please enter your name:";

    const inputField = document.getElementById("candidateInput");
    inputField.placeholder = "Enter your name";
    inputField.value = ""; // Clear input field

    const submitButton = document.querySelector(".submit-button");
    submitButton.onclick = saveName;
}

function saveName() {
    const inputField = document.getElementById("candidateInput");
    const errorDiv = document.getElementById("error-message");

    candidateData.name = inputField.value.trim();
    if (!candidateData.name) {
        errorDiv.innerText = "Name cannot be empty.";
        return;
    }

    errorDiv.innerText = ""; // Clear error message
    askCountry();
}

function askCountry() {
    const promptText = document.getElementById("promptText");
    promptText.innerText = "Please select your country:";

    const inputField = document.getElementById("candidateInput");
    inputField.style.display = "none"; // Hide text input

    const countrySelect = document.createElement("select");
    countrySelect.id = "countrySelect";
    countrySelect.innerHTML = `<option value="" disabled selected>Select your Country</option>`;

    // List of countries
    const countries = ['India', 'United States', 'Canada', 'Australia', 'Other'];
    countries.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.text = country;
        countrySelect.appendChild(option);
    });

    document.getElementById("inputContainer").appendChild(countrySelect);

    const submitButton = document.querySelector(".submit-button");
    submitButton.onclick = saveCountry;
}

function saveCountry() {
    const countrySelect = document.getElementById("countrySelect");
    const errorDiv = document.getElementById("error-message");

    candidateData.country = countrySelect.value;
    if (!candidateData.country) {
        errorDiv.innerText = "Country cannot be empty.";
        return;
    }

    errorDiv.innerText = ""; // Clear error message
    askLocation();
}

function askLocation() {
    const promptText = document.getElementById("promptText");
    promptText.innerText = "Please enter your location:";

    const inputField = document.getElementById("candidateInput");
    inputField.style.display = "block"; // Show text input
    inputField.placeholder = "Enter your location";
    inputField.value = ""; // Clear input field

    const submitButton = document.querySelector(".submit-button");
    submitButton.onclick = saveLocation;
}

function saveLocation() {
    const inputField = document.getElementById("candidateInput");
    const errorDiv = document.getElementById("error-message");

    candidateData.location = inputField.value.trim();
    if (!candidateData.location) {
        errorDiv.innerText = "Location cannot be empty.";
        return;
    }

    errorDiv.innerText = ""; // Clear error message
    askGender();
}

function askGender() {
    const promptText = document.getElementById("promptText");
    promptText.innerText = "Select your gender:";

    const inputField = document.getElementById("candidateInput");
    inputField.placeholder = "Enter your gender (e.g., Male, Female, Other)";
    inputField.value = ""; // Clear input field

    const submitButton = document.querySelector(".submit-button");
    submitButton.onclick = saveGender;
}

function saveGender() {
    const inputField = document.getElementById("candidateInput");
    const errorDiv = document.getElementById("error-message");

    candidateData.gender = inputField.value.trim();
    if (!candidateData.gender) {
        errorDiv.innerText = "Gender cannot be empty.";
        return;
    }

    errorDiv.innerText = ""; // Clear error message
    askDob();
}

function askDob() {
    const promptText = document.getElementById("promptText");
    promptText.innerText = "Please enter your date of birth:";

    const inputField = document.getElementById("candidateInput");
    inputField.type = "date"; // Change input type to date
    inputField.value = ""; // Clear input field

    const submitButton = document.querySelector(".submit-button");
    submitButton.onclick = saveDob;
}

function saveDob() {
    const inputField = document.getElementById("candidateInput");
    const errorDiv = document.getElementById("error-message");

    candidateData.dob = inputField.value.trim();
    if (!candidateData.dob) {
        errorDiv.innerText = "Date of birth cannot be empty.";
        return;
    }

    errorDiv.innerText = ""; // Clear error message
    console.log(candidateData); // Debugging: log the data to the console
    saveCandidateInfo(); // Call save function
}

// Save candidate info to database
async function saveCandidateInfo() {
    const response = await fetch('/api/CandidateInfo/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateData)
    });

    const messageBox = document.getElementById("messageBox");
    if (response.ok) {
        messageBox.innerHTML = "<p>Information saved successfully!</p>"; // Display success message
    } else {
        messageBox.innerHTML = "<p>Error saving information.</p>"; // Display error message
    }
}
