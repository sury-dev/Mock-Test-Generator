const apiKey = 'FURA6jYBI37dIbTf8ERCoISZ66gQYQtl';
const externalUserId = 'User1';
const queryUpdate = "/n Segregate the following data to include particular topics in each UNIT/n Format of output should be - \"UNIT1*<topic1>*<topic2>*<topic3>^UNIT2*<topic1>*<topic2>*<topic3>\"";
const queryUpdate2 = "Create 10 MCQ Questions /n Format of output should be -<Question1>*<option1>*<option2>*<option3>*<option4>*<correct answer>#<Question2>*<option1>*<option2>*<option3>*<option4>*<correct answer>";
// Function to create a chat session
async function createChatSession() {
    try {
        const response = await axios.post(
            'https://api.on-demand.io/chat/v1/sessions',
            {
                pluginIds: [],
                externalUserId: externalUserId
            },
            {
                headers: {
                    apikey: apiKey
                }
            }
        );
        return response.data.data.id; // Extract session ID
    } catch (error) {
        console.error('Error creating chat session:', error);
        throw error;
    }
}

// Function to submit a query
async function submitQuery(sessionId, query) {
    try {
        const response = await axios.post(
            `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`,
            {
                endpointId: 'predefined-openai-gpt4o',
                query: `${query} ${queryUpdate}`,
                pluginIds: ['plugin-1712327325', 'plugin-1713962163'],
                responseMode: 'sync'
            },
            {
                headers: {
                    apikey: apiKey
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting query:', error);
        throw error;
    }
}

// Main function to execute the API calls
async function processQuery(query) {
    try {
        const sessionId = await createChatSession();
        const queryResponse = await submitQuery(sessionId, query);
        const arr1 = queryResponse.data.answer.split('^');
        const result = {};

        arr1.forEach(item => {
            const [unit, ...topics] = item.split('*');
            result[unit.replace(/([A-Z]+)(\d*)/, '$1 $2').trim()] = topics;
        });

        return result;
    } catch (error) {
        console.error('Error processing query:', error);
        return { error: 'Error processing request' };
    }
}

async function processQuery(query) {
    try {
        const sessionId = await createChatSession();
        const queryResponse = await submitQuery(sessionId, query);
        const arr1 = queryResponse.data.answer.split('^');
        const result = {};

        arr1.forEach(item => {
            const [unit, ...topics] = item.split('*');
            result[unit.replace(/([A-Z]+)(\d*)/, '$1 $2').trim()] = topics;
        });

        return result;
    } catch (error) {
        console.error('Error processing query:', error);
        return { error: 'Error processing request' };
    }
}

async function submitQuery2(sessionId, query) {
    try {
        const response = await axios.post(
            `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`,
            {
                endpointId: 'predefined-openai-gpt4o',
                query: `${query} ${queryUpdate2}`,
                pluginIds: ['plugin-1712327325', 'plugin-1713962163'],
                responseMode: 'sync'
            },
            {
                headers: {
                    apikey: apiKey
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting query:', error);
        throw error;
    }
}
async function processQuery2(query) {
    try {
        const sessionId = await createChatSession();
        const queryResponse = await submitQuery2(sessionId, query);
        return queryResponse.data.answer;
    } catch (error) {
        console.error('Error processing query:', error);
        return { error: 'Error processing request' };
    }
}
const forem = function(e){
    e.preventDefault();
}
function render2(ans) {
    // Get the resultOutput2 element
    const resultElement = document.getElementById('resultOutput2');

    // Initialize an empty string to build the form HTML
    let formHTML = '<form id="quizForm" onsubmit="forem(event)">';

    // Loop through each question in the ans object
    for (const [key, value] of Object.entries(ans)) {
        formHTML += `<fieldset class="question-box">
            <h3>${value.Question}</h3>
            <div>
                <input type="radio" name="${key}" id=${key} value="${value.option1}">
                ${value.option1}
            </div>
            <div>
                <input type="radio" name="${key}" id=${key} value="${value.option2}">
                ${value.option2}
            </div>
            <div>
                <input type="radio" name="${key}" id=${key} value="${value.option3}">
                ${value.option3}
            </div>
            <div>
                <input type="radio" name="${key}" id=${key} value="${value.option4}">
                ${value.option4}
            </div><br>
            <div class="answers">
                <b>Correct-Answer :</b>${value.correct_answer}</label>
            </div>
        </fieldset>`;
    }

    formHTML += '<button onclick="displayAnswer()">Submit</button></form>';

    // Set the inner HTML of the result element to the form HTML
    resultElement.innerHTML = formHTML;
}

displayAnswer = function(){
    const elements = document.getElementsByClassName("answers");

    // Convert HTMLCollection to array and then use forEach
    Array.from(elements).forEach((e) => {
        e.style.opacity = 1;
    })
}
const fun = async function (topic) {
    const rawData = await processQuery2(topic);
    const questions = rawData.split('#').filter(q => q.trim() !== '');

    // Initialize the result object
    const ans = {};

    // Process each question
    questions.forEach((question, index) => {
        // Split by '*' to separate question, options, and correct answer
        const parts = question.split('*');
        const questionText = parts[0].trim();
        const options = parts.slice(1, -1).map(opt => opt.trim());
        const correctAnswer = parts[parts.length - 1].trim();

        // Format the question data into the JSON structure
        ans[`Question ${index + 1}`] = {
            Question: questionText,
            option1: options[0] || '',
            option2: options[1] || '',
            option3: options[2] || '',
            option4: options[3] || '',
            correct_answer: correctAnswer
        };
    });

    // Convert the result object to a JSON string
    const jsonString = JSON.stringify(ans, null, 2);

    // Set the JSON string as the inner HTML of the result element
    // document.getElementById('resultOutput2').innerHTML = `<pre>${jsonString}</pre>`;
    render2(ans);

    console.log(jsonString);
}
// Function to render the result as an unordered list
function renderResult(result) {
    const resultContainer = document.getElementById('resultOutput');
    resultContainer.innerHTML = ''; // Clear previous content

    for (const [unit, topics] of Object.entries(result)) {
        // Create a unit section
        const unitSection = document.createElement('div');
        unitSection.className = 'unit-section';

        // Create unit heading and button
        const unitHeading = document.createElement('div');
        unitHeading.className = 'unit-heading';
        unitHeading.innerHTML = `${unit}`;

        const button = document.createElement('button'); // button to call function qfor

        // Optionally, you can set attributes or text content for the button
        button.textContent = 'Create Mock Test';
        button.addEventListener('click', function () {
            // console.log(processQuery2(topics));
            fun(topics); // Call the function qfor when the button is clicked
        });
        unitHeading.appendChild(button);

        unitSection.appendChild(unitHeading);

        // Create unordered list for topics
        const topicList = document.createElement('ul');
        topics.forEach(topic => {
            const listItem = document.createElement('li');
            listItem.textContent = topic;
            topicList.appendChild(listItem);

            const button = document.createElement('button'); // button to call function qfor

        // Optionally, you can set attributes or text content for the button
            button.textContent = 'Let\'s Learn';
            button.classList = "butted";
            button.addEventListener('click', function () {
                // console.log(processQuery2(topics));
                fun(topic); // Call the function qfor when the button is clicked
            });
            listItem.appendChild(button);

        });

        unitSection.appendChild(topicList);
        resultContainer.appendChild(unitSection);
    }
}

// Event listener for form submission
document.getElementById("queryForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const query = document.getElementById('queryInput').value;
    const resultOutput = document.getElementById('resultOutput');
    resultOutput.innerHTML = 'Processing...';

    try {
        const result = await processQuery(query);
        renderResult(result);
    } catch (error) {
        resultOutput.innerHTML = 'Error processing request';
    }
});
