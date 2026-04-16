let query = "give me a list of all countries in the world"

async function chatgptclone(query){
  let response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=APIKEY",
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
  )

  let data = await response.json()
  document.write(data.candidates[0].content.parts[0].text)
}

chatgptclone(query)