async function getQuotes() {
  try {
    // Step 1: fetch data
    let response = await fetch("https://dummyjson.com/quotes");
    let data = await response.json();

    // Step 2: print quote + author
    data.quotes.forEach((item) => {
      console.log("Quote:", item.quote);
      console.log("Author:", item.author);
      console.log("-----------");
    });

  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

getQuotes();
