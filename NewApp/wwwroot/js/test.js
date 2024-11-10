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


const testcode = localStorage.getItem('testcode'); // Retrieve test code from localStorage
console.log('testcode', testcode);
function asktesttt() {
    // Make an AJAX request to get the reportId based on the test code
    $.ajax({
        type: 'POST',
        url: '/api/TestCode/CheckTestCodeValidity',
        contentType: 'application/json',
        data: JSON.stringify({ Code: testcode }),
        success: function (response) {
            if (response.isValid) {

                const reportId = response.reportId;
                callApiToStartTest(reportId);// Assuming the response contains the ReportId
                console.log(`Test code  is valid. Corresponding Report ID is: ${reportId}`);


                // Log the entire response for further inspection
                console.log('Server Response:', response);

                // Test code is valid, proceed with further actions
              


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
function submitDobAfterGender() {
    highlightBasicInfoChatBox();

    const dobInput = document.getElementById("dobInput");
    const dob = dobInput.value;

    if (dob) {
        // Format the submitted date of birth to match the expected format ("YYYY-MM-DD")
        const formattedDob = formatDobForServer(dob);

        // Calculate age
        const age = calculateAge(formattedDob);

        // Check for age limits
        if (age < 10) {
            // Display alert and prevent further processing if age is less than 10
            alert('Sorry, you must be at least 10 years old to proceed.');
            return;
        } else if (age > 80) {
            // Display alert and prevent further processing if age is more than 80
            alert('Sorry, the age limit is 80 years.');
            return;
        }

        // Process the formatted date of birth and proceed to the next step
        userData.Dob = formattedDob;
        displaySubmittedInput("Date of Birth", dob, true);

        console.log(userData);

        dobInput.value = "";
        flatpickr("#dobInput").destroy();

        submitUserDataToDatabase(userData);

        if (storedTestCode === "PEXCGRD2312O1009" || storedTestCode === "PEXCGJD2312O1011" || storedTestCode === "PEXCGSD2312O1013") {
            // If test code matches, call askTransactionId()
            askTransactionId();
            console.log(userData);
        } else {
            // If test code doesn't match, call askCoreStream()
            asktesttt();
            console.log(userData);
        }

        dobInput.removeEventListener("change", askDobAfterGender);
        dobInput.removeEventListener("change", submitDobAfterGender);

        // Continue with further processing or form completion
    } else {
        // Handle the case where the date of birth is not selected
        alert('Please select your date of birth.');
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




let translatedQuestionText = '';

function createMessageBoxq(question, currentQuestionIndex, totalQuestions) {
    // Original message box with the question
    let newMessageBox = document.createElement("div");
    newMessageBox.className = "message-box my-messagee";

    // Add the title with question number and total questions
    newMessageBox.innerHTML += `<p>Q ${currentQuestionIndex + 1}:</p>`;
    newMessageBox.innerHTML += `<p>${question}</p>`;

    // Append the original message box to the body
    document.querySelector(".chat-container").appendChild(newMessageBox);

    // Translated message box with the translated question
    let translatedMessageBox = document.createElement("div");
    translatedMessageBox.className = "message-box my-messagee";

    // Add translated question (this is the same as the original question initially)
    translatedMessageBox.innerHTML += `<p>F ${currentQuestionIndex + 1}:</p>`;
    translatedMessageBox.innerHTML += `<p>${translatedQuestionText || 'Waiting for translation...'}</p>`;

    // Append the translated message box to the body
    document.querySelector(".chat-container").appendChild(translatedMessageBox);
}
function handleTranslate() {
    const languageSelected = document.querySelector('.goog-te-combo').value;  // Get selected language from Google Translate dropdown

    // Use Google Translate's functionality to translate the entire page and get the translated text
    const textToTranslate = document.querySelector('.message-box p').innerText; // The question text to translate

    // Create a temporary div to grab the translated text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = textToTranslate;
    document.body.appendChild(tempDiv);

    // Set the translated text as the translatedQuestionText variable
    translatedQuestionText = tempDiv.innerText;

    // Call to create message boxes with both original and translated text
    createMessageBoxq(textToTranslate, currentQuestionIndex, totalQuestions);

    // Remove the temporary div after use
    tempDiv.remove();
}
let sectionSelectedOptionsArray = [];
let selectedOptionsLength = 0;



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
    createMessageBoxq(question, currentQuestionIndex, totalQuestions, "default"); // "default" for the original question

    // Call the function to get the translated question based on the selected language
    const selectedLanguage = getSelectedLanguage(); // Get the selected language (you can use Google Translate API here)
    getTranslatedText(question, selectedLanguage, function (translatedText) {
        // Display the translated question
        createMessageBoxq(translatedText, currentQuestionIndex, totalQuestions, "translated"); // "translated" for the translated question
    });


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

                console.log(`Current Section Index: ${currentSectionIndex}, Total Sections: ${filteredSections.length}`);

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

            // Call the callback function to continue execution
            callback();
        },
        error: function (xhr, status, error) {
            console.error('Error fetching assessment subattributes:', error);
            // Handle error if needed
        }
    });
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




function handleMultipleSubmit() {
    const input = document.getElementById("dobInput");
    const placeholder = input.placeholder.toLowerCase();

    // Validate and set userData based on placeholder
  
 
   
 

    // Check for duplicates before proceeding
 

  
    if (onNext && testInProgress) {
        onNextQuestion();
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



document.addEventListener('DOMContentLoaded', function () {
    onLanguageChange();  // Initialize language change listener
    displayQuestion(currentQuestionIndex, 'en');  // Initially display question in default language (English)
});
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
document.addEventListener('DOMContentLoaded', function () {
    const translateDropdown = document.querySelector('.goog-te-combo');
    translateDropdown.addEventListener('change', handleTranslate); // Add an event listener for language change
});