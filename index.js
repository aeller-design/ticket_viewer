const axios = require('axios');
const prompt = require("prompt-sync")({ sigint: true });
const domain = "https://zccticketmachine.zendesk.com/api/v2/tickets.json";
const email = "aeller916@gmail.com";
const apiToken = "V4kcMLcYowMO22QSVMyxawdttZQAuEvLzGTG0TTj";

async function fetchAll(){
    try {
       const response = await axios.get(domain, {
         headers: {
           'Authorization': 'Basic ' + Buffer.from(email + '/token:' + apiToken).toString('base64')
         }
       });
       return response.data;     
    }
    catch (error){
       //We're not handling errors. Just logging into the console.
       console.log(error); 
       return false;         
    }
 }

 //console.log(email + '/token:' + apiToken)
 //console.log(Buffer.from(email + '/token:' + apiToken).toString('base64'));

async function mainMenu(){
  var selectionPrompt; 

  do {
    selectionPrompt = prompt("Please enter a selection: ");

    if (selectionPrompt === "n") {
      const jsonlist = await fetchAll();
      //const jsonStr = JSON.stringify(jsonlist);
      console.log(jsonlist);
      
    }
    else if (selectionPrompt === "p") {
      console.log("p selected");
    }
    else if (selectionPrompt === "q"){
      console.log("Quiting Program.  Goodbye.");
      break;
    }
    else {
      console.log("invalid selection");
    }
  }
  while (true);
}

mainMenu.call();