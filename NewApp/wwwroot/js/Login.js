
let userData = {};
function askemail() {
    document.getElementById("TextInput").placeholder = "Enter your email address";
    createMessageBox("Great! Let's start with your email address Please enter your email:");


    document.querySelector(".astro-button-container").style.display = "none";

    currentStep = 2; // Set the step to 2 for email input
}
function askemail11() {
    document.getElementById("TextInput").value = "";
    document.getElementById("TextInput").placeholder = "Enter your email address";
    createMessageBox("Please enter your email to get your report:");


    document.querySelector(".astro-button-container").style.display = "none";

    // Set the step to 2 for email input
}
function displaySubmittedInput(type, value, isUserMessage = true) {
    // Assuming you have an element to display messages with class "chat-container"
    const chatContainer = document.querySelector(".chat-container");

    // Create a new message element
    const messageElement = document.createElement("div");
    messageElement.classList.add(isUserMessage ? "user-message" : "system-message");
    messageElement.innerHTML = `<p><strong>${type}:</strong> ${value}</p>`;

    // Append the message to the chat container
    chatContainer.appendChild(messageElement);

    // Add a line break
    let lineBreak = document.createElement("hr");
    chatContainer.appendChild(lineBreak);
}

function askPhone() {
    document.getElementById("TextInput").placeholder = "Enter your phone number";
    createMessageBox("Great! Let's start with your phone number. Please select your country code and enter your phone number:");

    const TextInput = document.getElementById("TextInput");
    const countryCodeSelect = createCountryCodeSelect();

    // Insert the country code select before the TextInput
    TextInput.parentNode.insertBefore(countryCodeSelect, TextInput);

    document.querySelector(".astro-button-container").style.display = "none";
    currentStep = 3; // Set the step to 3 for phone input
}
function askadhar() {
    document.getElementById("TextInput").placeholder = "Enter your Adhar number";
    createMessageBox("Great! Let's start with your Adhar number. Please enter your Adhar number:");



    document.querySelector(".astro-button-container").style.display = "none";

}
function createMessageBox(title) {
    // Create a new message box
    let newMessageBox = document.createElement("div");
    newMessageBox.className = "message-box my-message";

    // Add the title
    newMessageBox.innerHTML += `<p>${title}</p>`;

    // Add the content


    // Add timestamp


    // Append the new message box to the chat container
    document.querySelector(".chat-container").appendChild(newMessageBox);

    // Add a line break
}

function clearMessageBoxes() {
    // Clear all existing message boxes in the chat container
    const chatContainer = document.querySelector(".chat-container");
    chatContainer.innerHTML = "";
}



function handleMultipleSubmit() {
    const input = document.getElementById("TextInput");
    const placeholder = input.placeholder.toLowerCase();

    // Validate and set userData based on placeholder
    let isValidInput = false;
    let inputType = "";
    if (placeholder.includes("phone number")) {
        const phoneNumber = input.value;
        const countryCode = countryCodeSelect.value;
        inputType = "Phone Number";
        if (isValidPhoneNumber(phoneNumber, countryCode)) {
            const fullPhoneNumber = `${countryCode}${phoneNumber}`;
            userData.Mobile_No = fullPhoneNumber;

            displaySubmittedInput(inputType, fullPhoneNumber, true);
            countryCodeSelect.remove(); // Remove the country code select element
            askemail11();
        } else {
            alert('Invalid phone number or country code. Please select a country code and enter a valid number.');
        }
    }
    else if (placeholder.includes("adhar number")) {
        const adharNumber = input.value;
        inputType = "Aadhar Number";
        if (isValidAdharNumber(adharNumber)) {
            userData.Adhar_No = adharNumber;
            isValidInput = true;
            displaySubmittedInput(inputType, adharNumber, true);
        } else {
            alert('Invalid Aadhar number. Please enter a 12-digit number.');
        }
    } else if (placeholder.includes("email address")) {
        const emailAddress = input.value;
        inputType = "Email Address";
        if (isValidEmail(emailAddress)) {
            userData.Email_Address = emailAddress;
            isValidInput = true;

            // Display submitted input in a message box
            displaySubmittedInput(inputType, emailAddress, true);
        } else {
            alert('Invalid email address. Please enter a valid email.');
        }
    }

    if (isValidInput) {
        checkForDuplicatesBeforeSubmit();

        // Display submitted input in a message box

    }

  
 


    // Call handleRashiSubmit if isDobSubmit is false



    // Call handleDateOfBirthSubmit if isDobSubmit is true
    
}



function checkForDuplicatesBeforeSubmit() {
    const input = document.getElementById("TextInput");
    const placeholder = input.placeholder.toLowerCase();

    let inputData;
    if (placeholder.includes("phone number")) {
        inputData = { Mobile_No: input.value };
    } else if (placeholder.includes("adhar number")) {
        inputData = { Adhar_No: input.value };
    } else if (placeholder.includes("email address")) {
        inputData = { Email_Address: input.value };
    }

    // Check for duplicates before proceeding
    $.ajax({
        type: 'POST',
        url: '/api/Candidate/CheckDuplicate',
        contentType: 'application/json',
        data: JSON.stringify(inputData),
        success: function (response) {
            console.log(response);


            if (response.exists) {
                // Duplicate exists, ask for password
                document.getElementById("TextInput").value = "";
                const password = response.password;
                userData.name = response.name;
                userData.gender = response.gender;
                userData.country = response.country;
                userData.qualification = response.qualification;
                userData.Dob = response.dob;
                userData.organization = response.organization;
                // Assuming the response contains the ReportId
                console.log(`email is valid. Corresponding password is: ${password}`);
                askPassword(password);
            } else {
                // No duplicate found, proceed with other actions
                document.getElementById("TextInput").value = "";
                createPassword();

            }
        },
        error: function (error) {
            console.error('Error checking duplicate:', error.responseJSON);
        }
    });
}

function createPassword() {
    const input = document.getElementById("TextInput");
    input.placeholder = "Create your password";

    // Use a confirm dialog to ask if the user wants to create a default password
    const createDefaultPassword = confirm("Do you want to create a default password (Career@123#)? Click 'Ok' to continue with the default password or 'Cancel' to create a new one.");

    if (createDefaultPassword) {
        // Set the default password
        const defaultPassword = "Career@123#";
        userData.Password = defaultPassword;
        displaySubmittedInput("Password", defaultPassword, true);
        askTestCode();
        isSubmitnewPasswordEnabled = false;

        // Additional actions for using default password
        // ...

        // Reset the input or clear the data
        input.value = "";
    } else {
        createMessageBox("You're creating a new account. Please create your password");

        // Assuming you have a function to handle password creation
        // For example, a function named submitnewPassword
        input.addEventListener("change", function () {
            submitnewPassword();
        });
    }
}

let isSubmitnewPasswordEnabled = true;

function submitnewPassword() {
    const passwordInput = document.getElementById("TextInput");
    const password = passwordInput.value;

    if (isSubmitnewPasswordEnabled && password) {
        userData.Password = password;
        displaySubmittedInput("Password", password, true);

        askTestCode();
        isSubmitnewPasswordEnabled = false;

        // Other UI changes or actions as needed

        // Reset the input or clear the data
        passwordInput.value = "";
    }
}

function isValidPhoneNumber(phoneNumber, countryCode) {
    const selectedCountry = countryCodes.find(country => country.code === countryCode);
    if (!selectedCountry) return false;
    const expectedLength = selectedCountry.length;
    const phoneNumberPattern = new RegExp(`^\\d{${expectedLength}}$`);
    return phoneNumberPattern.test(phoneNumber);
}
function isValidAdharNumber(adharNumber) {
    // Check if the Aadhar number is a 12-digit number
    return /^\d{12}$/.test(adharNumber);
}

function isValidEmail(email) {
    // Check if the email address is valid
    return /\S+@\S+\.\S+/.test(email);
}


function askPassword(password) {
    const input = document.getElementById("TextInput");
    input.placeholder = "Enter your password";
    createMessageBox("Account exists. Please enter your password");
    document.querySelector(".astro-button-container").style.display = "none";

    // Pass a function reference without invoking it
    input.addEventListener("change", function () {
        submitPassword(password);
    });
}

let isSubmitPasswordEnabled = true;

function submitPassword(existingPassword) {
    const passwordInput = document.getElementById("TextInput");
    const enteredPassword = passwordInput.value;

    console.log('submitPassword - Function called');  // Log a message

    if (isSubmitPasswordEnabled && enteredPassword) {
        userData.Password = enteredPassword;
        if (enteredPassword === existingPassword) {
            console.log("Password is correct. Proceed with additional actions if needed.");
            displaySubmittedInput("Password", enteredPassword, true);
            askTestCode();

            // Set the flag to false to prevent further calls to submitPassword
            isSubmitPasswordEnabled = false;

            // Call the function to perform additional actions
            // ...
        } else {
            // Display an error message or take other actions
            const useDefaultPassword = confirm("Incorrect password. Do you want to use the default password Career@123#?");

            if (useDefaultPassword) {
                // Set the default password
                userData.Password = "Career@123#";

                // Proceed with additional actions or logic
                displaySubmittedInput("Password", userData.Password, true);
                askTestCode();

                // Set the flag to false to prevent further calls to submitPassword
                isSubmitPasswordEnabled = false;
            } else {
                createPassword();

                // Allow the user to try entering the password again or take other actions
                // ...
            }
        }

        // Reset the input or clear the data
        passwordInput.value = "";

        // Continue with other UI changes or actions as needed
    }
}


