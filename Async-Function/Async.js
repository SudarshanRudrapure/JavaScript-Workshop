async function myFunc() {
  return "Hello!";
}

// Even though we returned a string, 
// JavaScript automatically wraps it in a Promise.
console.log(myFunc());  
                
                        // Output: Promise { <fulfilled>: "Hello!" }

function waitTwoSeconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Done after 2 seconds");
    }, 2000);
  });
}

async function run() {
  let result = await waitTwoSeconds();
  console.log(result);
}
run();
 // Output after 2 seconds: "Done after 2 seconds"