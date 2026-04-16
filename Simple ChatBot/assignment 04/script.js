async function askAI() {
      let query = document.getElementById("question").value;

      let response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: query }]
              }
            ]
          })
        }
      );

      let data = await response.json();
      let result = data.candidates[0].content.parts[0].text;

      document.getElementById("answer").innerText = result;
    }