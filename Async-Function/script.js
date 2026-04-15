async function myapi(){
 let data = await
fetch('https://jsonplaceholder.typicode.com/users')
 let user = await data.json()
 console.log(user[0].name)
 console.log(user[0].email)
 console.log(user[0].website)
 console.log(user[1].name)
 console.log(user[1].email)
 console.log(user[1].website)
}
myapi();