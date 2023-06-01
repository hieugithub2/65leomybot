import bot from './assets/robot.png'
import user from './assets/user.png'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

function buttonStripe(buttonLabels) {
    return (
        `
        <div class="button-container">
            ${buttonLabels.map(label => `<button class="button-question">${label}</button>`).join('')}
        </div>
        `
    )
}

chatContainer.innerHTML += chatStripe(true, "Hello I am a chat bot created by Leo. You can ask me anything about us!")
chatContainer.innerHTML += chatStripe(true, "It takes me about 30 seconds to have the first answer because Leo is using a free version of hosting service. On behalf of Leo, I sincerely apologize you.")

const buttonLabels = ['Who are you?', 'Who is Leo?', 'Is Leo a bad guy?'];
chatContainer.innerHTML += buttonStripe(buttonLabels);

const buttonContainers = document.querySelectorAll('.button-question');

const handleSubmit = async (e, prompt) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    if (! prompt) {
        chatContainer.innerHTML += chatStripe(false, data.get('prompt'))
    } else {
        chatContainer.innerHTML += chatStripe(false, prompt)
    }
    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('https://leobot-aw26.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: prompt || data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Continue after one minute. I'm taking a break!"
    }
}

buttonContainers.forEach((button) => {
    button.addEventListener('click', (e) => {
        const prompt = e.target.textContent;
        handleSubmit(e, prompt);
    });
}); 

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})