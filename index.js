/* TICKET MACHINE
 * Author: Andrew Eller
 * Email: aeller916@gmail.com
 * description: uses ZenDesk API to request and display tickets from Zendesk account
 */

const rest = require('./rest_services')
const Startdomain = "https://zccticketmachine.zendesk.com/api/v2/tickets.json?page[size]=25";
const prompt = require("prompt-sync")({ sigint: true });
const process = require("process");

// Displays viable user options
function userOptions(pageNum, hasMore){
  console.log("\n-------------------------------");
  if(pageNum > 1)
    console.log("p - previous page of tickets");
  if(hasMore && (pageNum > 0))
    console.log("n - next page of tickets");
  if(pageNum == 0)
    console.log("a - show all tickets")
  console.log("i - find ticket by ID")
  console.log("q - quit program");
  console.log("-------------------------------");
}

// Displays message on startup
function welcomeMessage() {
  console.log("\n-=# WELCOME TO TICKET MACHINE TICKET VIEWER #=-")
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
    nextTicketList = await rest.fetch25(nextDomain);
    return nextTicketList;
  }
  else if(pageNum === -1){
    prevDomain = ticketList.links.prev;
    prevTicketList = await rest.fetch25(prevDomain);
    return prevTicketList;
  }
  else if(pageNum === 0){
    return ticketList;
  }
  else
    console.log("ERROR - pageNum out of bounds")
}

// formats and displays ticket information of interest
function displayTicket(ticket){
  console.log("*********************************************************************************");
  console.info("Ticket ID: " + ticket.id);
  // assignee info would go here...error uploading assignees.
  console.info("Subject: " + ticket.subject);
  console.log("_________________________________________________________________________________");
  console.info("\nDescription: " + ticket.description);
  console.info("\nTags: " + ticket.tags +"\n");
}

function displayFooter(page) {
  console.info("page " + page);
}

// iterates through ticket list and displays each ticket
function displayTickets(ticketList) {
  for(let i = 0; i < ticketList.tickets.length; i++) 
    displayTicket(ticketList.tickets[i]);
}

// Main menu with user input loop
async function mainMenu(){

  welcomeMessage();
  var jsonList = null;
  try{
    jsonList = await rest.fetch25(Startdomain);
  }
  catch(error) {
    console.log(error);
    console.log("\n LOGS CURRENTLY NOT AVAILABLE")
    return;
  }
  var selectionPrompt;
  var page = 0;
  var hasMore = (jsonList.meta.has_more)  

  do {
    userOptions(page, hasMore);
    selectionPrompt = prompt("Please enter a selection: ");
    
    // next page
    if ((selectionPrompt === "n") && hasMore && (page > 0)) {
      page++;
      jsonList = await getTickets(1, jsonList);
      displayTickets(jsonList);
      displayFooter(page);
    }
    // previous page
    else if ((selectionPrompt === "p") && (page > 1)) {
      page--;
      jsonList = await getTickets(-1, jsonList);
      displayTickets(jsonList);
      displayFooter(page);
    }
    // search by id
    else if(selectionPrompt === "i") {
      const idToSearchFor = prompt("Enter Ticket Id to search for: ");
      const ticket = await rest.getById(idToSearchFor);
      if(ticket)
        displayTicket(ticket.ticket);
      else
        console.log("\n ERROR - ticket not found");
    }
    // quit
    else if (selectionPrompt === "q"){
      console.log("Goodbye.");
      break;
    }
    // display all tickets
    else if((selectionPrompt === "a") && (page === 0)) {
      page++;
      jsonList = await getTickets(0, jsonList);
      displayTickets(jsonList);
      displayFooter(page);
      
    }
    else {
      console.log("invalid selection");
    }
    
    // check to see if there are more tickets to display
    hasMore = (jsonList.meta.has_more);
  }
  while (true);
}

// starts program
if (process.argv.includes("--prod")) {
  mainMenu.call();
}

exports.getTickets = getTickets;
exports.mainMenu = mainMenu;
exports.userOptions = userOptions;