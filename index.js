const axios = require('axios');
const prompt = require("prompt-sync")({ sigint: true });

async function fetchAll(){
    try {
       const response = await axios.get('http://localhost:5000/users');
       return response.data.users_list;     
    }
    catch (error){
       //We're not handling errors. Just logging into the console.
       console.log(error); 
       return false;         
    }
 }

var selectionPrompt; 

do {
  selectionPrompt = prompt("Please enter a selection: ");

  if (selectionPrompt == "n") {
    console.log("n selected");
  }
  else if (selectionPrompt =="p") {
    console.log("p selected");
  }
  else {
    console.log("invalid selection");
  }
}
while (selectionPrompt != "q");
