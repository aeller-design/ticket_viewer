const index = require("./../index");
const rest = require("./../rest_services");

test("get 25", async () => {
    const Startdomain = "https://zccticketmachine.zendesk.com/api/v2/tickets.json?page[size]=25";
    var jsonList = await rest.fetch25(Startdomain);
    expect(jsonList.tickets[0]).toBeDefined();
    expect(jsonList.tickets[24]).toBeDefined();
    expect(jsonList.tickets[24]).toHaveProperty('id', 25);
    expect(jsonList.tickets[25]).toBeUndefined();
});

test("get tickets - same page", async () => {
    const Startdomain = "https://zccticketmachine.zendesk.com/api/v2/tickets.json?page[size]=25";
    const jsonList = await rest.fetch25(Startdomain);
    const sameList = await index.getTickets(0,jsonList);
    expect(sameList).toBe(jsonList);
});

test("get tickets - next page", async () => {
    const Startdomain = "https://zccticketmachine.zendesk.com/api/v2/tickets.json?page[size]=25";
    const jsonList = await rest.fetch25(Startdomain);
    const nextList = await index.getTickets(1,jsonList);
    expect(nextList.tickets[0]).toHaveProperty('id', 26);
    expect(nextList.tickets[24]).toHaveProperty('id', 50);
    expect(nextList.tickets[25]).toBeUndefined();
});

test("get by id - subject", async ()=> {
    var ticket = await rest.getById("101");
    expect(ticket).toBeDefined();
    expect(ticket.ticket.subject).toBe("in nostrud occaecat consectetur aliquip");
})

test("get by id - status", async ()=> {
    
    var ticket = await rest.getById("1");
    expect(ticket).toBeDefined();
    expect(ticket.ticket.status).toBe("open");
})

test("get by id - nonexistant", async ()=> {
    var ticket = await rest.getById("1001");
    expect(ticket).toBeDefined();
    expect(ticket).toBe(false);
})

// strings for user options
const topLine = "\n-------------------------------";
const prev = "p - previous page of tickets";
const next = "n - next page of tickets";
const all = "a - show all tickets";
const findId = "i - find ticket by ID";
const quit = "q - quit program";
const bottomLine = "-------------------------------";

test("user options - main menu", ()=>{
    console.log = jest.fn();
    index.userOptions(0,true);
  
    expect(console.log.mock.calls[0][0]).toBe(topLine);
    expect(console.log.mock.calls[1][0]).toBe(all);
    expect(console.log.mock.calls[2][0]).toBe(findId);
    expect(console.log.mock.calls[3][0]).toBe(quit);
    expect(console.log.mock.calls[4][0]).toBe(bottomLine);
})

test("user options - first page", ()=>{
    console.log = jest.fn();
    index.userOptions(1,true);
  
    expect(console.log.mock.calls[0][0]).toBe(topLine);
    expect(console.log.mock.calls[1][0]).toBe(next);
    expect(console.log.mock.calls[2][0]).toBe(findId);
    expect(console.log.mock.calls[3][0]).toBe(quit);
    expect(console.log.mock.calls[4][0]).toBe(bottomLine);
})

test("user options - 1 < page < n", ()=>{
    console.log = jest.fn();
    index.userOptions(6,true);
  
    expect(console.log.mock.calls[0][0]).toBe(topLine);
    expect(console.log.mock.calls[1][0]).toBe(prev);
    expect(console.log.mock.calls[2][0]).toBe(next);
    expect(console.log.mock.calls[3][0]).toBe(findId);
    expect(console.log.mock.calls[4][0]).toBe(quit);
    expect(console.log.mock.calls[5][0]).toBe(bottomLine);
})

test("user options - last page", ()=>{
    console.log = jest.fn();
    index.userOptions(2,false);
  
    expect(console.log.mock.calls[0][0]).toBe(topLine);
    expect(console.log.mock.calls[1][0]).toBe(prev);
    expect(console.log.mock.calls[2][0]).toBe(findId);
    expect(console.log.mock.calls[3][0]).toBe(quit);
    expect(console.log.mock.calls[4][0]).toBe(bottomLine);
})