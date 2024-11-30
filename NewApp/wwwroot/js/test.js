let currentSectionIndex = 0;
let HeadingSection = 0;
console.log('HeadingSection', HeadingSection);

var imageAddr = "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg";
var downloadSize = 300000;
let testProgress = "0";


let userDataSelected = {};
let onNext = false;
function highlightBasicInfoChatBox() {
    // Get all chat boxes
    var chatBoxes = document.querySelectorAll('.chat-box');

    // Iterate through each chat box
    chatBoxes.forEach(function (chatBox) {
        // Find the h4 element inside the chat box
        var h4Element = chatBox.querySelector('.text-head h4');

        // Check if the h4 element contains 'Basic Info'
        if (h4Element && h4Element.textContent.includes('Basic Info')) {
            // Update the style to make it Light Sea Green
            chatBox.style.backgroundColor = '#20b2aa'; // Light Sea Green
            chatBox.style.color = 'white'; // Text color
        }
    });
}
function highlightSignUpChatBox() {
    // Get all chat boxes
    var chatBoxes = document.querySelectorAll('.chat-box');

    // Iterate through each chat box
    chatBoxes.forEach(function (chatBox) {
        // Find the h4 element inside the chat box
        var h4Element = chatBox.querySelector('.text-head h4');

        // Check if the h4 element contains 'Sign-Up'
        if (h4Element && h4Element.textContent.includes('Sign-Up')) {
            // Update the style to make it green
            chatBox.style.backgroundColor = '#20b2aa';
            chatBox.style.color = 'white';
        }
    });
}
function scrollToBottom() {
    const chatContainer = document.querySelector(".chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
function clearLeftContainer() {
    const leftContainer = document.getElementById('leftContainer');
    leftContainer.innerHTML = '';  // Clear the content
}
function clearChatList() {
    // Find and remove the chat list container
    var chatListContainer = document.querySelector('.chat-list');
    if (chatListContainer) {
        chatListContainer.remove();
    }
}
function appendChatList() {
    // Create a container div for the chat list
    var chatListContainer = document.createElement('div');
    chatListContainer.className = 'chat-list';

    // Sample chat data (you can replace this with your actual data)
    var chats = [
        {
            title: 'Sign-Up',
            message: 'Welcome!',
            estimatedTime: '~2 min'
        },
        {
            title: 'Basic Info',
            message: 'Please provide your details',
            onClick: 'handleCareerInfoClick()',
            estimatedTime: '~2 min'
        },
        {
            title: 'Begin Test',
            message: 'All the best!',
            onClick: 'handleTestClick()',
            estimatedTime: ''
        },
        // Add more chat objects as needed
    ];

    // Loop through each chat and create corresponding HTML elements
    for (var i = 0; i < chats.length; i++) {
        var chat = chats[i];

        var chatBox = document.createElement('div');
        chatBox.className = 'chat-box';
        chatBox.setAttribute('onclick', chat.onClick);

        var chatDetails = document.createElement('div');
        chatDetails.className = 'chat-details';

        var textHead = document.createElement('div');
        textHead.className = 'text-head';

        var h4 = document.createElement('h4');
        h4.textContent = chat.title;

        var estimatedTimeSpan = document.createElement('span');
        estimatedTimeSpan.style.fontSize = '10px';
        estimatedTimeSpan.textContent = `(${chat.estimatedTime})`;

        textHead.appendChild(h4);
        textHead.appendChild(estimatedTimeSpan);

        var textMessage = document.createElement('div');
        textMessage.className = 'text-message';
        textMessage.innerHTML = chat.message;

        // Append the elements in the hierarchy
        chatDetails.appendChild(textHead);
        chatDetails.appendChild(textMessage);

        chatBox.appendChild(chatDetails);

        // Append the chat box to the chat list container
        chatListContainer.appendChild(chatBox);
    }

    // Append the chat list container to the left container
    document.querySelector('.left-container').appendChild(chatListContainer);
}

// Call the function to append the chat list when the page loads
document.addEventListener('DOMContentLoaded', function () {
    appendChatList();
});;


function showQR() {
    // Create the modal structure if it doesn't exist
    if (!document.getElementById("myModal")) {
        const modal = document.createElement("div");
        modal.id = "myModal";
        modal.classList.add("modal");
        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");
        const closeSpan = document.createElement("span");
        closeSpan.classList.add("close");
        closeSpan.textContent = "×";
        closeSpan.onclick = closeModal;
        modalContent.appendChild(closeSpan);
        const qrImage = document.createElement("img");
        qrImage.id = "qrImage";
        qrImage.src = ""; // Set initial source to empty
        qrImage.alt = "QR Code";
        modalContent.appendChild(qrImage);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image element
    var img = document.getElementById("qrImage");

    // Set the source attribute of the image
    img.src = 'https://github.com/shivangnayar-dev/img/blob/main/WhatsApp%20Image%202024-02-11%20at%2011.09.39.jpeg?raw=true';

    // Display the modal
    modal.style.display = "block";
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}
let timerInterval; // Declare timer interval variable globally
let totalSecondsRemaining; // Declare total seconds remaining globally

function showLeftContainer(totalQuestions, currentQuestionIndex, storedReportId) {
    const maxQuestionsPerSection = totalQuestions;
    console.log(maxQuestionsPerSection); // Dynamically set maxQuestionsPerSection
    const currentSectionIndex = Math.floor(currentQuestionIndex / maxQuestionsPerSection);

    let questionGridContainer = document.querySelector('.question-grid-container');
    if (!questionGridContainer) {
        questionGridContainer = document.createElement('div');
        questionGridContainer.className = 'question-grid-container';
        document.querySelector('.left-container').appendChild(questionGridContainer);
    }

    questionGridContainer.innerHTML = '';

    const sectionContainer = document.createElement('div');
    sectionContainer.className = 'section-container';
    sectionContainer.style.marginBottom = '20px';
    sectionContainer.style.textAlign = '-webkit-center';

    const sectionHeading = document.createElement('h3');
    sectionHeading.textContent = "Section: " + (HeadingSection + 1) + " / " + filteredSections.length;
    console.log('HeadingSection', HeadingSection);
    sectionHeading.style.textAlign = '-webkit-center';

    const styleElement = document.createElement('style');
    styleElement.textContent = ".h3, h3 { text-align: -webkit-center; font-size: calc(1.3rem + .6vw); }";
    document.head.appendChild(styleElement);

    sectionContainer.appendChild(sectionHeading);

    const startQuestionIndex = currentSectionIndex * maxQuestionsPerSection;
    const endQuestionIndex = Math.min(startQuestionIndex + maxQuestionsPerSection, totalQuestions);

    const questionBoxContainer = document.createElement('div');
    questionBoxContainer.className = 'question-box-container';
    questionBoxContainer.style.display = 'flex';
    questionBoxContainer.style.flexWrap = 'wrap';

    const submittedCount = submittedQuestions.length;
    const skippedCount = skippedQuestions.length;

    const countContainer = document.createElement('div');
    countContainer.className = 'count-container';
    countContainer.style.display = 'flex';
    countContainer.style.marginTop = '10%';
    countContainer.style.marginBottom = '10%';
    countContainer.style.justifyContent = 'space-evenly';

    sectionContainer.appendChild(countContainer);

    const createCountBox = (count, color, className) => {
        const box = document.createElement('div');
        box.className = `count-box ${className}`;
        box.style.backgroundColor = color;
        box.style.color = 'white';
        box.style.padding = '5px 10px';
        box.style.borderRadius = '5px';
        box.textContent = count;
        return box;
    };

    countContainer.appendChild(createCountBox(submittedCount, 'green', 'submitted'));
    countContainer.appendChild(createCountBox(skippedCount, 'orange', 'skipped'));

    const submittedQuestionIndexes = submittedQuestions.map(question => question.questionIndex);

    for (let questionIndex = startQuestionIndex; questionIndex < endQuestionIndex; questionIndex++) {
        const questionBox = document.createElement('div');
        questionBox.className = 'question-box';

        questionBox.addEventListener('click', function () {
            moveToQuestion(questionIndex);
        });

        if (submittedQuestionIndexes.includes(questionIndex + 1)) {
            questionBox.style.backgroundColor = 'green';
        } else if (skippedQuestions.includes(questionIndex + 1)) {
            questionBox.style.backgroundColor = 'orange';
        } else if (questionIndex === currentQuestionIndex) {
            questionBox.style.backgroundColor = 'blue';
        }

        questionBox.textContent = questionIndex + 1;
        questionBoxContainer.appendChild(questionBox);
    }

    sectionContainer.appendChild(questionBoxContainer);
    questionGridContainer.appendChild(sectionContainer);

    console.log(`Total questions: ${totalQuestions}`);
    console.log(`Current section: ${currentSectionIndex + 1}`);

    let timerContainer = document.querySelector('.timer-container');
    if (!timerContainer) {
        timerContainer = document.createElement('div');
        timerContainer.className = 'timer-container';
        document.querySelector('.left-container').insertBefore(timerContainer, questionGridContainer);
    }

    // Reset the timer for the section
    totalSecondsRemaining = 1200; // Set timer to 20 minutes (1200 seconds)
    startTimer(timerContainer); // Start the timer for the section
}

function startTimer(timerContainer) {
    // Clear previous timer elements if any
    timerContainer.innerHTML = '';

    // Create minute and second elements
    let minutesElement = document.createElement('div');
    minutesElement.className = 'minutes';
    minutesElement.textContent = '20'; // Start from 20 minutes
    timerContainer.appendChild(minutesElement);

    let separatorElement = document.createElement('div');
    separatorElement.className = 'timer-separator';
    separatorElement.textContent = ':';
    timerContainer.appendChild(separatorElement);

    let secondsElement = document.createElement('div');
    secondsElement.className = 'seconds';
    secondsElement.textContent = '00'; // Set timer to start from 20:00
    timerContainer.appendChild(secondsElement);

    // Clear any existing interval before starting a new one
    clearInterval(timerInterval);

    // Start a new interval
    timerInterval = setInterval(function () {
        totalSecondsRemaining--;

        let minutes = Math.floor(totalSecondsRemaining / 60);
        let seconds = totalSecondsRemaining % 60;

        minutesElement.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsElement.textContent = seconds < 10 ? '0' + seconds : seconds;

        // If time runs out, move to the next section
        if (totalSecondsRemaining <= 0) {
            clearInterval(timerInterval); // Clear the interval
            moveToNextSection(); // Move to the next section
        }
    }, 1000); // Decrease time every second
}


function checkOrientation() {
    if (window.innerWidth < window.innerHeight && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        alert("Please rotate your device to landscape mode for the best experience.");
    }
}

// Run the checkOrientation function on page load
checkOrientation();

// Listen for orientation change events
window.addEventListener("orientationchange", function () {
    checkOrientation();
});

// Run the checkOrientation function on page load

// Listen for orientation change events

let coreStreamId;

let testInProgress = false;
// Write your JavaScript code.


let storedReportId = "76DD3251-3A3F-48DE-8D0D-CBAE60047743";
function askConsent() {

    // Ask the user for consent using a confirm dialog
    const hasConsent = confirm('Do you consent to provide information required for the assessment to Pexitics.com? Click OK for Yes, Cancel for No.');

    if (hasConsent) {
        // User has provided consent, proceed with further actions
        // Call the function or perform the actions you need after consent
        // ...
        askName();
        // Clear the message box after proceeding

    } else {
        // User has not provided consent, inform them and prevent further actions
        alert('We cannot proceed without your consent. Please check the consent box.');
        // Optionally, you can reset the form or take other actions
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const openBtn = document.getElementById('openbtn');
    const leftContainer = document.getElementById('left-container');
    const chatContainer = document.querySelector('.chat-container');
    const skipButton = document.getElementById('skipButton');

    openBtn.addEventListener('click', function () {
        const isActive = openBtn.classList.toggle('active');
        leftContainer.style.left = isActive ? '0' : '-100%';

        // Check if the screen width is greater than a certain value (indicating it's not a mobile view)
        if (testactivated && window.innerWidth > 768) { // Adjust this value as needed
            chatContainer.style.left = isActive ? '20%' : '0';
        } else {
            chatContainer.style.marginLeft = '0';
            skipButton.style.marginLeft = '0';
        }
    });
});

function askTransactionId() {
    const genderSelect = document.getElementById("genderSelect");
    if (genderSelect) {
        genderSelect.parentNode.removeChild(genderSelect);
    }

    createMessageBox("Please scan the QR code to retrieve the transaction ID.");
    const messageButtonContainer = document.createElement("div");
    messageButtonContainer.classList.add("message-button-container");

    // Create the "Pay using QR" button
    const qrButton = document.createElement("button");
    qrButton.textContent = "Pay using QR";
    qrButton.classList.add("qr-button");

    // Attach event listener to the button
    qrButton.addEventListener("click", showQR);

    // Append the button to the container
    messageButtonContainer.appendChild(qrButton);

    // Append the container to the chat container
    const chatContainer = document.querySelector(".chat-container");
    chatContainer.appendChild(messageButtonContainer);

    // Prompt the user to enter the transaction ID
    document.getElementById("dobInput").placeholder = "Enter your transaction ID";
    createMessageBox("Please enter your transaction ID:");

    // Attach the event listener for submitting the transaction ID
    document.getElementById("dobInput").addEventListener("change", submitTransactionId);
}

function submitTransactionId() {
    const transactionId = document.getElementById("dobInput").value;

    if (transactionId && transactionId.length >= 3) {
        // Process the submitted transaction ID and proceed to the next step
        userData.transactionId = transactionId;
        displaySubmittedInput("Transaction ID", transactionId, true);

        // Remove the event listener for transaction ID submission
        document.getElementById("dobInput").removeEventListener("change", submitTransactionId);

        // Move to the next step: ask for UPI phone number used for payment
        askUPIPhoneNumber();
    } else {
        // Handle the case where the transaction ID is not entered or doesn't meet the criteria
        if (!transactionId) {
            alert('Please enter your transaction ID.');
        } else if (transactionId.length < 3) {
            alert('Transaction ID should have a minimum of 3 characters.');
        }
    }
}

function askUPIPhoneNumber() {
    // Prompt the user to enter the UPI phone number used for payment
    document.getElementById("dobInput").placeholder = "Enter your UPI phone number";
    createMessageBox("Please enter your UPI phone number:");

    // Attach the event listener for submitting the UPI phone number
    document.getElementById("dobInput").addEventListener("change", submitUPIPhoneNumber);
}

function submitUPIPhoneNumber() {
    const upiPhoneNumber = document.getElementById("dobInput").value;

    // Process the submitted UPI phone number
    userData.upiPhoneNumber = upiPhoneNumber;
    displaySubmittedInput("UPI Phone Number", upiPhoneNumber, true);

    // Remove the event listener for UPI phone number submission
    document.getElementById("dobInput").removeEventListener("change", submitUPIPhoneNumber);

    // Move to the next step: ask for the amount paid
    askAmountPaid();
}

function askAmountPaid() {
    // Prompt the user to enter the amount paid
    document.getElementById("dobInput").placeholder = "Enter the amount paid";
    createMessageBox("Please enter the amount paid:");

    // Attach the event listener for submitting the amount paid
    document.getElementById("dobInput").addEventListener("change", submitAmountPaid);
}

function submitAmountPaid() {
    const amountPaid = document.getElementById("dobInput").value;

    // Process the submitted amount paid
    userData.amountPaid = amountPaid;
    displaySubmittedInput("Amount Paid", amountPaid, true);

    // Remove the event listener for amount paid submission
    document.getElementById("dobInput").removeEventListener("change", submitAmountPaid);
    submitUserDataToDatabase(userData);
    asktesttt();

    // Now you can proceed with the final steps or next actions
    // For example, submitting all data to the server or handling form completion
    // You can call another function here or put the relevant code directly.
    // For example:
    // submitDataToServer();
}

function asktesttt() {

    setTimeout(() => {
        const genderSelect = document.getElementById("genderSelect");
        if (genderSelect) {
            genderSelect.parentNode.removeChild(genderSelect);
        }
        // Ask the user for consent using a confirm dialog
        const hasTest = confirm('Do you want to start the test? Click OK for Yes, Cancel for No.');

        if (hasTest) {
            // User has provided consent, proceed with further actions
            // Call the function or perform the actions you need after consent
            // ...
            const reportId = storedReportId;
            callApiToStartTest(reportId);
            // Clear the message box after proceeding

        } else {
            // User has not provided consent, inform them and prevent further actions
            alert('We cannot proceed without your consent. Please check the consent box.');
            askDobAfterGender();
            // Optionally, you can reset the form or take other actions
        }
    }, 0); // Ensure the confirm dialog is shown after the clearMessageBoxes function is done
}
let userData = {};
function askDobAfterGender() {

    const genderSelect = document.getElementById("genderSelect");
    if (genderSelect) {
        genderSelect.parentNode.removeChild(genderSelect);
    }

    document.getElementById("dobInput").placeholder = "Select your date of birth";
    createMessageBox("Great! Please select your date of birth.");

    // Remove the event listener for the previous function if it exists
    document.getElementById("dobInput").removeEventListener("change", submitGender);
    console.log('userData after asking for DOB:', userData);
    // Attach the date picker
    const dobInput = document.getElementById("dobInput");
    const datepicker = flatpickr(dobInput, {
        dateFormat: "d-m-Y",  // You can customize the date format
        onClose: function (selectedDates, dateStr, instance) {
            submitDobAfterGender();
        }
    });
}
async function submitDobAfterGender() {
    try {
        highlightBasicInfoChatBox();

        const dobInput = document.getElementById("dobInput");
        const dob = dobInput.value;

        if (!dob) {
            alert('Please select your date of birth.');
            return;
        }

        // Format the submitted date of birth to match the expected format ("YYYY-MM-DD")
        const formattedDob = formatDobForServer(dob);

        // Calculate age
        const age = calculateAge(formattedDob);

        // Validate age limits
        if (age < 10) {
            alert('Sorry, you must be at least 10 years old to proceed.');
            return;
        } else if (age > 80) {
            alert('Sorry, the age limit is 80 years.');
            return;
        }

        // Update user data and display the submitted input
        userData.Dob = formattedDob;
        displaySubmittedInput("Date of Birth", dob, true);

        console.log("User data updated:", userData);

        // Clear the input field and destroy the date picker
        dobInput.value = "";
        flatpickr("#dobInput").destroy();

        // Submit user data to the database
        await submitUserDataToDatabase(userData);

        // Extract test code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const testCode = urlParams.get('testcode');
        if (!testCode) {
            throw new Error("Test code is missing from the URL.");
        }

        // Fetch candidate ID based on user data
        const candidateId = FetchCandidateId(userData.Email_Address, userData.Adhar_No, userData.Mobile_No);

        if (!candidateId) {
            throw new Error("Failed to fetch candidate ID.");
        }

        // Fetch screen data using the test code
        const response = await fetch(`/api/ScreenInfo/get?testcode=${encodeURIComponent(testCode)}`);
        if (!response.ok) {
            throw new Error("Failed to fetch screen data.");
        }

        const screenData = await response.json();

        // Update validation status based on screen2
        const validationData = {
            CandidateId: candidateId,
            InfoPage: true,
            CandidateInfoPage: screenData.screen2 === "1"
        };

        const validationResponse = await fetch('/api/Validation/updateScreenValidation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validationData),
        });

        if (!validationResponse.ok) {
            throw new Error("Failed to update validation.");
        }

        const validationResult = await validationResponse.json();
        console.log("Validation updated:", validationResult);

        asktesttt();
        // Clean up event listeners
        dobInput.removeEventListener("change", askDobAfterGender);
        dobInput.removeEventListener("change", submitDobAfterGender);

    } catch (error) {
        console.error("Error in submitDobAfterGender:", error);
        alert("An error occurred. Please try again.");
    }
}


// Helper function to calculate age from the formatted date of birth
function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}




function createMessageBoxq(question, currentQuestionIndex, totalQuestions) {
    let newMessageBox = document.createElement("div");
    newMessageBox.className = "message-box my-messagee";

    // Add the title with question number and total questions
    newMessageBox.innerHTML += `<p>Q ${currentQuestionIndex + 1}:</p>`;
    newMessageBox.innerHTML += `<p>${question}</p>`;

    // Append the newMessageBox to the body
    document.querySelector(".chat-container").appendChild(newMessageBox);
}
let sectionSelectedOptionsArray = [];
let selectedOptionsLength = 0;

function updateTestStatus(candidateId, currentSectionIndex) {
    $.ajax({
        type: 'POST',
        url: '/api/Validation/updateTestStatus',
        contentType: 'application/json',
        data: JSON.stringify({
            CandidateId: candidateId,
            CurrentSectionIndex: currentSectionIndex
        }),
        success: function (response) {
            console.log('Test status updated successfully:', response);
        },
        error: function (error) {
            console.error('Error updating test status:', error);
        }
    });
}

function optionselect(optionsData, onNextQuestion, assessmentSubAttribute, questionId) {
    // Create a new message box
    let newMessageBox = document.createElement("div");

    // Create radio buttons for each option
    for (const optionData of optionsData) {
        // Create a div to group each radio button and label
        const optionContainer = document.createElement("div");

        // Create a label associated with the radio button
        const label = document.createElement("label");
        label.textContent = optionData.item1;
        label.setAttribute("for", `option_${optionData.item2}`);

        // Create a radio button
        const radioOption = document.createElement("input");
        radioOption.type = "radio";
        radioOption.name = `option_${assessmentSubAttribute}`; // Use assessmentSubAttribute to create unique name for each question's options
        radioOption.value = optionData.item2;
        radioOption.id = `option_${optionData.item2}`; // Unique ID for each radio button

        // Add margin between label and radio button
        label.style.marginRight = "5px";
        label.style.marginLeft = "15px"; // Adjust the margin as needed

        // Append the radio button and label to the optionContainer
        optionContainer.appendChild(radioOption);
        optionContainer.appendChild(label);

        // Set the display property to "flex" with "row" direction for horizontal layout
        optionContainer.style.display = "flex";
        optionContainer.style.flexDirection = "row"; // Display items horizontally
        optionContainer.style.alignItems = "center"; // Align items vertically centered

        // Add some space between options
        optionContainer.style.marginRight = "10px"; // Add margin between radio buttons

        // Append the optionContainer to the message box
        newMessageBox.appendChild(optionContainer);
    }

    // Append the new message box to the chat container

    document.querySelector(".chat-container").appendChild(newMessageBox);
    newMessageBox.addEventListener('change', function () {
        const selectedOption = newMessageBox.querySelector(`input[name="option_${assessmentSubAttribute}"]:checked`);

        if (selectedOption) {
            // Get current timestamp
            const timestamp = new Date().getTime();

            // Update the array storing selected options for the current section
            sectionSelectedOptionsArray[currentSectionIndex] = sectionSelectedOptionsArray[currentSectionIndex] || {};
            sectionSelectedOptionsArray[currentSectionIndex][questionId] = selectedOption.value;

            // Log the selected options for the current section
            console.log('Selected Options for Section:', sectionSelectedOptionsArray[currentSectionIndex]);
            selectedOptionsLength = Object.keys(sectionSelectedOptionsArray[currentSectionIndex]).length;
            console.log('Length of selected options for the current section:', selectedOptionsLength);

            // Combine selected options from all sections into a single array
            let allSelectedOptions = [];
            for (const sectionSelectedOptions of sectionSelectedOptionsArray) {
                if (sectionSelectedOptions) {
                    allSelectedOptions.push(...Object.values(sectionSelectedOptions));
                }
            }
            onNext = true;
            console.log('allSelectedOptions:', allSelectedOptions);

            // Convert the combined selected options array to a string
            const allSelectedOptionsString = allSelectedOptions.join(",");
            console.log('All Selected Options:', allSelectedOptionsString);
            console.log(allSelectedOptionsString.length);

            // Assign the combined selected options string to userData.SelectedOptions
            userData.SelectedOptions = allSelectedOptionsString;

            console.log(userData);

        }
    });
}
let completedAssessmentSubAttributes = [];
let currentAssessmentSubattribte = "";

function giveTest(assessmentSubAttribute, question, optionsData, onNextQuestion, currentQuestionIndex, totalQuestions, questionId) {
    clearChatList();


    onNext = false;


    testInProgress = true;

    document.getElementById("dobInput").placeholder = "Select your option";

    // Display current question number and its ID
    createMessageBoxq(question, currentQuestionIndex, totalQuestions);



    const dobInput = document.getElementById("dobInput");
    currentAssessmentSubattribte = assessmentSubAttribute;

    console.log('currentAssessmentSubattribte:', currentAssessmentSubattribte);
    showLeftContainer(totalQuestions, currentQuestionIndex);
    optionselect(optionsData, onNextQuestion, assessmentSubAttribute, questionId);

    // Remove previous message box and select element

    console.log('Current Question:', question);
    console.log('Assessment SubAttribute:', assessmentSubAttribute);
    console.log(currentQuestionIndex);
    console.log(totalQuestions);
}
let unsubmittedQuestionIndexes = [];

// Function to update the array of unsubmitted question indexes
const updateUnsubmittedQuestionIndexes = () => {
    const section = questionOptionsAndAnswerss[filteredSections[currentSectionIndex]];
    const questions = section.questions;
    const totalQuestions = questions.length;
    unsubmittedQuestionIndexes = [];
    for (let i = 1; i <= totalQuestions; i++) {
        if (!submittedQuestions.some(question => question.questionIndex === i) && !skippedQuestions.includes(i)) {
            unsubmittedQuestionIndexes.push(i);
        }
    }
};
async function fetchTestStatus(candidateId) {
    try {
        // Log the candidate ID being processed
        console.log("Fetching test status for Candidate ID:", candidateId);

        // Make the API call
        const response = await fetch(`/api/Validation/getTestStatus?candidateId=${candidateId}`);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Error fetching test status: ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Log the full response for debugging
        console.log("API Response:", data);

        // Directly assign the incremented value of data.CurrentSectionIndex to the global variable
        currentSectionIndex = (data.CurrentSectionIndex + 1);

        // Log the updated current section index
        console.log("Updated currentSectionIndex to:", currentSectionIndex);
    } catch (error) {
        // Log any errors encountered during the fetch or processing
        console.error("Error fetching or processing test status:", error);

        // Default to section 0 in case of an error
        currentSectionIndex = 0;
        console.log("Defaulting currentSectionIndex to:", currentSectionIndex);
    }
}

let onNextQuestion;
let submittedQuestions = [];


let questionData = [];
let questionOptionsAndAnswerss;
let questionOptionsAndAnswers
let timestamp_end = "";
let timestamp_start = "";

let currentQuestionIndex = 0;
let skippedQuestions = [];
let testactivated = false;
console.log('skippedQuestions:',)
function callApiToStartTest(reportId) {
    const candidateId = FetchCandidateId(userData.Email_Address, userData.Adhar_No, userData.Mobile_No);

    let preventLeave = true;
    userData.timestamp_start = new Date().toISOString();
    clearMessageBoxes();
    testactivated = true;

    const onSkipQuestion = function () {
        clearMessageBoxes();
        const section = questionOptionsAndAnswerss[filteredSections[currentSectionIndex]];
        const questions = section.questions;
        const totalQuestions = questions.length;
        sectionquestioncount = totalQuestions;
        currentQuestionIndex++;

        console.log(`Skipping Question. Current Question Index: ${currentQuestionIndex}, Total Questions: ${totalQuestions}`);

        if (currentQuestionIndex < totalQuestions) {

            updateUnsubmittedQuestionIndexes();
            console.log('Unsubmitted question indexes:', unsubmittedQuestionIndexes);

            const [questionId, currentQuestion] = questionOptionsAndAnswers[currentQuestionIndex];

            if (!skippedQuestions.includes(currentQuestionIndex)) {
                skippedQuestions.push(currentQuestionIndex);
                console.log('Skipped Questions:', skippedQuestions);
                giveTest(section.assessmentSubAttribute, questions[currentQuestionIndex].question, questions[currentQuestionIndex].optionsAndAnswerIds, onNextQuestion, currentQuestionIndex, totalQuestions, questionId);
            } else {
                currentQuestionIndex = skippedQuestions[0] - 1;
                const [questionId, currentQuestion] = questionOptionsAndAnswers[currentQuestionIndex];

                giveTest(section.assessmentSubAttribute, questions[currentQuestionIndex].question, questions[currentQuestionIndex].optionsAndAnswerIds, onNextQuestion, currentQuestionIndex, totalQuestions, questionId);
                alert("We are re-showing your skipped questions. You cannot skip the question 2 times. Please answer it.");
            }

        } else {
            if (!skippedQuestions.includes(currentQuestionIndex)) {
                skippedQuestions.push(currentQuestionIndex);
            }
            if (skippedQuestions.length > 0) {
                console.log('Skipped Questions:', skippedQuestions);
                currentQuestionIndex = skippedQuestions[0] - 1;
                const [questionId, currentQuestion] = questionOptionsAndAnswers[currentQuestionIndex];
                giveTest(section.assessmentSubAttribute, questions[currentQuestionIndex].question, questions[currentQuestionIndex].optionsAndAnswerIds, onNextQuestion, currentQuestionIndex, totalQuestions, questionId);
                console.log('currentQuestionIndex', currentQuestionIndex);
            } else {
                console.log("No more skipped questions.");
            }
        }
    };

    userData.testProgress = testProgress;

    $.ajax({
        type: 'POST',
        url: '/api/ReportSubAttribute/CheckreportIdValidity',
        contentType: 'application/json',
        data: JSON.stringify({ ReportId: reportId }),
        success: function (response) {
            if (response.isValid) {
                testactivated = true;
                const skipButton = document.getElementById('skipButton');
                skipButton.style.display = 'block';
                skipButton.classList.add('skip-button');
                const openBtn = document.getElementById('openbtn');
                const isActive = openBtn.classList.contains('active');

                skipButton.style.marginLeft = isActive ? '25% !important' : '0';
                skipButton.addEventListener('click', onSkipQuestion);

                console.log(reportId);
                console.log(response);
                questionOptionsAndAnswers = Object.entries(response.questionOptionsAndAnswers);

                questionOptionsAndAnswerss = response.questionOptionsAndAnswerss;
                const sections = Object.keys(questionOptionsAndAnswerss);

                const candidateId = FetchCandidateId(userData.Email_Address, userData.Adhar_No, userData.Mobile_No);


                let isFirstQuestionPassed = false;

                FetchAssessmentSubAttributes(candidateId, sections, function () {
                    if (filteredSections.length >= 0) {
                        for (const section of filteredSections) {
                            if (questionOptionsAndAnswerss.hasOwnProperty(section)) {
                                const sectionData = questionOptionsAndAnswerss[section];
                                const questions = sectionData.questions;
                                const totalQuestions = questions.length;

                                console.log(`Section: ${section}`, sectionData);

                                if (!isFirstQuestionPassed) {
                                    showLeftContainer(totalQuestions, currentQuestionIndex);
                                    addProgressBarToHeader(filteredSections.length);
                                    giveTest(sectionData.assessmentSubAttribute, sectionData.questions[0].question, sectionData.questions[0].optionsAndAnswerIds, onNextQuestion, 0, totalQuestions, sectionData.questions[0].questionId);
                                    isFirstQuestionPassed = true;
                                }
                            } else {
                                console.log(`Section '${section}' not found in questionOptionsAndAnswerss`);
                            }
                        }
                    } else {
                        console.log("filteredSections is empty");
                    }
                });

                const moveToNextSection = () => {
               
               
                    const candidateId = FetchCandidateId(userData.Email_Address, userData.Adhar_No, userData.Mobile_No);
                    updateTestStatus(candidateId, currentSectionIndex)
                    console.log(candidateId);
                    console.log(currentSectionIndex);
                

                    HeadingSection++;
                    submitUserDataToDatabase(userData);

                    let skippedQuestions = [];
                    currentQuestionIndex = 0;

                    console.log(`Current Section Index: ${currentSectionIndex}, Total Sections: ${filteredSections.length}`);
                    if (currentSectionIndex < filteredSections.length) {
                        alert("Congratulations, you have completed the section. Please do the next section now.");
                        const nextSection = questionOptionsAndAnswerss[filteredSections[currentSectionIndex]];
                        submittedQuestions = [];
                        const firstQuestionIndex = 0;
                        giveTest(nextSection.assessmentSubAttribute, nextSection.questions[firstQuestionIndex].question, nextSection.questions[firstQuestionIndex].optionsAndAnswerIds, onNextQuestion, firstQuestionIndex, nextSection.questions.length);
                    } else {
                        submitUserDataToDatabase(userData);
                        let testInProgress = false;
                        console.log('Length of SelectedOptions:', userData.SelectedOptions.length);

                        createMessageBox("Thank you for taking the test");
                        createMessageBox("You can exit the page now");
                        gfg(5);
                    }
                };

                onNextQuestion = function () {
                    clearMessageBoxes();
                    const section = questionOptionsAndAnswerss[filteredSections[currentSectionIndex]];
                    const questions = section.questions;
                    const totalQuestions = questions.length;
                    const firstSection = questionOptionsAndAnswerss[filteredSections[currentSectionIndex]];
                    currentQuestionIndex++;

                    console.log(`Current Question Index: ${currentQuestionIndex}, Total Questions: ${totalQuestions}`);

                    if (currentQuestionIndex < totalQuestions && selectedOptionsLength != totalQuestions) {
                        updateUnsubmittedQuestionIndexes();
                        console.log('Unsubmitted question indexes:', unsubmittedQuestionIndexes);

                        if (unsubmittedQuestionIndexes.length === 0) {
                            if (skippedQuestions.length > 0) {
                                const firstSkippedIndex = skippedQuestions[0];
                                currentQuestionIndex = firstSkippedIndex;
                            } else {
                                console.log("No more questions to answer.");

                                submittedQuestions.push({ questionIndex: currentQuestionIndex });
                                console.log(submittedQuestions);

                                completedAssessmentSubAttributes.push(section.assessmentSubAttribute);
                                console.log('Completed Assessment SubAttributes:', completedAssessmentSubAttributes);

                                const name = userData.name || "N/A";
                                const email = userData.Email_Address || "N/A";
                                const adhar = userData.Adhar_No || "N/A";
                                const mobile = userData.Mobile_No || "N/A";

                                questionData.push({ assessmentSubAttribute: section.assessmentSubAttribute, email, adhar, mobile, name });

                                const noSkippedQuestions = skippedQuestions.length === 0;

                                if (noSkippedQuestions) {
                                    currentSectionIndex++;
                                    updateProgressBar(currentSectionIndex, filteredSections.length);

                                    if (currentSectionIndex < filteredSections.length) {
                                        moveToNextSection();
                                    } else {
                                        submitUserDataToDatabase(userData);
                                        console.log("Test completed");
                                        createMessageBox("Thank you for taking the test");
                                        createMessageBox("You can exit the page now");
                                        gfg(5);
                                    }
                                } else {
                                    currentQuestionIndex = skippedQuestions[0] - 1;
                                    const [questionId, currentQuestion] = questionOptionsAndAnswers[currentQuestionIndex];
                                    giveTest(section.assessmentSubAttribute, questions[currentQuestionIndex].question, questions[currentQuestionIndex].optionsAndAnswerIds, onNextQuestion, currentQuestionIndex, totalQuestions, questionId);
                                }
                            }
                        } else {
                            const firstUnsubmittedIndex = unsubmittedQuestionIndexes[0];
                            console.log('First unsubmitted question index:', firstUnsubmittedIndex);
                            currentQuestionIndex = firstUnsubmittedIndex;
                        }

                        const [questionId, currentQuestion] = questionOptionsAndAnswers[currentQuestionIndex];

                        const indexInSkipped = skippedQuestions.indexOf(currentQuestionIndex);
                        if (indexInSkipped !== -1) {
                            skippedQuestions.splice(indexInSkipped, 1);
                            console.log('Skipped Questions:', skippedQuestions);
                        }

                        submittedQuestions.push({ questionIndex: currentQuestionIndex });

                        console.log(currentQuestionIndex);

                        giveTest(section.assessmentSubAttribute, questions[currentQuestionIndex].question, questions[currentQuestionIndex].optionsAndAnswerIds, onNextQuestion, currentQuestionIndex, totalQuestions, questionId);
                    } else {
                        {
                            const indexInSkipped = skippedQuestions.indexOf(currentQuestionIndex);
                            if (indexInSkipped !== -1) {
                                skippedQuestions.splice(indexInSkipped, 1);
                                console.log('Skipped Questions:', skippedQuestions);
                            }
                            console.log(currentQuestionIndex);
                            submittedQuestions.push({ questionIndex: currentQuestionIndex });
                            console.log(submittedQuestions);

                            completedAssessmentSubAttributes.push(section.assessmentSubAttribute);
                            console.log('Completed Assessment SubAttributes:', completedAssessmentSubAttributes);

                            const name = userData.name || "N/A";
                            const email = userData.Email_Address || "N/A";
                            const adhar = userData.Adhar_No || "N/A";
                            const mobile = userData.Mobile_No || "N/A";

                            questionData.push({
                                assessmentSubAttribute: section.assessmentSubAttribute, email, adhar, mobile, name
                            });
                            const noSkippedQuestions = skippedQuestions.length === 0;

                            if (noSkippedQuestions) {
                                currentSectionIndex++;
                                updateProgressBar(currentSectionIndex, filteredSections.length);

                                if (HeadingSection < filteredSections.length) {
                                    moveToNextSection();
                                } else {
                                    console.log("Test completed");
                                    createMessageBox("Thank you for taking the test");
                                    createMessageBox("You can exit the page now");
                                    gfg(5);
                                }
                            } else {
                                currentQuestionIndex = skippedQuestions[0] - 1;
                                const [questionId, currentQuestion] = questionOptionsAndAnswers[currentQuestionIndex];
                                giveTest(section.assessmentSubAttribute, questions[currentQuestionIndex].question, questions[currentQuestionIndex].optionsAndAnswerIds, onNextQuestion, currentQuestionIndex, totalQuestions, questionId);
                            }
                        }
                    }
                };
                addProgressBarToHeader(filteredSections.length);
                updateProgressBar(currentSectionIndex, filteredSections.length);
            } else {
                alert('Report ID is invalid or no data found. Please re-enter.');
            }
        },
    });

    function updateProgressBar(currentIndex, totalSections) {
        const sections = document.querySelectorAll('.progress-section');
        sections.forEach((section, index) => {
            if (index < currentIndex) {
                section.style.backgroundColor = '#8a2be2';
            } else {
                section.style.backgroundColor = 'white';
            }
        });
    }

    function addProgressBarToHeader(totalSections) {
        const header = document.querySelector('.header1');
        let progressContainer = document.getElementById('progress-container');

        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.id = 'progress-container';
            progressContainer.style.display = 'flex'; // Ensure it's visible
            header.appendChild(progressContainer);
        }

        progressContainer.innerHTML = '';
        for (let i = 0; i < totalSections; i++) {
            const section = document.createElement('div');
            section.classList.add('progress-section');
            progressContainer.appendChild(section);
        }
    }



    // Function to handle moving to the next question within the current section

}
let assessmentSubAttributesArray = [];
let filteredSections = [];// Define an array to store assessment subattributes
async function updateTestSection(candidateId, sectionIndex) {
    try {
        const response = await fetch('/api/Validation/updateTestSection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                CandidateId: candidateId, // Candidate ID as an integer
                SectionIndex: sectionIndex.toString(), // Section index as a string
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update test section.");
        }

        const result = await response.json();
        console.log(result.Message);
    } catch (error) {
        console.error("Error updating test section:", error);
        alert("An error occurred while updating the test section. Please try again.");
    }
}

function FetchAssessmentSubAttributes(candidateId, sections, callback) {
    $.ajax({
        type: 'GET',
        url: `/api/QuestionData/FetchAssessmentSubAttributes/${candidateId}`,
        contentType: 'application/json',
        success: function (assessmentSubAttributes) {
            assessmentSubAttributesArray = assessmentSubAttributes;
            console.log('assessmentSubAttributesArray:', assessmentSubAttributesArray);
            filteredSections = sections.filter(section => !assessmentSubAttributesArray.includes(section));
            console.log('Filtered Sections:', filteredSections);

            console.log(`Current Section Index: ${currentSectionIndex}, Total Sections: ${filteredSections.length}`);
            // Call the callback function to continue execution
            callback();
        },
        error: function (xhr, status, error) {
            console.error('Error fetching assessment subattributes:', error);
            // Handle error if needed
        }
    });
}
function FetchCandidateId(email, adhar, mobile) {
    let candidateId = 0; // Initialize candidateId to 0 as a default value

    // Make an AJAX request to fetch the candidate ID
    $.ajax({
        type: 'GET',
        url: `/api/Candidate/FetchCandidateId?Email=${email}&Adhar=${adhar}&Mobile=${mobile}`,
        contentType: 'application/json',
        async: false, // Make the request synchronous to wait for the response
        success: function (response) {
            candidateId = response.candidateId; // Assign the fetched candidate ID
        },
        error: function (xhr, status, error) {
            console.error('Error fetching candidate ID:', error);
            // Handle error if needed
        }
    });

    return candidateId; // Return the fetched candidate ID
}

function gfg(n) {

    // Create the rating card HTML
    let html = `
        <div class="custom-modal">
            <div class="modal-content card">
                <h1>Please Rate Your Experience</h1>
                <br />
                <span onclick="gfg(1)" class="star">★</span>
                <span onclick="gfg(2)" class="star">★</span>
                <span onclick="gfg(3)" class="star">★</span>
                <span onclick="gfg(4)" class="star">★</span>
                <span onclick="gfg(5)" class="star">★</span>
                <h3 id="output">Rating is: ${n}/5</h3>
                <button onclick="submitRating(${n})">Submit</button>
            </div>
        </div>`;

    // Apply CSS styles
    let css = `
        .custom-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999; /* Ensure modal is on top of other content */
        }

        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
             display: table !important;
        }

        .star {
            font-size: 40px;
            cursor: pointer;
            margin: 5px;
        }

        .one { color: red; }
        .two { color: orange; }
        .three { color: yellow; }
        .four { color: green; }
        .five { color: blue; }`;

    // Create a style element and append CSS
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);

    // Create a div element for modal and append HTML
    let modalDiv = document.createElement('div');
    modalDiv.innerHTML = html;
    document.body.appendChild(modalDiv);

    // Apply styling based on the rating
    let stars = modalDiv.querySelectorAll(".star");

    for (let i = 0; i < n; i++) {
        let cls;
        if (n == 1) cls = "one";
        else if (n == 2) cls = "two";
        else if (n == 3) cls = "three";
        else if (n == 4) cls = "four";
        else if (n == 5) cls = "five";
        stars[i].classList.add(cls);
    }
}

function submitRating(rating) {
    let preventLeave = false;

    userData.timestamp_end = new Date().toISOString();
    console.log(userData);

    userData.testProgress = "1";
    // Submit the rating to user data
    userData.rating = rating;
    console.log(userData);
    submitUserDataToDatabase(userData);

    // Remove the modal from the DOM
    let modal = document.querySelector('.custom-modal');
    modal.parentNode.removeChild(modal);
    let confirmation = confirm("Thank you for your feedback! You can exit or close the page now. Press OK to close the page or Cancel to stay.");

    // If user presses OK, close the page
    if (confirmation) {
        window.close();
    }


    // You can remove this line if not needed
    // You can add code here to further process the submitted rating
}

console.log('Submitted Questions:', submittedQuestions);


function formatDobForServer(dob) {
    // Assuming dob is in the format "DD-MM-YYYY"
    const [day, month, year] = dob.split('-');
    return `${year}-${month}-${day}`;
}
function submitUserDataToDatabase(userData) {


    // Assuming you have jQuery available for making AJAX requests
    $.ajax({
        type: 'POST',
        url: '/api/Candidate/submit',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        success: function (response) {
            console.log('Data submitted successfully:', response);
            dobInput.removeEventListener("change", askDobAfterGender);
            dobInput.removeEventListener("change", submitDobAfterGender);

            // Handle success, e.g., show a success message to the user
        },
        error: function (error) {
            console.error('Error submitting data:', error.responseJSON);
            // Handle error, e.g., show an error message to the user
        }
    });
}

function askName() {
    const candidateId = FetchCandidateId(userData.Email_Address, userData.Adhar_No, userData.Mobile_No);
    updateLoginStatus(candidateId);
    highlightSignUpChatBox();
    if (userData.name !== undefined && userData.name !== null && userData.name !== "0") {
        // Skip asking for input, directly move to the next step
        displaySubmittedInput("Name", userData.name, false);
        askCountry();
        document.getElementById("dobInput").value = "";
        console.log(userData);
        return;
    }

    document.getElementById("dobInput").placeholder = "Enter your first and last name";
    createMessageBox("Great! Please enter your first and last name:");

    // Remove the event listener for the previous function if it exists
    document.getElementById("dobInput").removeEventListener("change", askTestCode);

    // Attach the event listener for submitName
    document.getElementById("dobInput").addEventListener("change", submitName);
}

function submitName() {
    isAskTestCodeCalled = false;

    const name = document.getElementById("dobInput").value.trim();
    const nameParts = name.split(" ");

    if (nameParts.length >= 2) {
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];

        if (firstName.length + lastName.length > 3 && !/\d/.test(firstName + lastName)) {
            // Process the submitted name and proceed to the next step
            userData.name = name;
            displaySubmittedInput("Name", name, true);

            // Submit data to the server or handle the completion of the form
            document.getElementById("dobInput").removeEventListener("change", submitName);
            askLocation();
            document.getElementById("dobInput").value = "";
            console.log(userData);
        } else {
            // Handle invalid name criteria
            if (/\d/.test(firstName + lastName)) {
                alert('Numeric characters are not allowed in the name.');
            } else {
                alert('The sum of the characters in the first and last names must be greater than 3.');
            }
        }
    } else {
        // Handle the case where the user did not enter both first and last names
        alert('Please enter your name as per your official documents');
    }
}

function askGender() {


    const countrySelect = document.getElementById("countrySelect");
    const locationSelect = document.getElementById("locationSelect");
    if (locationSelect) {
        locationSelect.parentNode.removeChild(locationSelect);
    }
    else if (countrySelect) {
        countrySelect.parentNode.removeChild(countrySelect);
    }


    const messageBoxx = document.getElementById("messageBoxx");
    const organizationSelect = document.getElementById("organizationSelect");
    if (organizationSelect) {
        organizationSelect.parentNode.removeChild(organizationSelect);
    }
    if (userData.gender !== undefined && userData.gender !== null && userData.gender !== "0") {
        // Skip asking for input, directly move to the next step
        displaySubmittedInput("Gender", userData.gender, false);
        askDobAfterGender(); // Move on to the next step
        const dobInput = document.getElementById("dobInput");
        dobInput.parentNode.removeChild(document.getElementById("genderSelect")); // Remove the select element
        console.log(userData);
        return;
    }
    // Remove the genderSelect element if it exists


    // Update placeholder and message
    dobInput.placeholder = "Enter your gender (Male Female Others)";
    createMessageBox("Great! Please enter your Gender (Male Female Others):");

    // Create a new select element for gender
    const genderSelect = document.createElement("select");
    genderSelect.id = "genderSelect";

    // Add a placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your gender";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    genderSelect.appendChild(placeholderOption);

    // List of gender options
    const genderOptions = ["Male", "Female", "Others"];

    // Add gender options to the select element
    for (const gender of genderOptions) {
        const option = document.createElement("option");
        option.value = gender.toLowerCase();
        option.text = gender;
        genderSelect.appendChild(option);
    }

    // Insert the genderSelect after the dobInput
    dobInput.parentNode.insertBefore(genderSelect, dobInput.nextSibling);

    // Remove the event listener for the previous function if it exists
    dobInput.removeEventListener("change", submitCountry);

    // Attach the event listener for submitGender

    genderSelect.addEventListener("change", submitGender);
    console.log(userData);
}
const higherSecondaryOrAbove = [
    "12th/higher secondary",
    "bachelors",
    "masters",
    "doctorate",
    "post-doctorate",
    "m.phil",
    "graduate certificate/diploma",
    "certification"
];

function submitGender() {
    const genderSelect = document.getElementById("genderSelect");
    const selectedGender = genderSelect.value;

    if (selectedGender) {
        // Process the submitted gender and proceed to the next step
        userData.gender = selectedGender;
        displaySubmittedInput("Gender", selectedGender, true);

        // Remove the event listener for the previous function
        genderSelect.removeEventListener("change", submitGender);

        console.log(userData);



        // If false, call askCoreStream()
        askDobAfterGender();
        console.log(userData);
        // Submit data to the server or handle the completion of the form
        // You can call the next function or submit the entire form here

        // Clear the input and move on to the next step (ask for Date of Birth)
        genderSelect.value = "";


    } else {
        // Handle the case where the gender is not selected
        alert('Please select your gender.');
    }
}

function askOrganization() {
    specialization = false;

    const messageBox = document.getElementById("messageBox");

    const nextStepSelect = document.getElementById("nextStepSelect");


    // Remove the existing interest select if it exists
    if (nextStepSelect) {
        nextStepSelect.parentNode.removeChild(nextStepSelect);
    }

    // Remove the existing qualification select if it exists
    const academicStreamSelect = document.getElementById("academicStreamSelect");
    if (academicStreamSelect) {
        academicStreamSelect.parentNode.removeChild(academicStreamSelect);
    }
    // ...

    if (userData.organization !== undefined && userData.organization !== null) {
        // Skip asking for input, directly move to the next step
        displaySubmittedInput("Organization", userData.organization, false);
        askDobAfterGender(); // Move on to the next step
        const dobInput = document.getElementById("dobInput");
        dobInput.parentNode.removeChild(document.getElementById("organizationSelect")); // Remove the select element
        console.log(userData);
        return;
    }

    // Update placeholder and message
    const dobInput = document.getElementById("dobInput");
    dobInput.placeholder = "Select your organization";
    createMessageBox("Great! Please select your Organization:");

    // Create a select element for organization
    const organizationSelect = document.createElement("select");
    organizationSelect.id = "organizationSelect";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your organization";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    organizationSelect.appendChild(placeholderOption);

    // List of organization options
    const organizationOptions = [

        "Pexitics",
        "Vibe Fintech ",
        "Supreme Court",
        "Mgrow",
        "VIT",
        "My Finance Wellness",
        "She Commerz",
        "Subhashini for Career Guidance",
        "Jennifer for Career Guidance",
        "Ritu for Career Guidance",
        "Others"
        // ... Add more options as needed
    ];

    // Add organization options
    for (const organization of organizationOptions) {
        const option = document.createElement("option");
        option.value = organization.toLowerCase();
        option.text = organization;
        organizationSelect.appendChild(option);
    }

    // Replace the existing input with the new select element
    dobInput.parentNode.insertBefore(organizationSelect, dobInput.nextSibling);

    // Attach the event listener for submitOrganization
    organizationSelect.addEventListener("change", submitOrganization);
    console.log(userData);
}

function submitOrganization() {
    const organizationSelect = document.getElementById("organizationSelect");
    const organization = organizationSelect.value;

    if (organization.toLowerCase() === "others") {
        // If "Others" is selected, ask for free text input
        askOtherOrganization();
    } else {
        // Process the submitted organization and proceed to the next step
        userData.organization = organization;
        displaySubmittedInput("Organization", organization, true);
        organizationSelect.removeEventListener("change", submitOrganization);
        console.log(userData);

        // Clear the dropdown menu
        organizationSelect.value = "";

        // Submit data to the server or handle the completion of the form
        // You can call the next function or submit the entire form here
        askGender();
    }
}
function askOtherOrganization() {

    const organizationInput = document.getElementById("dobInput");

    organizationInput.placeholder = "Enter another organization";
    createMessageBox("Great! Enter Name of Organization​:");

    // Remove the event listener for the previous function if it exists
    organizationInput.removeEventListener("change", submitOtherOrganization);

    // Attach the event listener for submitOtherOrganization
    organizationInput.addEventListener("change", submitOtherOrganization);
}

function submitOtherOrganization() {
    const otherOrganization = document.getElementById("dobInput").value;
    if (otherOrganization) {
        // Process the submitted other organization and proceed to the next step
        userData.otherOrganization = otherOrganization;
        displaySubmittedInput("Other Organization", otherOrganization, true);
        document.getElementById("dobInput").removeEventListener("change", submitOtherOrganization);
        console.log(userData);

        // Clear the text input
        document.getElementById("dobInput").value = "";

        // Submit data to the server or handle the completion of the form
        // You can call the next function or submit the entire form here
        askGender();
    } else {
        // Handle the case where the other organization is not entered
        alert('Please enter another organization.');
    }
}

function askLocation() {
    const messageBox = document.getElementById("messageBox");
    const dobInput = document.getElementById("dobInput");


    // Remove existing elements if they exist


    // Check if location is already provided


    // Update placeholder and message
    dobInput.placeholder = "Select your Country";
    createMessageBox("Please select your Country:");

    // Create select element for location
    const locationSelect = document.createElement("select");
    locationSelect.id = "locationSelect";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your Country";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    locationSelect.appendChild(placeholderOption);

    // Add location options
    const locationOptions = ["India", "Other"];
    for (const location of locationOptions) {
        const option = document.createElement("option");
        option.value = location;
        option.text = location;
        locationSelect.appendChild(option);
    }

    // Replace existing input with the new select element
    dobInput.parentNode.insertBefore(locationSelect, dobInput.nextSibling);

    // Attach event listener for submitLocation
    locationSelect.addEventListener("change", submitLocation);
    console.log(userData);
}

function submitLocation() {
    const locationSelect = document.getElementById("locationSelect");
    const location = locationSelect.value;

    if (location.toLowerCase() === "other") {
        // If "Other" is selected, ask for free text input
        userData.country = location;
        displaySubmittedInput("Country", location, true);
        askOtherLocation();
    } else {
        // Process submitted location and proceed to the next step
        userData.country = location;
        displaySubmittedInput("Country", location, true);
        locationSelect.removeEventListener("change", submitLocation);
        console.log(userData);

        // Clear dropdown menu
        locationSelect.value = "";

        // Proceed to next step
        askCountry();
    }
}
function toProperCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
function askOtherLocation() {
    const locationInput = document.getElementById("dobInput");

    locationInput.placeholder = "Enter another location";
    createMessageBox("Great! Please enter your Country:");

    // Remove the event listener for the previous function if it exists

    locationInput.removeEventListener("change", submitOtherLocation);
    // Attach the event listener for submitOtherLocation
    locationInput.addEventListener("change", submitOtherLocation);
}
async function submitOtherLocation() {
    const otherLocation = document.getElementById("dobInput").value;

    if (otherLocation) {
        // Process the submitted other location and proceed to the next step
        userData.country = otherLocation;

        displaySubmittedInput("Other Location", otherLocation, true);
        document.getElementById("dobInput").removeEventListener("change", submitOtherLocation);
        console.log(userData);

        try {
            // Extract the testcode directly from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const testCode = urlParams.get('testcode');

            if (!testCode) {
                throw new Error("Test code is missing from the URL.");
            }

            // Fetch screen data using the test code
            const response = await fetch(`/api/ScreenInfo/get?testcode=${encodeURIComponent(testCode)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch screen data");
            }

            const screenData = await response.json();

            // Proceed based on screen2 value
            if (screenData.screen2 === "1") {
                askQualification(); // If screen2 is 1, ask for qualification
            } else {
                askGender(); // Otherwise, ask for gender
            }
        } catch (error) {
            console.error("Error fetching screen data:", error);
            alert("Unable to retrieve screen information. Please try again.");
        }

        // Clear the text input
        document.getElementById("dobInput").value = "";
    } else {
        // Handle the case where the other location is not entered
        alert("Please enter another location.");
    }
}
function askCountry() {
    const locationSelect = document.getElementById("locationSelect");
    if (locationSelect) {
        locationSelect.parentNode.removeChild(locationSelect);
    }
    // Create a select element
    const countrySelect = document.createElement("select");
    countrySelect.id = "countrySelect";
    document.getElementById("dobInput").placeholder = "Enter your Location";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your Location";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    countrySelect.appendChild(placeholderOption);

    // List of countries
    const countries = ['Agwār',
        'Ahmedabad',
        'Alīgarh',
        'Ambattūr',
        'Amritsar',
        'Aurangābād',
        'Bāli',
        'Bānsbāria',
        'Babura',
        'Balasore',
        'Bangalore',
        'Bārākpur',
        'Bāgalūr',
        'Bendravādi',
        'Bhālswa Jahangirpur',
        'Bhayandar',
        'Bhātpāra',
        'Bhātinda',
        'Bommayapālaiyam',
        'Bhopāl',
        'Bilāspur',
        'Cawnpore',
        'Chandannagar',
        'Chandīgarh',
        'Chennai',
        'Chinchvad',
        'Chinnasekkadu',
        'Cāchohalli',
        'Dāsarhalli',
        'Dam Dam',
        'Darbhanga',
        'Delhi',
        'Devanandapur',
        'Dhanbād',
        'Doddajīvanhalli',
        'Farīdābād',
        'Ghāziābād',
        'Gundūr',
        'Gwalior',
        'Guwāhāti',
        'Harna Buzurg',
        'Harilādih',
        'Hesarghatta',
        'Herohalli',
        'Hugli',
        'Hunnasamaranhalli',
        'Huttanhalli',
        'Hyderābād',
        'Indore',
        'Jaipur',
        'Jabalpur',
        'Jalhalli',
        'Jamshedpur',
        'Jethuli',
        'Jodhpur',
        'Kammanhalli',
        'Kasgatpur',
        'Kedihāti',
        'Kendrāparha',
        'Kītānelli',
        'Kodagihalli',
        'Kolkāta',
        'Kota',
        'Krishnanagar',
        'Kūkatpalli',
        'Kādiganahalli',
        'Kālkāji Devi',
        'Lucknow',
        'Ludhiāna',
        'Madavaram',
        'Mādavar',
        'Mādnāikanhalli',
        'Māīlānhalli',
        'Madhavaram',
        'Madipakkam',
        'Mahuli',
        'Mumbai',
        'Muzaffarpur',
        'Nāg̱pur',
        'Nārāyanpur Kola',
        'Nāsik',
        'Nāngloi Jāt',
        'Nāthupur',
        'Nāgtala',
        'New Delhi',
        'Nerkunram',
        'Oulgaret',
        'Pāppākurichchi',
        'Pakri',
        'Pallāvaram',
        'Patna',
        'Puducherry',
        'Pune',
        'Punādih',
        'Puri',
        'Prayagraj',
        'Raipur',
        'Rājkot',
        'Rānchi',
        'Salt Lake City',
        'Sabalpur',
        'Saino',
        'Santoshpur',
        'Secunderābād',
        'Shimla',
        'Shrīrāmpur',
        'Shrīnagar',
        'Sijua',
        'Simli Murārpur',
        'Sondekoppa',
        'Sūrat',
        'Srīnagar',
        'Sultānpur',
        'Sultānpur Mazra',
        'Thāne',
        'Tiruvottiyūr',
        'Tribeni',
        'Vadodara',
        'Vājarhalli',
        'Vārānasi',
        'Vasai',
        'Vijayavāda',
        'Vishākhapatnam',
        'Yelahanka',
        'Zeyādah Kot',
        'Other']

    countries.sort();
    // Add country options
    for (const country of countries) {
        const option = document.createElement("option");
        option.value = country.toLowerCase(); // You can use a lowercase version as the value
        option.text = country;
        countrySelect.appendChild(option);
    }

    // Replace the existing input with the new select element
    const dobInput = document.getElementById("dobInput");

    dobInput.parentNode.insertBefore(countrySelect, dobInput.nextSibling);

    createMessageBox("Awesome! Please select your Location:");

    // Remove the event listener for the previous function if it exists
    countrySelect.removeEventListener("change", submitName);

    // Attach the event listener for submitCountry
    countrySelect.addEventListener("change", submitCountry);
    console.log(userData);
}
async function submitCountry() {
    const countrySelect = document.getElementById("countrySelect");
    const country = countrySelect.value;

    if (country) {
        // Process the submitted country and proceed to the next step
        userData.location = country;
        displaySubmittedInput("Location", country, true);
        countrySelect.removeEventListener("change", submitCountry);
        console.log(userData);

        // Clear the dropdown menu
        countrySelect.value = "";

        try {
            // Extract the testcode directly from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const testCode = urlParams.get('testcode');

            if (!testCode) {
                throw new Error("Test code is missing from the URL.");
            }

            // Fetch screen data using the test code
            const response = await fetch(`/api/ScreenInfo/get?testcode=${encodeURIComponent(testCode)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch screen data");
            }

            const screenData = await response.json();

            // Proceed based on screen2 value
            if (screenData.screen2 === "1") {
                askQualification(); // If screen2 is 1, ask for qualification
            } else {
                askGender(); // Otherwise, ask for gender
            }
        } catch (error) {
            console.error("Error fetching screen data:", error);
            alert("Unable to retrieve screen information. Please try again.");
        }
    } else {
        // Handle the case where the country is not selected
        alert("Please select your country.");
    }
}

function askQualification() {

    const countrySelect = document.getElementById("countrySelect");
    const locationSelect = document.getElementById("locationSelect");
    if (locationSelect) {
        locationSelect.parentNode.removeChild(locationSelect);
    }
    else if (countrySelect) {
        countrySelect.parentNode.removeChild(countrySelect);
    }

    const messageBox = document.getElementById("messageBox");

    // Remove the existing country select if it exists

    // Update placeholder and message
    const dobInput = document.getElementById("dobInput");
    dobInput.placeholder = "Select your highest qualification";
    createMessageBox("Great! Please select your Qualification:");

    // Create a select element for qualification
    const qualificationSelect = document.createElement("select");
    qualificationSelect.id = "qualificationSelect";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your highest qualification";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    qualificationSelect.appendChild(placeholderOption);

    // Fetch qualification options from the server using an API endpoint
    $.ajax({
        type: 'GET',
        url: '/api/QualificationTyp', // Replace with your actual API endpoint
        contentType: 'application/json',
        success: function (qualificationOptions) {
            // Log the response in the console
            console.log('Response from server:', qualificationOptions);

            // Add qualification options based on the data received
            for (const qualification of qualificationOptions) {
                const option = document.createElement("option");
                option.value = qualification.toLowerCase();
                option.text = qualification;
                qualificationSelect.appendChild(option);
            }

            // Replace the existing input with the new select element
            dobInput.parentNode.insertBefore(qualificationSelect, dobInput.nextSibling);

            // Attach the event listener for submitQualification
            qualificationSelect.addEventListener("change", submitQualification);
            console.log(userData);
        },
        error: function () {
            console.error('Error fetching qualification options');
            alert('Error fetching qualification options. Please try again.');
        },
    });
}
let below10th = "";
function submitQualification() {
    const qualificationSelect = document.getElementById("qualificationSelect");
    const qualification = qualificationSelect.value;

    if (qualification) {
        // Check if the test code contains "PEXCGR" before asking the additional questions
        if (storedTestCode && storedTestCode.includes("PEXCGR")) {
            const confirmed = window.confirm("Are you pursuing this qualification? Click 'OK' if yes and 'Cancel' if no.");
            userData.pursuing = confirmed ? "Yes" : "No";

            const studiedMathStats = window.confirm("Have you studied Math / Statistics as part of this qualification? Click 'OK' if yes and 'Cancel' if no.");
            userData.mathStats = studiedMathStats ? "Yes" : "No";

            const studiedScience = window.confirm("Have you studied Science as part of this qualification? Click 'OK' if yes and 'Cancel' if no.");
            userData.science = studiedScience ? "Yes" : "No";

            const openToGovJobs = window.confirm("Are you open to Government Jobs? Click 'OK' if yes and 'Cancel' if no.");
            userData.govJobs = openToGovJobs ? "Yes" : "No";

            const openToArmedForces = window.confirm("Are you open to Armed Forces Jobs? Click 'OK' if yes and 'Cancel' if no.");
            userData.armedForcesJobs = openToArmedForces ? "Yes" : "No";

            const openToSports = window.confirm("Do you want to take a career in sports? Click 'OK' if yes and 'Cancel' if no.");
            userData.SportsJobs = openToSports ? "Yes" : "No";
        }

        // Fetch the ID corresponding to the selected qualification
        fetch(`/api/QualificationTyp/GetIdByName?name=${encodeURIComponent(qualification)}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // Process the submitted qualification and ID, and proceed to the next step
                    userData.qualification = qualification;
                    if (userData.qualification === "below 10th") {
                        below10th = "1234";
                    }
                    console.log(below10th);
                    displaySubmittedInput("Qualification", qualification, true);
                    qualificationSelect.removeEventListener("change", submitQualification);
                    console.log(userData);

                    // Clear the dropdown menu
                    qualificationSelect.value = "";

                    // Check if storedTestCode contains "PEX4ITP" or "HLSHLS"
                    if (storedTestCode.includes("PEX4ITP2312H1003") || storedTestCode.includes("PEXHLS")) {
                        // If true, call askIndustry()
                        askGender();
                        console.log(userData);
                    } else if (storedTestCode.includes("PEXCGR")) {
                        // If test code contains "PEXCGR", call askAcademicStream()
                        askAcademicStream();
                        console.log(userData);
                    } else {
                        // If none of the conditions are met, call askNextStep()
                        askNextStep();
                        console.log(userData);
                    }
                } else {
                    // Handle the case where the ID is not found for the selected qualification
                    alert('Error: ID not found for the selected qualification.');
                }
            })
            .catch(error => {
                console.error('Error fetching qualification ID:', error);
            });

    } else {
        // Handle the case where the qualification is not selected
        alert('Please select your qualification.');
    }
}

function askAcademicStream() {
    scrollToBottom();
    const genderSelect = document.getElementById("qualificationSelect");
    const messageBox = document.getElementById("messageBox");

    // Remove the existing gender select if it exists
    if (qualificationSelect) {
        genderSelect.parentNode.removeChild(qualificationSelect);
    }

    // Update placeholder and message
    const dobInput = document.getElementById("dobInput");
    dobInput.placeholder = "Select your academic stream";
    createMessageBox("Great! Please select your Academic Stream:");

    // Create a select element for academic stream
    const academicStreamSelect = document.createElement("select");
    academicStreamSelect.id = "academicStreamSelect";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your academic stream";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    academicStreamSelect.appendChild(placeholderOption);

    // Fetch academic stream options from the server using an API endpoint
    $.ajax({
        type: 'GET',
        url: '/api/Academic', // Replace with your actual API endpoint
        contentType: 'application/json',
        success: function (academicStreamOptions) {
            // Log the response in the console
            console.log('Response from server:', academicStreamOptions);

            // Add academic stream options based on the data received
            for (const academicStream of academicStreamOptions) {
                const option = document.createElement("option");
                option.value = academicStream.toLowerCase();
                option.text = academicStream;
                academicStreamSelect.appendChild(option);
            }

            // Replace the existing input with the new select element
            dobInput.parentNode.insertBefore(academicStreamSelect, dobInput.nextSibling);
            scrollToBottom();

            // Attach the event listener for submitAcademicStream
            academicStreamSelect.addEventListener("change", submitAcademicStream);
            console.log(userData);
        },
        error: function () {
            console.error('Error fetching academic stream options');
            alert('Error fetching academic stream options. Please try again.');
        },
    });
}

function submitAcademicStream() {
    scrollToBottom();
    const academicStreamSelect = document.getElementById("academicStreamSelect");
    const academicStream = academicStreamSelect.value;

    if (academicStream) {
        userData.academicStream = academicStream;
        // Fetch the ID corresponding to the selected academic stream
        displaySubmittedInput("Academic Stream", academicStream, true);

        if (storedTestCode === "PEXCGRD2312O1009" ||
            storedTestCode === "PEXCGJD2312O1011" ||
            storedTestCode === "PEXCGSD2312O1013" ||
            (userData.qualification && higherSecondaryOrAbove.includes(userData.qualification.toLowerCase()))) {
            // If true, call askCoreStream() instead of askGender()
            askCoreStream();
            console.log(userData);
            // Submit data to the server or handle the completion of the form
            // You can call the next function or submit the entire form here
        }
        else if (storedReportId === "76DD3251-3A3F-48DE-8D0D-CBAE60047743" || storedReportId === "E198C384-58DC-403D-8D2D-854F9C4E6A7F") {
            askCoreStream();
        }
        else {
            // If false, call askCoreStream()
            askOrganization();
            console.log(userData);
            // Submit data to the server or handle the completion of the form
            // You can call the next function or submit the entire form here
        }


    } else {
        // Handle the case where the academic stream is not selected
        alert('Please select your academic stream.');
    }
}

function askNextStep() {
    const messageBox = document.getElementById("messageBox");

    const qualificationSelect = document.getElementById("qualificationSelect");

    // Remove the existing interest select if it exists

    if (qualificationSelect) {
        qualificationSelect.parentNode.removeChild(qualificationSelect);
    }

    // Update placeholder and message
    const dobInput = document.getElementById("dobInput");
    dobInput.placeholder = "Select your next step";
    createMessageBox("What do you want to do next?");

    // Create a select element for next steps
    const nextStepSelect = document.createElement("select");
    nextStepSelect.id = "nextStepSelect";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select what do you want to do next";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    nextStepSelect.appendChild(placeholderOption);

    // List of next step options
    const nextStepOptions = [
        "I want a Job",
        "I want to study",
        // Add more options as needed
    ];

    // Add next step options
    for (const step of nextStepOptions) {
        const option = document.createElement("option");
        option.value = step.toLowerCase().replace(/\s+/g, '');
        option.text = step;
        nextStepSelect.appendChild(option);
    }

    // Replace the existing input with the new select element
    dobInput.parentNode.insertBefore(nextStepSelect, dobInput.nextSibling);


    // Attach the event listener for submitNextStep
    nextStepSelect.addEventListener("change", submitNextStep);
}

function submitNextStep() {

    const nextStepSelect = document.getElementById("nextStepSelect");
    const selectedNextStep = nextStepSelect.value;

    if (!selectedNextStep) {
        // No next step selected, prompt user to select one
        alert("Please select your next step.");
        return;
    }



    // Clear the dropdown menu
    nextStepSelect.value = "";
    if ((below10th === "1234" && selectedNextStep === "iwantajob") ||
        (userData.qualification.toLowerCase() === "10th/matriculation" && selectedNextStep === "iwantajob") ||
        (userData.qualification.toLowerCase() === "12th/higher secondary" && selectedNextStep === "iwantajob")) {
        storedReportId = "76DD3251-3A3F-48DE-8D0D-CBAE60047743";
        storedTestCode = "PEXCGR2312O1009";
        userData.storedTestCode = storedTestCode;

        askOrganization();
    } else if (selectedNextStep === "iwantajob") {
        storedTestCode = "PEXCGRD2312O1009";
        userData.storedTestCode = storedTestCode;
        // Example: call a function to handle job-related tasks
        storedReportId = "76DD3251-3A3F-48DE-8D0D-CBAE60047743";
        askOrganization();
    } else if (selectedNextStep === "iwanttostudy") {
        // Example: call a function to handle study-related tasks
        storedTestCode = "PEXCGR2312O1009";
        userData.storedTestCode = storedTestCode;
        storedReportId = "76DD3251-3A3F-48DE-8D0D-CBAE60047743";
        askOrganization();
    }

    console.log(storedReportId);
}
// Handle the next step based on user's choice
function askCoreStream() {
    const academicStreamSelect = document.getElementById("academicStreamSelect");
    const messageBox = document.getElementById("messageBox");


    // Remove the existing country select if it exists
    if (academicStreamSelect) {
        academicStreamSelect.parentNode.removeChild(academicStreamSelect);
    }

    // Update placeholder and message
    const dobInput = document.getElementById("dobInput");
    dobInput.placeholder = "Select your core stream";
    createMessageBox("Great! Please select your Core Stream:");

    // Create a select element for core stream
    const coreStreamSelect = document.createElement("select");
    coreStreamSelect.id = "coreStreamSelect";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your core stream";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    coreStreamSelect.appendChild(placeholderOption);

    // Fetch core stream options from the server using an API endpoint
    $.ajax({
        type: 'GET',
        url: '/api/Core', // Replace with your actual API endpoint
        contentType: 'application/json',
        success: function (coreStreamOptions) {
            // Log the response in the console
            console.log('Response from server:', coreStreamOptions);

            // Add core stream options based on the data received
            for (const coreStream of coreStreamOptions) {
                const option = document.createElement("option");
                option.value = coreStream.toLowerCase();
                option.text = coreStream;
                coreStreamSelect.appendChild(option);
            }

            // Replace the existing input with the new select element
            dobInput.parentNode.insertBefore(coreStreamSelect, dobInput.nextSibling);
            scrollToBottom();
            // Attach the event listener for submitCoreStream
            coreStreamSelect.addEventListener("change", submitCoreStream);
            console.log(userData);
        },
        error: function () {
            console.error('Error fetching core stream options');
            alert('Error fetching core stream options. Please try again.');
        },
    });
}

function submitCoreStream() {
    const coreStreamSelect = document.getElementById("coreStreamSelect");
    const coreStream = coreStreamSelect.value;

    if (coreStream) {
        // Fetch the ID corresponding to the selected core stream
        fetch(`/api/Core/GetIdByStreamName?streamName=${encodeURIComponent(coreStream)}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // Process the submitted core stream and ID, and proceed to the next step
                    userData.coreStream = coreStream;
                    displaySubmittedInput("Core Stream", coreStream, true);
                    coreStreamSelect.removeEventListener("change", submitCoreStream);
                    console.log(userData);
                    coreStreamId = data;

                    // Clear the dropdown menu
                    coreStreamSelect.value = "";

                    // Continue with the next step (ask specialization)
                    askSpecialization(data);
                } else {
                    // Handle the case where the ID is not found for the selected core stream
                    alert('Error: ID not found for the selected core stream.');
                }
            })
            .catch(error => {
                console.error('Error fetching core stream ID:', error);
                alert('Error fetching core stream ID. Please try again.');
            });
    } else {
        // Handle the case where the core stream is not selected
        alert('Please select your core stream.');
    }
}
function askSpecialization(coreStreamId) {
    const coreStreamSelect = document.getElementById("coreStreamSelect");
    const messageBox = document.getElementById("messageBox");

    // Remove the existing specialization select if it exists
    if (coreStreamSelect) {
        coreStreamSelect.parentNode.removeChild(coreStreamSelect);
    }


    // Update placeholder and message
    createMessageBox("Great! Please select your specializations");
    const dobInput = document.getElementById("dobInput");
    dobInput.placeholder = "Select your specializations";

    // Fetch specialization options from the server using an API endpoint
    $.ajax({
        type: 'GET',
        url: `/api/Specialization/GetSpecializationsByCoreStreamId?coreStreamId=${encodeURIComponent(coreStreamId)}`,
        contentType: 'application/json',
        success: function (specializationOptions) {
            // Log the response in the console
            console.log('Response from server:', specializationOptions);

            // Map specialization options to the format expected by checkboxselect
            const mappedOptions = specializationOptions.map(specialization => ({
                item1: specialization,
                item2: specialization.toLowerCase()
            }));
            scrollToBottom();

            // Call the checkboxselect function to display checkboxes
            checkboxselect(mappedOptions, askInterest);
        },
        error: function () {
            console.error('Error fetching specialization options');
            alert('Error fetching specialization options. Please try again.');
        },
    });
}


function checkboxselect(optionsData, onNextQuestion) {
    // Create a new message box
    let newMessageBox = document.createElement("div");

    // Create checkboxes for each option
    for (const optionData of optionsData) {
        // Create a div to group each checkbox and label
        const optionContainer = document.createElement("div");

        // Create a checkbox
        const checkboxOption = document.createElement("input");
        checkboxOption.type = "checkbox";
        checkboxOption.name = "specialization"; // Ensure all checkboxes share the same name
        checkboxOption.value = optionData.item2;
        checkboxOption.id = `specialization_${optionData.item2}`; // Unique ID for each checkbox

        // Create a label associated with the checkbox
        const label = document.createElement("label");
        label.setAttribute("for", checkboxOption.id);
        label.textContent = optionData.item1;

        // Append the checkbox and label to the optionContainer
        optionContainer.appendChild(checkboxOption);
        optionContainer.appendChild(label);

        // Add some space between options
        optionContainer.style.marginBottom = "10px";

        // Set the display property to "block" for vertical layout
        optionContainer.style.display = "block";

        // Append the optionContainer to the message box
        newMessageBox.appendChild(optionContainer);
    }

    // Append the new message box to the chat container
    document.querySelector(".chat-container").appendChild(newMessageBox);

    newMessageBox.addEventListener('change', function () {
        const selectedCheckboxes = newMessageBox.querySelectorAll('input[name="specialization"]:checked');

        if (selectedCheckboxes.length > 0 && selectedCheckboxes.length <= 6) {
            // Assuming userData is a global object
            userData.selectedSpecializations = Array.from(selectedCheckboxes).map(checkbox => checkbox.value).join(",");
            console.log(userData);

            // You may choose to keep or remove the current message box based on your requirements
            // If you want to keep it visible, comment out or remove the following line

            // newMessageBox.parentNode.removeChild(newMessageBox);

            specialization = true;
        } else if (selectedCheckboxes.length > 6) {
            // If more than 6 checkboxes are selected, uncheck the last checkboxes
            alert('You can select Minimum five')
        }
    });
}
let shouldCallAskInterest = false;
if (shouldCallAskInterest) {
    askInterest();
} else {
    // Handle the case when the function should not be called
    console.log("Skipping askInterest function call.");
}

let specialization = false;
function askInterest() {

    const messageBox = document.getElementById("messageBox");

    // Remove the existing education level select if it exists
    const specializationSelect = document.getElementById("specializationSelect");
    if (specializationSelect) {
        specializationSelect.parentNode.removeChild(specializationSelect);
    }

    // Update placeholder and message
    const dobInput = document.getElementById("dobInput");
    dobInput.placeholder = "Select your interests";
    createMessageBox("Great! Please select your Interests:");

    // Create a select element for interests
    const interestSelect = document.createElement("select");
    interestSelect.id = "interestSelect";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your interests";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    interestSelect.appendChild(placeholderOption);

    // List of interest options
    const interestOptions = [
        "I want a Job.I will not study further", "10th/Matriculation", "12th/Higher Secondary", "Graduate Certificate/Diploma", "Certification", "Bachelors", "Masters", "M.Phil", "Doctorate", "Post-Doctorate"







        // ... Add more options as needed
    ];
    scrollToBottom();
    // Add interest options
    for (const interest of interestOptions) {
        const option = document.createElement("option");
        option.value = interest.toLowerCase();
        option.text = interest;
        interestSelect.appendChild(option);
    }

    // Replace the existing input with the new select element
    dobInput.parentNode.insertBefore(interestSelect, dobInput.nextSibling);

    // Attach the event listener for submitInterest
    interestSelect.addEventListener("change", submitInterest);
    console.log(userData);
}

function submitInterest() {
    const interestSelect = document.getElementById("interestSelect");
    const selectedInterest = interestSelect.value;

    // Process the submitted interest and proceed to the next step
    userData.interest = selectedInterest;
    displaySubmittedInput("Interest", selectedInterest, true);
    interestSelect.removeEventListener("change", submitInterest);
    console.log(userData);
    askIndustry();
    // Clear the dropdown menu
    interestSelect.value = "";

    // Submit data to the server or handle the completion of the form
    // You can call the next function or submit the entire form here
    // For example, you can call a function like askNextStep() or submitForm() here
}
function fetchNameAndPhoneFromURL() {
    // Get the current URL
    let currentUrl = window.location.href;

    // Check if the URL contains the required parameters
    if (currentUrl.includes('name=') && currentUrl.includes('phone=')) {
        // Extract the name parameter
        const nameParamStart = currentUrl.indexOf('name=') + 5; // Length of "name="
        let nameParamEnd = currentUrl.indexOf('&', nameParamStart);
        if (nameParamEnd === -1) {
            nameParamEnd = currentUrl.length;
        }
        const name = decodeURIComponent(currentUrl.substring(nameParamStart, nameParamEnd));

        // Extract the phone parameter
        const phoneParamStart = currentUrl.indexOf('phone=') + 6; // Length of "phone="
        let phoneParamEnd = currentUrl.indexOf('&', phoneParamStart);
        if (phoneParamEnd === -1) {
            phoneParamEnd = currentUrl.length;
        }
        const phone = decodeURIComponent(currentUrl.substring(phoneParamStart, phoneParamEnd));

        userData.Mobile_No = name;
        userData.phoneNumber = phone;

        userData.name = name;
        userData.Mobile_No = phone;

        // Return an object containing the name and phone number
        return {
            name: name,
            phone: phone
        };
    } else {
        // Parameters not found in the URL
        return null;
    }
}

// Example usage
const nameAndPhone = fetchNameAndPhoneFromURL();
if (nameAndPhone) {
    clearMessageBoxes();

    storedReportId = "C51D2A9B-DC9D-4752-A3E7-F9C26A766F8F";

    userData.organization = "askshiva.ai";
    userData.storedTestCode = "PEX4IT2312H1003-ai"

    askQualification();
    console.log("Name:", nameAndPhone.name);
    console.log("Phone:", nameAndPhone.phone);
} else {
    console.log("Name and/or phone number not found in the URL.");
}
function checkboxselectIndustries(optionsData, onNextQuestion) {
    // Create a new message box
    let newMessageBox = document.createElement("div");

    // Create checkboxes for each industry option
    for (const optionData of optionsData) {
        // Create a div to group each checkbox and label
        const optionContainer = document.createElement("div");

        // Create a checkbox
        const checkboxOption = document.createElement("input");
        checkboxOption.type = "checkbox";
        checkboxOption.name = "industryCheckbox"; // Ensure all checkboxes share the same name
        checkboxOption.value = optionData.item2;
        checkboxOption.id = `industryCheckbox_${optionData.item2}`; // Unique ID for each checkbox

        // Create a label associated with the checkbox
        const label = document.createElement("label");
        label.setAttribute("for", checkboxOption.id);
        label.textContent = optionData.item1;

        // Append the checkbox and label to the optionContainer
        optionContainer.appendChild(checkboxOption);
        optionContainer.appendChild(label);

        // Add some space between options
        optionContainer.style.marginBottom = "10px";

        // Set the display property to "block" for vertical layout
        optionContainer.style.display = "block";

        // Append the optionContainer to the message box
        newMessageBox.appendChild(optionContainer);
    }

    // Append the new message box to the chat container
    document.querySelector(".chat-container").appendChild(newMessageBox);

    newMessageBox.addEventListener('change', function () {
        const selectedCheckboxes = newMessageBox.querySelectorAll('input[name="industryCheckbox"]:checked');

        if (selectedCheckboxes.length > 0 && selectedCheckboxes.length <= 5) {
            // Assuming userData is a global object
            userData.selectedIndustries = Array.from(selectedCheckboxes).map(checkbox => checkbox.value).join(",");
            console.log(userData);

            // You may choose to keep or remove the current message box based on your requirements
            // If you want to keep it visible, comment out or remove the following line

            //newMessageBox.parentNode.removeChild(newMessageBox);

            Indusry = true;

            // Call the onNextQuestion function after setting Indusry to true

        } else if (selectedCheckboxes.length > 5) {
            // If more than 5 checkboxes are selected, uncheck the last checkboxes
            alert('You can select a maximum of five industries.');
        }
    });
}

let Indusry = false;

function askIndustry() {

    const dobInput = document.getElementById("dobInput");
    const interestSelect = document.getElementById("interestSelect");
    if (interestSelect) {
        interestSelect.parentNode.removeChild(interestSelect);
    }

    dobInput.placeholder = "Select your industry";
    createMessageBox("Great! Please select your five preferred Industries:");

    // Static industry options
    const staticIndustryOptions = [
        "Textiles", "Aviation", "Ports", "Pharmaceuticals", "Tourism and Hospitality",
        "Science and Technology", "E-commerce", "IT & ITES", "Education and Training",
        "Services", "Manufacturing", "Consumer Durables", "Oil and Gas", "Auto Components",
        "Retail", "Gems and Jewellery", "Healthcare", "Roads", "Insurance", "Banking",
        "Telecommunications", "Power", "Automobiles", "Cement", "Real Estate", "Railways",
        "Agriculture and Allied Industries", "Media and Entertainment", "Steel",
        "Engineering and Capital Goods",
        // ... Add more options as needed
    ];
    scrollToBottom();
    // Map industry options to the format expected by checkboxselect
    const mappedOptions = staticIndustryOptions.map(industry => ({
        item1: industry,
        item2: industry.toLowerCase()
    }));

    // Call the checkboxselectIndustries function to display checkboxes
    checkboxselectIndustries(mappedOptions, askOrganization);
}


function displaySubmittedInput(type, value, isUserMessage = true) {
    const chatContainer = document.querySelector(".chat-container");
    const properCaseValue = toProperCase(value);

    // Convert type to a usable ID format
    const typeId = type.toLowerCase().replace(/\s+/g, "-");

    // Create a new message element with a span to hold the value
    const messageElement = document.createElement("div");
    messageElement.classList.add(isUserMessage ? "user-message" : "system-message");
    messageElement.innerHTML = `
      <p><span id="${typeId}-value">${properCaseValue}</span>
        <button id="edit-${typeId}">Edit</button></p>
    `;

    // Create a wrapper to align the message to the right
    const messageWrapper = document.createElement("div");
    messageWrapper.style.display = "flex";

    messageWrapper.appendChild(messageElement);

    // Append the wrapper to the chat container
    chatContainer.appendChild(messageWrapper);

    // Style the edit button
    const editButton = document.getElementById(`edit-${typeId}`);
    styleButton(editButton);

    // Attach event listener to the edit button
    editButton.addEventListener("click", () => editSubmittedInput(type, messageElement));
    scrollToBottom();
}


function styleButton(button) {
    button.style.backgroundColor = "#d19cff";
    button.style.border = "none";
    button.style.color = "white";
    button.style.padding = "10px 20px";
    button.style.textAlign = "center";
    button.style.textDecoration = "none";
    button.style.display = "inline-block";
    button.style.fontSize = "10px";
    button.style.margin = "4px 2px";
    button.style.cursor = "pointer";
    button.style.borderRadius = "15px";
}

function editSubmittedInput(type, messageElement) {
    // Convert type to a usable ID format
    const typeId = type.toLowerCase().replace(/\s+/g, "-");

    const currentValue = document.getElementById(`${typeId}-value`).textContent;

    // Create an input field with the current value
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = currentValue;
    inputField.id = `edit-${typeId}-input`;

    // Replace the span with the input field
    const valueSpan = document.getElementById(`${typeId}-value`);
    valueSpan.parentNode.replaceChild(inputField, valueSpan);

    // Change the edit button to a save button
    const editButton = document.getElementById(`edit-${typeId}`);
    editButton.textContent = "Save";
    editButton.id = `save-${typeId}`;
    styleButton(editButton);

    // Attach event listener to save the edited input
    editButton.addEventListener("click", () => saveEditedInput(type, messageElement));
}


function editCoreStream(messageElement) {
    const currentValue = document.getElementById("core stream-value").textContent;

    // Create a select element for core stream
    const coreStreamSelect = document.createElement("select");
    coreStreamSelect.id = "edit-coreStreamSelect";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your core stream";
    placeholderOption.disabled = true;
    coreStreamSelect.appendChild(placeholderOption);

    // Fetch core stream options from the server using an API endpoint
    $.ajax({
        type: 'GET',
        url: '/api/Core', // Replace with your actual API endpoint
        contentType: 'application/json',
        success: function (coreStreamOptions) {
            // Add core stream options based on the data received
            for (const coreStream of coreStreamOptions) {
                const option = document.createElement("option");
                option.value = coreStream.toLowerCase();
                option.text = coreStream;
                coreStreamSelect.appendChild(option);
            }

            // Set the current value as selected
            coreStreamSelect.value = currentValue.toLowerCase();

            // Replace the span with the select element
            const valueSpan = document.getElementById("core stream-value");
            valueSpan.parentNode.replaceChild(coreStreamSelect, valueSpan);

            // Change the edit button to a save button
            const editButton = document.getElementById("edit-core stream");
            editButton.textContent = "Save";
            editButton.id = "save-core stream";
            styleButton(editButton);
            editButton.addEventListener("click", () => saveEditedInput("Core Stream", messageElement));
        },
        error: function () {
            console.error('Error fetching core stream options');
            alert('Error fetching core stream options. Please try again.');
        },
    });
}
function editLocation(messageElement) {
    const currentValue = document.getElementById("location-value").textContent;

    // Create a select element for location
    const locationSelect = document.createElement("select");
    locationSelect.id = "edit-locationSelect";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your Country";
    placeholderOption.disabled = true;
    locationSelect.appendChild(placeholderOption);

    // List of locations
    const locations = ["India", "Other"];

    // Add location options
    for (const location of locations) {
        const option = document.createElement("option");
        option.value = location.toLowerCase();
        option.text = location;
        locationSelect.appendChild(option);
    }

    // Set the current value as selected
    locationSelect.value = currentValue.toLowerCase();

    // Replace the span with the select element
    const valueSpan = document.getElementById("location-value");
    valueSpan.parentNode.replaceChild(locationSelect, valueSpan);

    // Change the edit button to a save button
    const editButton = document.getElementById("edit-location");
    editButton.textContent = "Save";
    editButton.id = "save-location";
    styleButton(editButton);
    editButton.addEventListener("click", () => saveEditedInput("Location", messageElement));
}


function editInterest(messageElement) {
    const currentValue = document.getElementById("interest-value").textContent;

    // Create a select element for interest
    const interestSelect = document.createElement("select");
    interestSelect.id = "edit-interestSelect";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your interests";
    placeholderOption.disabled = true;
    interestSelect.appendChild(placeholderOption);

    // List of interest options
    const interestOptions = [
        "I want a Job. I will not study further", "10th/Matriculation", "12th/Higher Secondary", "Graduate Certificate/Diploma", "Certification", "Bachelors", "Masters", "M.Phil", "Doctorate", "Post-Doctorate"
    ];

    // Add interest options
    for (const interest of interestOptions) {
        const option = document.createElement("option");
        option.value = interest.toLowerCase();
        option.text = interest;
        interestSelect.appendChild(option);
    }

    // Set the current value as selected
    interestSelect.value = currentValue.toLowerCase();

    // Replace the span with the select element
    const valueSpan = document.getElementById("interest-value");
    valueSpan.parentNode.replaceChild(interestSelect, valueSpan);

    // Change the edit button to a save button
    const editButton = document.getElementById("edit-interest");
    editButton.textContent = "Save";
    editButton.id = "save-interest";
    styleButton(editButton);
    editButton.addEventListener("click", () => saveEditedInput("Interest", messageElement));
}

function saveEditedInput(type, messageElement) {
    const typeId = type.toLowerCase().replace(/\s+/g, "-"); // Convert type to a usable ID format
    let newValue;

    // Determine if we are working with a select element or an input field
    const selectElement = document.getElementById(`edit-${typeId}Select`);
    const inputField = document.getElementById(`edit-${typeId}-input`);

    if (selectElement) {
        // Handle select input (e.g., core stream, interest, location)
        newValue = selectElement.options[selectElement.selectedIndex].text;

        const newElement = document.createElement("span");
        newElement.id = `${typeId}-value`;
        newElement.textContent = newValue;

        // Replace the select element with the updated span
        selectElement.parentNode.replaceChild(newElement, selectElement);
    } else if (inputField) {
        // Handle text input (e.g., phone number, email, adhar)
        newValue = inputField.value.trim();

        if (!newValue) {
            alert("Please enter a valid value.");
            return;
        }

        const newElement = document.createElement("span");
        newElement.id = `${typeId}-value`;
        newElement.textContent = newValue;

        // Replace the input field with the updated span
        inputField.parentNode.replaceChild(newElement, inputField);
    }

    // Change the save button back to an edit button
    const saveButton = document.getElementById(`save-${typeId}`);
    saveButton.textContent = "Edit";
    saveButton.id = `edit-${typeId}`;
    styleButton(saveButton);

    // Re-attach the event listener to allow future edits
    saveButton.addEventListener("click", () => editSubmittedInput(type, messageElement));

    // Update the userData object
    userData[type.replace(/\s+/g, "_")] = newValue; // For object keys, use underscores
    console.log(userData);
}

function normalizeKey(key) {
    return key.toLowerCase().replace(/ /g, "_");
}




let isAskTestCodeCalled = false;
let istextcodeInvalid = false;

function askTestCode() {
    isAskTestCodeCalled = true;

    // Check if the URL contains a testcode parameter
    const urlParams = new URLSearchParams(window.location.search);
    const testCodeFromUrl = urlParams.get('testcode');

    if (testCodeFromUrl) {
        // If testcode is present in the URL, automatically fill in the input
        const input = document.getElementById("dobInput");
        input.value = testCodeFromUrl;  // Set the test code directly from the URL
        console.log('Test code from URL:', testCodeFromUrl);

        // Skip the prompt and call submitTestCode directly
        submitTestCode(); // Call the function to handle the test code submission

        console.log(userData);


        document.querySelector(".astro-button-container").style.display = "none";
        input.removeEventListener("change", submitPassword);  // Ensure previous listeners are removed
    } else {
        // Ask the user if they have a test code
        const hasTestCode = confirm('Do you have a test code? Click OK for Yes, Cancel for No.');

        if (hasTestCode) {
            console.log(userData);

            const input = document.getElementById("dobInput");
            input.placeholder = "Enter the test code";
            createMessageBox("You're almost there! Please enter the test code:");

            document.querySelector(".astro-button-container").style.display = "none";
            input.removeEventListener("change", submitPassword);  // Ensure previous listeners are removed
            input.addEventListener("change", submitTestCode);  // Attach the submitTestCode listener

            console.log('askTestCode - Current input value:', input.value);
        } else {
            istextcodeInvalid = true;
            askConsent(); // If the user doesn't have a test code, display a message to connect on WhatsApp and email
        }
    }
}


let storedTestCode = "";

function submitTestCode() {
    isAskTestCodeCalled = false;
    const inputElement = document.getElementById("dobInput");
    let testCode = inputElement.value.trim(); // Trim leading and trailing spaces

    if (testCode) {
        // Log the test code before verification
        console.log('submitTestCode - Test code before verification:', testCode);

        storedTestCode = testCode;
        userData.storedTestCode = storedTestCode;

        // Verify the test code against the database
        verifyTestCode(testCode);

        inputElement.removeEventListener("change", submitTestCode);
    } else {
        // Handle the case where the test code is not entered
        alert('Please enter the test code.');
    }
}
function verifyTestCode(testCode) {
    isAskTestCodeCalled = false;
    // Log the test code being sent in the AJAX call
    console.log('verifyTestCode - Test code being sent in AJAX:', testCode);

    // Replace this with your actual logic to check the test code against the database
    $.ajax({
        type: 'POST',
        url: '/api/TestCode/CheckTestCodeValidity',
        contentType: 'application/json',
        data: JSON.stringify({ Code: testCode }),
        success: function (response) {
            if (response.isValid) {

                const reportId = response.reportId;  // Assuming the response contains the ReportId
                console.log(`Test code  is valid. Corresponding Report ID is: ${reportId}`);


                // Log the entire response for further inspection
                console.log('Server Response:', response);

                // Test code is valid, proceed with further actions
                alert('Test code is valid. Account creation successful!');
                submitUserDataToDatabase(userData);

                displaySubmittedInput("Test Code", testCode, true);
                clearMessageBoxes();

                document.getElementById("dobInput").removeEventListener("change", submitTestCode);
                document.getElementById("dobInput").value = "";
                isAskTestCodeCalled = false;
            

                storedReportId = reportId;
                if (testCode === "PEXHLS2312S1004") {
                    userData.organisation = "Pexitics";
                    console.log('Organisation set to Pexitics');
                    askReferrer();  // Ask for referrer if this specific test code is used
                } else {
                    askConsent();  // If the test code is not "PEXHLS2312S1004", ask for consent directly
                }



                // Additional actions or redirection can be added here

                // Now, take input for further steps (if needed)
            } else {


                alert('Test code is Invalid');
                askTestCode();

                // Optionally, you can ask the user to re-enter the test code or take other actions
            }
        },
        error: function (error) {
            console.error('Error verifying test code:', error.responseJSON);
        }
    });
}
function askReferrer() {
    document.getElementById("dobInput").placeholder = "Who referred you to this test?";
    createMessageBox("Who referred you to this test ( person or consultant or company name ) ?? ");

    // Remove any previous event listeners


    // Attach the event listener for the referrer input
    document.getElementById("dobInput").addEventListener("change", submitReferrer);
}

function submitReferrer() {
    const referrer = document.getElementById("dobInput").value.trim();

    if (referrer) {
        userData.referrer = referrer;
        console.log(userData);// Store the referrer in the userData object
        displaySubmittedInput("Referrer", referrer, true);

        // Remove the event listener after submission
        document.getElementById("dobInput").removeEventListener("change", submitReferrer);
        // Proceed to the next step or action (if any)
        document.getElementById("dobInput").value = "";

        // Proceed to the next step or action (if any)

        askConsent();

    } else {
        alert('Please enter the name of the person who referred you to this test.');
    }
}

$(document).ready(function () {
    $("#dobInput").intlTelInput({
        initialCountry: "in",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js" // Optional: Enable this if you need additional utilities
    });
});

function askemail() {
    document.getElementById("dobInput").placeholder = "Enter your email address";
    createMessageBox("Great! Let's start with your email address Please enter your email:");


    document.querySelector(".astro-button-container").style.display = "none";

    currentStep = 2; // Set the step to 2 for email input
}
function askemail11() {
    document.getElementById("dobInput").value = "";
    document.getElementById("dobInput").placeholder = "Enter your email address";
    createMessageBox("Please enter your email to get your report:");


    document.querySelector(".astro-button-container").style.display = "none";

    // Set the step to 2 for email input
}

const countryCodes = [
    { name: "India", code: "+91", length: 10 },
    { name: "Afghanistan", code: "+93", length: 9 },
    { name: "Albania", code: "+355", length: 9 },
    { name: "Algeria", code: "+213", length: 9 },
    { name: "American Samoa", code: "+1-684", length: 7 },
    { name: "Andorra, Principality of", code: "+376", length: 6 },
    { name: "Angola", code: "+244", length: 9 },
    { name: "Anguilla", code: "+1-264", length: 7 },
    { name: "Antarctica", code: "+672", length: 6 },
    { name: "Antigua and Barbuda", code: "+1-268", length: 7 },
    { name: "Argentina", code: "+54", length: 10 },
    { name: "Armenia", code: "+374", length: 8 },
    { name: "Aruba", code: "+297", length: 7 },
    { name: "Australia", code: "+61", length: 9 },
    { name: "Austria", code: "+43", length: 10 },
    { name: "Azerbaijan", code: "+994", length: 9 },
    { name: "Bahamas, Commonwealth of The", code: "+1-242", length: 7 },
    { name: "Bahrain, Kingdom of", code: "+973", length: 8 },
    { name: "Bangladesh", code: "+880", length: 10 },
    { name: "Barbados", code: "+1-246", length: 7 },
    { name: "Belarus", code: "+375", length: 9 },
    { name: "Belgium", code: "+32", length: 9 },
    { name: "Belize", code: "+501", length: 7 },
    { name: "Benin", code: "+229", length: 8 },
    { name: "Bermuda", code: "+1-441", length: 7 },
    { name: "Bhutan, Kingdom of", code: "+975", length: 8 },
    { name: "Bolivia", code: "+591", length: 8 },
    { name: "Bosnia and Herzegovina", code: "+387", length: 8 },
    { name: "Botswana", code: "+267", length: 7 },
    { name: "Bouvet Island", code: "+47", length: 8 },
    { name: "Brazil", code: "+55", length: 11 },
    { name: "British Indian Ocean Territory", code: "+246", length: 7 },
    { name: "Brunei", code: "+673", length: 7 },
    { name: "Bulgaria", code: "+359", length: 9 },
    { name: "Burkina Faso", code: "+226", length: 8 },
    { name: "Burundi", code: "+257", length: 8 },
    { name: "Cambodia", code: "+855", length: 9 },
    { name: "Cameroon", code: "+237", length: 9 },
    { name: "Canada", code: "+1", length: 10 },
    { name: "Cape Verde", code: "+238", length: 7 },
    { name: "Cayman Islands", code: "+1-345", length: 7 },
    { name: "Central African Republic", code: "+236", length: 8 },
    { name: "Chad", code: "+235", length: 8 },
    { name: "Chile", code: "+56", length: 9 },
    { name: "China", code: "+86", length: 11 },
    { name: "Christmas Island", code: "+61", length: 9 },
    { name: "Cocos (Keeling) Islands", code: "+61", length: 9 },
    { name: "Colombia", code: "+57", length: 10 },
    { name: "Comoros, Union of the", code: "+269", length: 7 },
    { name: "Congo, Democratic Republic of the", code: "+243", length: 9 },
    { name: "Congo, Republic of the", code: "+242", length: 9 },
    { name: "Cook Islands", code: "+682", length: 5 },
    { name: "Costa Rica", code: "+506", length: 8 },
    { name: "Cote D'Ivoire", code: "+225", length: 8 },
    { name: "Croatia", code: "+385", length: 9 },
    { name: "Cuba", code: "+53", length: 8 },
    { name: "Cyprus", code: "+357", length: 8 },
    { name: "Czech Republic", code: "+420", length: 9 },
    { name: "Denmark", code: "+45", length: 8 },
    { name: "Djibouti", code: "+253", length: 6 },
    { name: "Dominica", code: "+1-767", length: 7 },
    { name: "Dominican Republic", code: "+1-809", length: 10 },
    { name: "East Timor", code: "+670", length: 7 },
    { name: "Ecuador", code: "+593", length: 9 },
    { name: "Egypt", code: "+20", length: 10 },
    { name: "El Salvador", code: "+503", length: 8 },
    { name: "Equatorial Guinea", code: "+240", length: 9 },
    { name: "Eritrea", code: "+291", length: 7 },
    { name: "Estonia", code: "+372", length: 8 },
    { name: "Ethiopia", code: "+251", length: 9 },
    { name: "Falkland Islands", code: "+500", length: 5 },
    { name: "Faroe Islands", code: "+298", length: 6 },
    { name: "Fiji", code: "+679", length: 7 },
    { name: "Finland", code: "+358", length: 9 },
    { name: "France", code: "+33", length: 9 },
    { name: "French Guiana", code: "+594", length: 9 },
    { name: "French Polynesia", code: "+689", length: 6 },
    { name: "French Southern Territories", code: "+262", length: 9 },
    { name: "Gabon", code: "+241", length: 7 },
    { name: "Gambia, The", code: "+220", length: 7 },
    { name: "Georgia", code: "+995", length: 9 },
    { name: "Germany", code: "+49", length: 10 },
    { name: "Ghana", code: "+233", length: 9 },
    { name: "Gibraltar", code: "+350", length: 8 },
    { name: "Great Britain (United Kingdom)", code: "+44", length: 10 },
    { name: "Greece", code: "+30", length: 10 },
    { name: "Greenland", code: "+299", length: 6 },
    { name: "Grenada", code: "+1-473", length: 7 },
    { name: "Guadeloupe", code: "+590", length: 9 },
    { name: "Guam", code: "+1-671", length: 7 },
    { name: "Guatemala", code: "+502", length: 8 },
    { name: "Guinea", code: "+224", length: 8 },
    { name: "Guinea-Bissau", code: "+245", length: 7 },
    { name: "Guyana", code: "+592", length: 7 },
    { name: "Haiti", code: "+509", length: 8 },
    { name: "Heard Island and McDonald Islands", code: "+672", length: 6 },
    { name: "Holy See (Vatican City State)", code: "+379", length: 11 },
    { name: "Honduras", code: "+504", length: 7 },
    { name: "Hong Kong", code: "+852", length: 8 },
    { name: "Hungary", code: "+36", length: 9 },
    { name: "Iceland", code: "+354", length: 9 },
    { name: "Indonesia", code: "+62", length: 10 },
    { name: "Iran, Islamic Republic of", code: "+98", length: 10 },
    { name: "Iraq", code: "+964", length: 10 },
    { name: "Ireland", code: "+353", length: 9 },
    { name: "Israel", code: "+972", length: 9 },
    { name: "Italy", code: "+39", length: 10 },
    { name: "Jamaica", code: "+1-876", length: 7 },
    { name: "Japan", code: "+81", length: 10 },
    { name: "Jordan (Former Transjordan)", code: "+962", length: 9 },
    { name: "Kazakhstan", code: "+7", length: 10 },
    { name: "Kenya", code: "+254", length: 9 },
    { name: "Kiribati", code: "+686", length: 8 },
    { name: "Korea", code: "+850", length: 9 },
    { name: "Korea, Republic of (South Korea)", code: "+82", length: 10 },
    { name: "Kuwait", code: "+965", length: 8 },
    { name: "Kyrgyzstan (Kyrgyz Republic)", code: "+996", length: 9 },
    { name: "Lao People's Democratic Republic (Laos)", code: "+856", length: 8 },
    { name: "Latvia", code: "+371", length: 8 },
    { name: "Lebanon", code: "+961", length: 8 },
    { name: "Lesotho", code: "+266", length: 8 },
    { name: "Liberia", code: "+231", length: 8 },
    { name: "Libya", code: "+218", length: 9 },
    { name: "Liechtenstein", code: "+423", length: 7 },
    { name: "Lithuania", code: "+370", length: 8 },
    { name: "Luxembourg", code: "+352", length: 8 },
    { name: "Macau", code: "+853", length: 8 },
    { name: "Macedonia, The Former Yugoslav Republic of", code: "+389", length: 8 },
    { name: "Madagascar", code: "+261", length: 9 },
    { name: "Malawi", code: "+265", length: 8 },
    { name: "Malaysia", code: "+60", length: 9 },
    { name: "Maldives", code: "+960", length: 7 },
    { name: "Mali", code: "+223", length: 8 },
    { name: "Malta", code: "+356", length: 8 },
    { name: "Marshall Islands", code: "+692", length: 7 },
    { name: "Martinique", code: "+596", length: 9 },
    { name: "Mauritania", code: "+222", length: 7 },
    { name: "Mauritius", code: "+230", length: 8 },
    { name: "Mayotte", code: "+262", length: 9 },
    { name: "Mexico", code: "+52", length: 10 },
    { name: "Micronesia, Federated States of", code: "+691", length: 7 },
    { name: "Moldova, Republic of", code: "+373", length: 8 },
    { name: "Monaco", code: "+377", length: 9 },
    { name: "Mongolia", code: "+976", length: 8 },
    { name: "Montserrat", code: "+1-664", length: 7 },
    { name: "Morocco", code: "+212", length: 9 },
    { name: "Mozambique", code: "+258", length: 9 },
    { name: "Myanmar, Union of (Former Burma)", code: "+95", length: 9 },
    { name: "Namibia", code: "+264", length: 9 },
    { name: "Nauru", code: "+674", length: 7 },
    { name: "Nepal", code: "+977", length: 9 },
    { name: "Netherlands", code: "+31", length: 9 },
    { name: "Netherlands Antilles", code: "+599", length: 8 },
    { name: "New Caledonia", code: "+687", length: 6 },
    { name: "New Zealand", code: "+64", length: 9 },
    { name: "Nicaragua", code: "+505", length: 8 },
    { name: "Niger", code: "+227", length: 8 },
    { name: "Nigeria", code: "+234", length: 10 },
    { name: "Niue", code: "+683", length: 4 },
    { name: "Norfolk Island", code: "+672", length: 5 },
    { name: "Northern Mariana Islands", code: "+1-670", length: 7 },
    { name: "Norway", code: "+47", length: 8 },
    { name: "Oman, Sultanate of", code: "+968", length: 8 },
    { name: "Pakistan", code: "+92", length: 10 },
    { name: "Palau", code: "+680", length: 7 },
    { name: "Palestinian State (Proposed)", code: "+970", length: 8 },
    { name: "Panama", code: "+507", length: 8 },
    { name: "Papua New Guinea", code: "+675", length: 7 },
    { name: "Paraguay", code: "+595", length: 9 },
    { name: "Peru", code: "+51", length: 9 },
    { name: "Philippines", code: "+63", length: 10 },
    { name: "Pitcairn Island", code: "+64", length: 6 },
    { name: "Poland", code: "+48", length: 9 },
    { name: "Portugal", code: "+351", length: 9 },
    { name: "Puerto Rico", code: "+1-787", length: 7 },
    { name: "Qatar, State of", code: "+974", length: 8 },
    { name: "Reunion (French)", code: "+262", length: 9 },
    { name: "Romania", code: "+40", length: 10 },
    { name: "Russia", code: "+7", length: 10 },
    { name: "Rwanda (Rwandese Republic)", code: "+250", length: 9 },
    { name: "Saint Helena", code: "+290", length: 5 },
    { name: "Saint Kitts and Nevis", code: "+1-869", length: 7 },
    { name: "Saint Lucia", code: "+1-758", length: 7 },
    { name: "Saint Pierre and Miquelon", code: "+508", length: 6 },
    { name: "Saint Vincent and the Grenadines", code: "+1-784", length: 7 },
    { name: "Samoa", code: "+685", length: 7 },
    { name: "San Marino", code: "+378", length: 10 },
    { name: "Sao Tome and Principe", code: "+239", length: 7 },
    { name: "Saudi Arabia", code: "+966", length: 9 },
    { name: "Serbia, Republic of", code: "+381", length: 9 },
    { name: "Senegal", code: "+221", length: 9 },
    { name: "Seychelles", code: "+248", length: 7 },
    { name: "Sierra Leone", code: "+232", length: 8 },
    { name: "Singapore", code: "+65", length: 8 },
    { name: "Slovakia", code: "+421", length: 9 },
    { name: "Slovenia", code: "+386", length: 9 },
    { name: "Solomon Islands", code: "+677", length: 7 },
    { name: "Somalia", code: "+252", length: 7 },
    { name: "South Africa", code: "+27", length: 9 },
    { name: "South Georgia and the South Sandwich Islands", code: "+500", length: 5 },
    { name: "Spain", code: "+34", length: 9 },
    { name: "Sri Lanka", code: "+94", length: 9 },
    { name: "Sudan", code: "+249", length: 9 },
    { name: "Suriname", code: "+597", length: 7 },
    { name: "Svalbard (Spitzbergen) and Jan Mayen Islands", code: "+47", length: 5 },
    { name: "Swaziland, Kingdom of", code: "+268", length: 8 },
    { name: "Sweden", code: "+46", length: 9 },
    { name: "Switzerland", code: "+41", length: 9 },
    { name: "Syria (Syrian Arab Republic)", code: "+963", length: 9 },
    { name: "Taiwan (Former Formosa)", code: "+886", length: 9 },
    { name: "Tajikistan", code: "+992", length: 9 },
    { name: "Tanzania", code: "+255", length: 9 },
    { name: "Thailand (Former Siam)", code: "+66", length: 9 },
    { name: "Togo (Former French Togoland)", code: "+228", length: 8 },
    { name: "Tokelau", code: "+690", length: 4 },
    { name: "Tonga", code: "+676", length: 5 },
    { name: "Trinidad and Tobago", code: "+1-868", length: 7 },
    { name: "Tromelin Island", code: "+262", length: 9 },
    { name: "Tunisia", code: "+216", length: 8 },
    { name: "Turkey", code: "+90", length: 10 },
    { name: "Turkmenistan", code: "+993", length: 8 },
    { name: "Turks and Caicos Islands", code: "+1-649", length: 7 },
    { name: "Tuvalu", code: "+688", length: 5 },
    { name: "Uganda, Republic of", code: "+256", length: 9 },
    { name: "Ukraine", code: "+380", length: 9 },
    { name: "United Arab Emirates", code: "+971", length: 9 },
    { name: "United Kingdom (Great Britain / UK)", code: "+44", length: 10 },
    { name: "United States", code: "+1", length: 10 },
    { name: "United States Minor Outlying Islands", code: "+1", length: 10 },
    { name: "Uruguay", code: "+598", length: 8 },
    { name: "Uzbekistan", code: "+998", length: 9 },
    { name: "Vanuatu (Former New Hebrides)", code: "+678", length: 7 },
    { name: "Vatican City State (Holy See)", code: "+39-06-698", length: 11 },
    { name: "Venezuela", code: "+58", length: 10 },
    { name: "Vietnam", code: "+84", length: 9 },
    { name: "Virgin Islands, British", code: "+1-284", length: 7 },
    { name: "Virgin Islands, United States ", code: "+1-340", length: 7 },
    { name: "Wallis and Futuna Islands", code: "+681", length: 6 },
    { name: "Western Sahara", code: "+212", length: 9 },
    { name: "Yemen", code: "+967", length: 9 },
    { name: "Yugoslavia", code: "+381", length: 9 },
    { name: "Zaire", code: "+243", length: 9 },
    { name: "Zambia", code: "+260", length: 9 },
    { name: "Zimbabwe", code: "+263", length: 9 }
];

function createCountryCodeSelect() {
    const countryCodeSelect = document.createElement("select");
    countryCodeSelect.id = "countryCodeSelect";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select your country code";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    countryCodeSelect.appendChild(placeholderOption);

    // Add country code options
    countryCodes.forEach(country => {
        const option = document.createElement("option");
        option.value = country.code;
        option.text = `${country.name} (${country.code})`;
        option.dataset.length = country.length;
        countryCodeSelect.appendChild(option);
    });

    return countryCodeSelect;
}

function askPhone() {
    document.getElementById("dobInput").placeholder = "Enter your phone number";
    createMessageBox("Great! Let's start with your phone number. Please select your country code and enter your phone number:");

    const dobInput = document.getElementById("dobInput");
    const countryCodeSelect = createCountryCodeSelect();

    // Insert the country code select before the dobInput
    dobInput.parentNode.insertBefore(countryCodeSelect, dobInput);

    document.querySelector(".astro-button-container").style.display = "none";
    currentStep = 3; // Set the step to 3 for phone input
}
function askadhar() {
    document.getElementById("dobInput").placeholder = "Enter your Adhar number";
    createMessageBox("Great! Let's start with your Adhar number. Please enter your Adhar number:");



    document.querySelector(".astro-button-container").style.display = "none";
    currentStep = 4; // Set the step to 4 for Adhar input
}







function handleMultipleSubmit() {
    const input = document.getElementById("dobInput");
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
    if (isAskTestCodeCalled) {
        submitTestCode();

    }


    // Check for duplicates before proceeding
    if (isValidInput) {
        checkForDuplicatesBeforeSubmit();

        // Display submitted input in a message box

    }
    if (specialization && !Indusry) {
        askInterest();
    }
    if (Indusry && !onNext && !testInProgress) {
        askDobAfterGender();
    }
    if (onNext && testInProgress) {
        onNextQuestion();
    }


    // Call handleRashiSubmit if isDobSubmit is false
    if (!isDobSubmit) {
        handleRashiSubmit();
    }


    // Call handleDateOfBirthSubmit if isDobSubmit is true
    if (isDobSubmit) {
        handleDateOfBirthSubmit();
    }
}


function checkForDuplicatesBeforeSubmit() {
    const input = document.getElementById("dobInput");
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
        success: async function (response) {
            console.log(response);

            if (response.exists) {
                // Extract testcode from the URL
                const urlParams = new URLSearchParams(window.location.search);
                const testCode = urlParams.get('testcode');

                if (!testCode) {
                    alert('Test code is missing from the URL. Please refresh the page.');
                    return;
                }

                try {
                    const candidateId = FetchCandidateId(userData.Email_Address, userData.Adhar_No, userData.Mobile_No);
                    // Fetch screen data
                    const screenResponse = await fetch(`/api/ScreenInfo/get?testcode=${encodeURIComponent(testCode)}`);
                    if (!screenResponse.ok) {
                        throw new Error("Failed to fetch screen data");
                    }
                    const screenData = await screenResponse.json();

                    // Fetch validation status for the candidate
                    const validationResponse = await fetch(`/api/Validation/getValidationStatus?candidateId=${candidateId}`);
                    if (!validationResponse.ok) {
                        throw new Error("Failed to fetch validation status");
                    }
                    const validationData = await validationResponse.json();

                    if (screenData.screen2 === "1") {
                        // If screen2 is "1", check if info_page is submitted
                        if (validationData.info_page) {
                            // If info_page is submitted, check candidateinfo_page
                            if (!validationData.candidateinfo_page) {
                                askQualification(); // Ask for qualification if candidateinfo_page is not submitted
                            } else {
                                asktesttt();
                            }
                        } else {
                            askPassword(response.password); // Ask for password if info_page is not submitted
                        }
                    } else {
                        // If screen2 is not "1", check info_page
                        if (!validationData.info_page) {
                            askPassword(response.password); // Ask for password if info_page is not submitted
                        } else {
                            asktesttt(); // Prompt to create password if no conditions match
                        }
                    }
                } catch (error) {
                    console.error("Error handling screen data or validation:", error);
                    alert("An error occurred while processing your request. Please try again.");
                }
            } else {
                // No duplicate found, proceed with creating password
                document.getElementById("dobInput").value = "";
                createPassword();
            }
        },
        error: function (error) {
            console.error('Error checking duplicate:', error.responseJSON);
        }
    });
}


function createPassword() {
    const input = document.getElementById("dobInput");
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
    const passwordInput = document.getElementById("dobInput");
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
async function updateLoginStatus(candidateId) {
   
    try {
       

        // Define the API endpoint and the payload
        const apiEndpoint = '/api/Validation/updateLoginStatus';
        const payload = {
            CandidateId: candidateId,
      
        };

        // Make the POST request
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to update login status: ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();
        console.log('Response from API:', data);

        // Handle the response
        if (data.Action === "askTestCode") {
            console.log("Calling askTestCode...");
            askTestCode(); // Call the askTestCode function
        }
    } catch (error) {
        console.error('Error updating login status:', error);
        alert('An error occurred while updating the login status. Please try again.');
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
    const input = document.getElementById("dobInput");
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
    const passwordInput = document.getElementById("dobInput");
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

let rashiData = {
    "Mesha": {
        "AreaOfStudy": ["Engineering", "Medicine", "Sports", "Leadership", "Entrepreneurship"],
        "Jobs": ["Police Officer", "Entrepreneur", "Sales", "Military", "Construction"],
        "Industries": ["Information Technology", "Real Estate", "Aerospace", "Manufacturing", "Automotive"]
    },
    "Vrishabha": {
        "AreaOfStudy": ["Finance", "Agriculture", "Food Technology", "Environmental Science", "Music"],
        "Jobs": ["Banking", "Chef", "Farming", "Environmentalist", "Marketing"],
        "Industries": ["Banking", "Agriculture", "Food Processing", "Art & Culture", "Music Industry"]
    },
    "Mithuna": {
        "AreaOfStudy": ["Communication", "Journalism", "Public Relations", "Language Studies", "Travel and Tourism"],
        "Jobs": ["Writer", "Public Relations", "Sales", "Marketing", "Tour Guide"],
        "Industries": ["Media", "Publishing", "Advertising", "Aviation", "Information Technology"]
    },
    "Karka": {
        "AreaOfStudy": ["Psychology", "Nursing", "History", "Education", "Childcare"],
        "Jobs": ["Psychologist", "Nurse", "Teaching", "Social Work", "Pediatrician"],
        "Industries": ["Education", "Healthcare", "Archaeology", "Real Estate", "Tourism"]
    },
    "Simha": {
        "AreaOfStudy": ["Performing Arts", "Acting", "Management", "Leadership", "Public Speaking"],
        "Jobs": ["Actor", "Manager", "Entrepreneur", "Politician", "Public Relations"],
        "Industries": ["Entertainment", "Fashion", "Government", "Media", "Public Speaking"]
    },
    "Kanya": {
        "AreaOfStudy": ["Medicine", "Nutrition", "Research", "Accounting", "Quality Control"],
        "Jobs": ["Doctor", "Dietitian", "Scientist", "Accountant", "Quality Analyst"],
        "Industries": ["Healthcare", "Food Industry", "Research & Development", "Banking", "Pharmaceutical"]
    },
    "Tula": {
        "AreaOfStudy": ["Law", "Fashion Design", "Interior Design", "Event Management", "Diplomacy"],
        "Jobs": ["Lawyer", "Fashion Designer", "Interior Designer", "Event Planner", "Diplomat"],
        "Industries": ["Legal Services", "Fashion", "Real Estate", "Hospitality", "International Relations"]
    },
    "Vrischika": {
        "AreaOfStudy": ["Occult Sciences", "Detective Work", "Psychology", "Surgery", "Research"],
        "Jobs": ["Astrologer", "Detective", "Psychologist", "Surgeon", "Scientist"],
        "Industries": ["Occult Sciences", "Detective Agencies", "Research Institutes", "Pharmaceuticals", "Mining"]
    },
    "Dhanu": {
        "AreaOfStudy": ["Philosophy", "Spirituality", "Teaching", "Publishing", "Adventure"],
        "Jobs": ["Philosopher", "Spiritual Leader", "Teacher", "Publisher", "Travel Agent"],
        "Industries": ["Education", "Spirituality", "Tourism", "Journalism", "Adventure Tourism"]
    },
    "Makara": {
        "AreaOfStudy": ["Engineering", "Finance", "Administration", "Architecture", "Politics"],
        "Jobs": ["Engineer", "Financial Advisor", "Administrator", "Architect", "Politician"],
        "Industries": ["Construction", "Finance", "Government", "Real Estate", "Politics"]
    },
    "Kumbha": {
        "AreaOfStudy": ["Science", "Technology", "Invention", "Social Work", "Humanitarianism"],
        "Jobs": ["Scientist", "Technologist", "Inventor", "Social Worker", "Activist"],
        "Industries": ["Research", "Technology", "Invention", "NGOs", "Environmental Services"]
    },
    "Meena": {
        "AreaOfStudy": ["Creative Arts", "Oceanography", "Music", "Poetry", "Film Production"],
        "Jobs": ["Artist", "Oceanographer", "Musician", "Poet", "Filmmaker"],
        "Industries": ["Art & Culture", "Research", "Entertainment", "Tourism", "Film Industry"]
    }
};
const nakshatraData = {
    "Anuradha": {
        "AreaOfStudy": ["Psychology", "Law", "Political Science", "Social Work", "Counseling"],
        "Jobs": ["Detective", "Politician", "Psychologist", "Social Worker", "Diplomat"],
        "Industries": ["Research", "Legal", "Politics", "Social Services", "Diplomacy"]
    },
    "Ardra": {
        "AreaOfStudy": ["Meteorology", "Writing", "Environmental Science", "Journalism", "Research"],
        "Jobs": ["Meteorologist", "Writer", "Environmentalist", "Journalist", "Researcher"],
        "Industries": ["Weather Forecasting", "Media", "Environmental", "Journalism", "Research Institutions"]
    },
    "Ashlesha": {
        "AreaOfStudy": ["Ayurveda", "Psychology", "Occult Sciences", "Counseling", "Spirituality"],
        "Jobs": ["Ayurvedic Doctor", "Psychologist", "Astrologer", "Counselor", "Spiritual Leader"],
        "Industries": ["Health and Wellness", "Psychology", "Astrology", "Wellness Centers", "Spiritual Organizations"]
    },
    "Ashwini": {
        "AreaOfStudy": ["Medicine", "Engineering", "Entrepreneurship", "Leadership", "Sports"],
        "Jobs": ["Surgeon", "Engineer", "Entrepreneur", "CEO", "Athlete"],
        "Industries": ["Healthcare", "Technology", "Startups", "Sports Management", "Athletics"]
    },
    "Bharani": {
        "AreaOfStudy": ["Music", "Acting", "Agriculture", "Archaeology", "Real Estate"],
        "Jobs": ["Musician", "Actor", "Farmer", "Archaeologist", "Real Estate Agent"],
        "Industries": ["Entertainment", "Agriculture", "Archaeology", "Real Estate", "Construction"]
    },
    "Chitra": {
        "AreaOfStudy": ["Fine Arts", "Fashion Design", "Architecture", "Interior Design", "Photography"],
        "Jobs": ["Artist", "Fashion Designer", "Architect", "Interior Designer", "Photographer"],
        "Industries": ["Art", "Fashion", "Architecture", "Interior Design", "Photography"]
    },
    "Dhanishta": {
        "AreaOfStudy": ["Astrology", "Music", "Technology", "Astronomy", "Event Management"],
        "Jobs": ["Astrologer", "Musician", "IT Professional", "Astronomer", "Event Planner"],
        "Industries": ["Astrology", "Music", "Technology", "Astronomy", "Event Management"]
    },
    "Hasta": {
        "AreaOfStudy": ["Astrology", "Healing Arts", "Research", "Writing", "Data Analysis"],
        "Jobs": ["Astrologer", "Healer", "Researcher", "Writer", "Data Analyst"],
        "Industries": ["Astrology", "Alternative Medicine", "Research Institutions", "Media", "Data Analysis"]
    },
    "Jyeshtha": {
        "AreaOfStudy": ["Occult Sciences", "Psychology", "Law", "Criminal Justice", "Tantra"],
        "Jobs": ["Astrologer", "Psychologist", "Lawyer", "Detective", "Spiritual Teacher"],
        "Industries": ["Astrology", "Psychology", "Legal", "Law Enforcement", "Spiritual Organizations"]
    },
    "Krittika": {
        "AreaOfStudy": ["Engineering", "Cooking", "Entrepreneurship", "Agriculture", "Leadership"],
        "Jobs": ["Engineer", "Chef", "Entrepreneur", "Farmer", "CEO"],
        "Industries": ["Technology", "Culinary", "Startups", "Agriculture", "Leadership"]
    },
    "Magha": {
        "AreaOfStudy": ["History", "Government", "Leadership", "Public Relations", "Performing Arts"],
        "Jobs": ["Historian", "Politician", "CEO", "PR Specialist", "Actor"],
        "Industries": ["Education", "Government", "Leadership", "Entertainment", "Arts"]
    },
    "Mrigashira": {
        "AreaOfStudy": ["Botany", "Photography", "Writing", "Fashion Design", "Interior Design"],
        "Jobs": ["Botanist", "Photographer", "Writer", "Fashion Designer", "Interior Designer"],
        "Industries": ["Environmental", "Media", "Writing", "Fashion", "Interior Design"]
    },
    "Mula": {
        "AreaOfStudy": ["Occult Sciences", "Psychology", "Research", "Law", "Counseling"],
        "Jobs": ["Astrologer", "Psychologist", "Researcher", "Lawyer", "Counselor"],
        "Industries": ["Occult Sciences", "Psychology", "Research Institutions", "Legal", "Social Services"]
    },
    "Punarvasu": {
        "AreaOfStudy": ["Education", "Writing", "Communication", "Public Relations", "Event Management"],
        "Jobs": ["Teacher", "Writer", "Communication", "PR Specialist", "Event Planner"],
        "Industries": ["Education", "Media", "Public Relations", "Event Management", "Education"]
    },
    "Purva Ashadha": {
        "AreaOfStudy": ["Philosophy", "Law", "Politics", "Social Work", "Religious Studies"],
        "Jobs": ["Philosopher", "Lawyer", "Politician", "Social Worker", "Religious Leader"],
        "Industries": ["Education", "Legal", "Politics", "Social Services", "Religious Organizations"]
    },
    "Purva Bhadrapada": {
        "AreaOfStudy": ["Healing Arts", "Psychology", "Research", "Environmental Science", "Yoga"],
        "Jobs": ["Healer", "Psychologist", "Researcher", "Environmentalist", "Yoga Instructor"],
        "Industries": ["Wellness Centers", "Psychology", "Research Institutions", "Environmental", "Yoga"]
    },
    "Purva Phalguni": {
        "AreaOfStudy": ["Arts", "Acting", "Entertainment", "Event Management", "Hospitality"],
        "Jobs": ["Artist", "Actor", "Entertainer", "Event Planner", "Hotel Management"],
        "Industries": ["Arts", "Entertainment", "Event Management", "Hospitality", "Tourism"]
    },
    "Pushya": {
        "AreaOfStudy": ["Counseling", "Education", "Social Work", "Psychology", "Healthcare"],
        "Jobs": ["Counselor", "Teacher", "Social Worker", "Psychologist", "Doctor"],
        "Industries": ["Social Services", "Education", "Healthcare", "Psychology", "Medical"]
    },
    "Revati": {
        "AreaOfStudy": ["Music", "Writing", "Spirituality", "Healing Arts", "Astronomy"],
        "Jobs": ["Musician", "Writer", "Spiritual Leader", "Healer", "Astronomer"],
        "Industries": ["Entertainment", "Media", "Spiritual Organizations", "Alternative Medicine", "Astronomy"]
    },
    "Rohini": {
        "AreaOfStudy": ["Agriculture", "Cooking", "Fashion Design", "Music", "Real Estate"],
        "Jobs": ["Farmer", "Chef", "Fashion Designer", "Musician", "Real Estate Agent"],
        "Industries": ["Agriculture", "Culinary", "Fashion", "Music", "Real Estate"]
    },
    "Shatabhisha": {
        "AreaOfStudy": ["Technology", "Engineering", "Research", "Astrology", "Environmental Science"],
        "Jobs": ["IT Professional", "Engineer", "Researcher", "Astrologer", "Environmentalist"],
        "Industries": ["Technology", "Technology", "Research Institutions", "Astrology", "Environmental"]
    },
    "Shravana": {
        "AreaOfStudy": ["Education", "Government", "Music", "Communication", "Counseling"],
        "Jobs": ["Teacher", "Politician", "Musician", "PR Specialist", "Counselor"],
        "Industries": ["Education", "Government", "Music", "Media", "Social Services"]
    },
    "Swati": {
        "AreaOfStudy": ["Law", "Writing", "Communication", "Politics", "Event Management"],
        "Jobs": ["Lawyer", "Writer", "Communication", "Politician", "Event Planner"],
        "Industries": ["Legal", "Media", "Public Relations", "Politics", "Event Management"]
    },
    "Uttara Ashadha": {
        "AreaOfStudy": ["Leadership", "Management", "Entrepreneurship", "Politics", "Social Work"],
        "Jobs": ["CEO", "Manager", "Entrepreneur", "Politician", "Social Worker"],
        "Industries": ["Startups", "Management", "Politics", "Social Services", "Leadership"]
    },
    "Uttara Bhadrapada": {
        "AreaOfStudy": ["Healing Arts", "Psychology", "Law", "Social Work", "Religious Studies"],
        "Jobs": ["Healer", "Psychologist", "Lawyer", "Social Worker", "Religious Leader"],
        "Industries": ["Wellness Centers", "Psychology", "Legal", "Social Services", "Religious Organizations"]
    },
    "Uttara Phalguni": {
        "AreaOfStudy": ["Education", "Arts", "Government", "Entertainment", "Hospitality"],
        "Jobs": ["Teacher", "Artist", "Politician", "Entertainer", "Hotel Management"],
        "Industries": ["Education", "Arts", "Government", "Tourism", "Hospitality"]
    },
    "Vishakha": {
        "AreaOfStudy": ["Law", "Management", "Politics", "Finance", "Entrepreneurship"],
        "Jobs": ["Lawyer", "Manager", "Politician", "Financial Analyst", "Entrepreneur"],
        "Industries": ["Legal", "Management", "Politics", "Finance", "Startups"]
    },
};


let ascendantData = {
    "Aries": {
        "Jobs": ["Entrepreneur", "Military", "Athlete", "Surgeon", "Pilot"],
        "Industries": ["Business", "Defense", "Sports", "Healthcare", "Aviation"],
        "AreasOfStudy": ["Business Administration", "Military Science", "Sports Medicine", "Surgery", "Aeronautics"]
    },
    "Taurus": {
        "Jobs": ["Chef", "Banker", "Real Estate", "Interior Designer", "Landscaper"],
        "Industries": ["Culinary", "Finance", "Real Estate", "Interior Design", "Landscaping"],
        "AreasOfStudy": ["Culinary Arts", "Finance", "Real Estate Management", "Interior Design", "Horticulture"]
    },
    "Gemini": {
        "Jobs": ["Writer", "Journalist", "IT Consultant", "Public Relations", "Sales"],
        "Industries": ["Media", "Technology", "Communications", "Public Relations", "Sales"],
        "AreasOfStudy": ["Communication", "Journalism", "Information Technology", "Public Relations", "Marketing"]
    },
    "Cancer": {
        "Jobs": ["Nurse", "Teacher", "Social Worker", "Chef", "Historian"],
        "Industries": ["Healthcare", "Education", "Social Services", "Culinary", "History"],
        "AreasOfStudy": ["Nursing", "Education", "Social Work", "Culinary Arts", "History"]
    },
    "Leo": {
        "Jobs": ["Actor", "CEO", "Event Planner", "Marketing Director", "Fashion Designer"],
        "Industries": ["Entertainment", "Business", "Event Planning", "Marketing", "Fashion"],
        "AreasOfStudy": ["Performing Arts", "Business Administration", "Event Management", "Marketing", "Fashion Design"]
    },
    "Virgo": {
        "Jobs": ["Doctor", "Research Scientist", "Accountant", "Editor", "Quality Analyst"],
        "Industries": ["Healthcare", "Science", "Finance", "Publishing", "Quality Assurance"],
        "AreasOfStudy": ["Medicine", "Biomedical Science", "Accounting", "Editing", "Quality Management"]
    },
    "Libra": {
        "Jobs": ["Lawyer", "Mediator", "Counselor", "Fashion Stylist", "Event Coordinator"],
        "Industries": ["Legal", "Mediation", "Social Services", "Fashion", "Event Planning"],
        "AreasOfStudy": ["Law", "Mediation", "Psychology", "Fashion Design", "Event Management"]
    },
    "Scorpio": {
        "Jobs": ["Detective", "Psychologist", "Researcher", "Surgeon", "IT Security Analyst"],
        "Industries": ["Law Enforcement", "Psychology", "Research", "Healthcare", "Cybersecurity"],
        "AreasOfStudy": ["Criminology", "Psychology", "Research", "Surgery", "Cybersecurity"]
    },
    "Sagittarius": {
        "Jobs": ["Philosopher", "Travel Writer", "Teacher", "Outdoor Guide", "Entrepreneur"],
        "Industries": ["Philosophy", "Travel", "Education", "Outdoor Adventure", "Business"],
        "AreasOfStudy": ["Philosophy", "Travel Writing", "Education", "Outdoor Adventure", "Business Administration"]
    },
    "Capricorn": {
        "Jobs": ["CEO", "Economist", "Engineer", "Manager", "Investment Banker"],
        "Industries": ["Business", "Finance", "Engineering", "Management", "Investment Banking"],
        "AreasOfStudy": ["Business Administration", "Economics", "Engineering", "Management", "Finance"]
    },
    "Aquarius": {
        "Jobs": ["Scientist", "Technologist", "Humanitarian", "Activist", "Innovation Consultant"],
        "Industries": ["Science", "Technology", "Nonprofit", "Activism", "Consulting"],
        "AreasOfStudy": ["Science", "Technology", "Humanitarian Studies", "Activism", "Innovation Management"]
    },
    "Pisces": {
        "Jobs": ["Artist", "Psychologist", "Musician", "Healer", "Marine Biologist"],
        "Industries": ["Arts", "Psychology", "Music", "Holistic Healing", "Marine Biology"],
        "AreasOfStudy": ["Fine Arts", "Psychology", "Music", "Holistic Health", "Marine Biology"]
    },
};
let lagnaData = {
    "Mesha": {
        "AreaOfStudy": ["Engineering", "Medicine", "Military", "Sports", "Entrepreneurship"],
        "Jobs": ["Leadership", "Surgeon", "Athlete", "Entrepreneur", "Police Officer"],
        "Industries": ["Engineering", "Healthcare", "Defense", "Sports", "Business"]
    },
    "Vrishabha": {
        "AreaOfStudy": ["Finance", "Agriculture", "Music", "Art & Design", "Food Industry"],
        "Jobs": ["Banking", "Farmer", "Musician", "Artist", "Chef"],
        "Industries": ["Finance", "Agriculture", "Entertainment", "Food Production", "Hospitality"]
    },
    "Mithuna": {
        "AreaOfStudy": ["Communication", "Journalism", "Writing", "Public Relations", "Teaching"],
        "Jobs": ["Journalist", "Writer", "Public Relations", "Teacher", "Salesperson"],
        "Industries": ["Media", "Education", "Advertising", "Publishing", "Retail"]
    },
    "Karka": {
        "AreaOfStudy": ["Psychology", "Real Estate", "Nursing", "Social Work", "Hospitality"],
        "Jobs": ["Psychologist", "Real Estate Agent", "Nurse", "Social Worker", "Chef"],
        "Industries": ["Psychology", "Real Estate", "Healthcare", "Social Services", "Hospitality"]
    },
    "Simha": {
        "AreaOfStudy": ["Performing Arts", "Politics", "Management", "Entertainment", "Fashion"],
        "Jobs": ["Actor", "Politician", "Manager", "Entertainer", "Fashion Designer"],
        "Industries": ["Entertainment", "Politics", "Business", "Fashion", "Arts & Entertainment"]
    },
    "Kanya": {
        "AreaOfStudy": ["Medicine", "Nutrition", "Research", "Data Analysis", "Quality Control"],
        "Jobs": ["Doctor", "Nutritionist", "Researcher", "Data Analyst", "Quality Controller"],
        "Industries": ["Healthcare", "Nutrition", "Science", "Technology", "Quality Assurance"]
    },
    "Tula": {
        "AreaOfStudy": ["Law", "Fashion Design", "Diplomacy", "Interior Design", "Aesthetics"],
        "Jobs": ["Lawyer", "Fashion Designer", "Diplomat", "Interior Designer", "Aesthetician"],
        "Industries": ["Legal", "Fashion", "Diplomacy", "Interior Design", "Beauty"]
    },
    "Vrishchika": {
        "AreaOfStudy": ["Occult Sciences", "Detective Work", "Psychology", "Surgery", "Research"],
        "Jobs": ["Astrologer", "Detective", "Psychologist", "Surgeon", "Researcher"],
        "Industries": ["Occult Sciences", "Law Enforcement", "Psychology", "Healthcare", "Research"]
    },
    "Dhanu": {
        "AreaOfStudy": ["Philosophy", "Travel", "Teaching", "Philosophy", "Writing"],
        "Jobs": ["Philosopher", "Travel Agent", "Teacher", "Philosopher", "Writer"],
        "Industries": ["Education", "Travel", "Education", "Writing", "Tourism"]
    },
    "Makara": {
        "AreaOfStudy": ["Engineering", "Government", "Business", "Finance", "Administration"],
        "Jobs": ["Engineer", "Government Worker", "Businessperson", "Financial Analyst", "Administrator"],
        "Industries": ["Engineering", "Government", "Business", "Finance", "Administration"]
    },
    "Kumbha": {
        "AreaOfStudy": ["Science", "Technology", "Social Work", "Humanitarian", "Invention"],
        "Jobs": ["Scientist", "Technologist", "Social Worker", "Humanitarian Worker", "Inventor"],
        "Industries": ["Science", "Technology", "Social Services", "Nonprofit", "Invention"]
    },
    "Meena": {
        "AreaOfStudy": ["Art", "Healing", "Spiritualism", "Music", "Charity"],
        "Jobs": ["Artist", "Healer", "Spiritual Leader", "Musician", "Philanthropist"],
        "Industries": ["Arts", "Healthcare", "Religion", "Music", "Nonprofit"]
    },
    // ... (repeat for other Lagnas)
};
function startVedicProcess() {

    // Reset the submission flags
    isRashiSubmit = false;
    isNakshatraSubmit = false;
    isLagnaSubmit = false;

    // Display the initial question
    askQuestion("What is your rashi?", "Enter your Rashi");
}

function askQuestion(question, placeholder) {
    document.querySelector(".my-message").innerHTML = `
     
    `;

    document.querySelector(".chat-container").innerHTML += `
        <div class="message-box my-message">
            <p>${question}</p>
        </div>
    `;
    document.getElementById("dobInput").setAttribute("placeholder", placeholder);
    document.querySelector(".astro-button-container").style.display = "none";
}





function handleYouTubeChatClick() {
    // Update the right container with the astrology question
    document.querySelector(".right-container .chat-container").innerHTML = `
        <div class="message-box my-message">
            <p>Check out the YouTube videos:</p>
            <p><a href="https://youtube.com/playlist?list=PLFhNcXkdLYt-fFQYRTbIKYD77WabWVnSP&si=j6Y20kYy6h7qsWzx" target="_blank">Career Playlist</a></p>
            <span>08:00</span>
        </div>
        <div class="message-box my-message">
            <p>Feel free to explore the playlist and let me know if you have any questions!</p>
            <span>08:01</span>
        </div>
    `;
}


function googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: '', layout: google.translate.TranslateElement.InlineLayout.SIMPLE }, 'google_translate_element');
}

// Make sure to include the correct source URL for the Google Translate script

function toggleLeftContainer() {
    var leftContainer = document.querySelector('.left-container');
    var slideButton = document.querySelector('.slide-button');

    leftContainer.classList.toggle('left-container-closed');
    leftContainer.classList.toggle('left-container-opened'); // Add this line
    slideButton.classList.toggle('slide-button-closed');
    slideButton.classList.toggle('slide-button-opened'); // Add this line
}



const input = document.getElementById('dobInput');
input.addEventListener('keypress', function (event) {
    if (event.keyCode === 13 || event.which === 13) {
        document.getElementById('dobSubmitButton').click();
    }
});
function generatePDF() {
    // Get the HTML content of the message box
    let messageBoxContent = document.querySelector(".my-message").innerHTML;

    // Create an HTML element to hold the content
    let pdfContent = document.createElement("div");
    pdfContent.innerHTML = messageBoxContent;

    // Use html2pdf to generate the PDF
    html2pdf(pdfContent, {
        margin: 10,
        filename: 'career_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    });
}