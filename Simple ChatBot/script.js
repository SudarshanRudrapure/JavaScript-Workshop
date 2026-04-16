async function askAI() {
    const query = document.getElementById('userInput').value;
    const responseDiv = document.getElementById('chatResponse');
    
    responseDiv.innerText = "Thinking...";

    try {
        let response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: query }] }]
            })
        });

        let data = await response.json();

        if (data.candidates) {
            responseDiv.innerText = data.candidates[0].content.parts[0].text;
        } else {
            responseDiv.innerText = "Error: " + data.error.message;
        }
    } catch (e) {
        responseDiv.innerText = "Connection failed.";
    }
}