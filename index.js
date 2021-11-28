const axios = require('axios');
const prompt = require("prompt-sync")({ sigint: true });

const Startdomain = "https://zccticketmachine.zendesk.com/api/v2/tickets.json?page[size]=25";

// Authorization information
const email = "aeller916@gmail.com";
const apiToken = "V4kcMLcYowMO22QSVMyxawdttZQAuEvLzGTG0TTj";

// fetches tickets based on domain passed in.  Domains should always specify increments of 25 tickets
async function fetch25(domain){
    try {
       const response = await axios.get(domain, {
         headers: {
           'Authorization': 'Basic ' + Buffer.from(email + '/token:' + apiToken).toString('base64')
         }
       });
       return response.data;     
    }
    catch (error){
       console.log(error); 
       return false;         
    }
 }

// Displays viable user options
function userOptions(pageNum, hasMore){
  console.log("\n-------------------------------");
  if(pageNum > 1)
    console.log("p - previous page of tickets");
  if(hasMore)
    console.log("n - next page of tickets");
  console.log("q - quit program");
  console.log("-------------------------------");
}

// Displays message on startup
function welcomeMessage() {
  console.log("\n-= WELCOME TO TICKET MACHINE TICKET VIEWER =-")
}

// input: pageNumber and current list of tickets
// output: updated list of tickets:
//    next 25 results, previous 25 results or current results
// pageNum values map: -1 = previous page; 0 = current page; 1 = next page.
async function getTickets(pageNum, ticketList) {
  var nextDomain = null;
  var nextTicketList = null;

  if(pageNum === 1){
    nextDomain = ticketList.links.next;
    nextTicketList = await fetch25(nextDomain);
    return nextTicketList;
  }
  else if(pageNum === -1){
    prevDomain = ticketList.links.prev;
    prevTicketList = await fetch25(prevDomain);
    return prevTicketList;
  }
  else if(pageNum === 0){
    console.log(ticketList);
    return ticketList;
  }
  else
    console.log("ERROR - pageNum out of bounds")
}

// Main menu with user input loop
async function mainMenu(){

  welcomeMessage();

  var jsonList = await fetch25(Startdomain);
  
  var selectionPrompt;
  var page = 1;
  var hasMore = (jsonList.meta.has_more)  
  
  getTickets(0, jsonList);

  do {
    userOptions(page, hasMore);
    selectionPrompt = prompt("Please enter a selection: ");
    
    if ((selectionPrompt === "n") && hasMore) {
      page++;
      jsonList = await getTickets(1, jsonList);
    }
    else if ((selectionPrompt === "p") && (page > 1)) {
      console.log("previous page");
      page--;
      jsonList = await getTickets(-1, jsonList);
    }
    else if (selectionPrompt === "q"){
      console.log("Quiting Program.  Goodbye.");
      break;
    }
    else {
      console.log("invalid selection");
    }

    console.log(jsonList);
    hasMore = (jsonList.meta.has_more);
  }
  while (true);
}

// starts program
mainMenu.call();