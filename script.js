//IMPORTANT NOTE- USER WILL NOT GET RESPONSE FROM MindHub AI AS OF NOW BECAUSE POST METHOD IS NOT ABLE TO FIND(https://api.openai.com/v1/completions) THIS OPENAI API BECAUSE IT IS PAID NOW AND NOT FREE. SO DEVELOPER HAS TO BUY THE SUBSCRIPTION OF THIS OPENAI API TO GET THIS API IN WORKING MODE, AND FURTHERLY GET THE RESPONSE FROM MindHub AI WITH THE HELP OF THIS OPENAI API. 




const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = "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";
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>MindHub AI</h1>
                            <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalstorage();

const createElement = (html, className) => {
    //Create new div and apply chat, specified class and set html content of div.
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; //Return the created chat div.
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");

    //Define the properties and data for the API request.
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }

    //Send POST request to API, get response and set the response as paragraph element text.
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
    } catch (error) {
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

    //Remove the typing animation, append the paragraph element and save chats to local storage.
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
}

const copyResponse = (copyBtn) => {
    //Copy the text content of the response to the clipboard.
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    setTimeout(() => copyBtn.textContent = "✔️", 100);
}

const showTypingAnimation = () => {
    const html = `  <div class="chat-content">
                        <div class="chat-details">
                            <img src="assets/chatbot.jpg" alt="chatbot-img">
                            <div class="typing-animation">
                                <div class="typing-dot" style="--delay: 0.2s">&bull;</div>
                                <div class="typing-dot" style="--delay: 0.3s">&bull;</div>
                                <div class="typing-dot" style="--delay: 0.4s">&bull;</div>
                            </div>
                        </div>
                        <span onclick="copyResponse(this)" class="fa fa-copy"></span>
                    </div>`

    //Create an incoming chat div with typing animation and append it to chat container.
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); //Get chatInput value and remove extra spaces.
    if (!userText) return; //If chatInput is empty return from here.

    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="assets/user.jpg" alt="user-img">
                        <p></p>
                    </div>
                </div>`;

    //Create an outgoing chat div with user's message and append it to chat container.
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

themeButton.addEventListener("click", () => {
    //Toggle body's class for the theme mode and save the updated theme to local storage.
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

deleteButton.addEventListener("click", () => {
    //Remove the chats from local storage and call loadDataFromLocalstorage function.
    if (confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

chatInput.addEventListener("input", () => {
    //Adjust the height of the input field dynamically based on its content.
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    //If the Enter key is pressed without Shift and the window width is larger than 800 pixels, handle the outgoing chat.
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat);