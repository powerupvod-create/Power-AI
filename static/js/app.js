const chat = document.getElementById("chat");
const input = document.getElementById("message");
const statusText = document.getElementById("status");

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 1;
  speechSynthesis.speak(speech);
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";
  statusText.textContent = "Power AI is thinking...";

  try {
    const response = await fetch("/ask", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message})
    });

    const data = await response.json();
    const answer = data.answer || "No response received.";

    addMessage(answer, "bot");
    speak(answer);
    statusText.textContent = "Power AI is ready";
  } catch (error) {
    addMessage("AI server is not connected yet.", "bot");
    statusText.textContent = "Connection error";
  }
}

document.getElementById("send").addEventListener("click", sendMessage);

input.addEventListener("keydown", event => {
  if (event.key === "Enter") sendMessage();
});

document.getElementById("mic").addEventListener("click", () => {
  const Recognition = window.SpeechRecognition ||
                      window.webkitSpeechRecognition;

  if (!Recognition) {
    statusText.textContent = "Voice recognition not supported";
    return;
  }

  const recognition = new Recognition();
  recognition.lang = "en-US";
  recognition.onstart = () => statusText.textContent = "Listening...";
  recognition.onresult = event => {
    input.value = event.results[0][0].transcript;
    sendMessage();
  };
  recognition.onerror = () => statusText.textContent = "Voice error";
  recognition.onend = () => statusText.textContent = "Power AI is ready";
  recognition.start();
});
