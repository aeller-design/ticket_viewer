const axios = require('axios');


// Authorization information
const email = "aeller916@gmail.com";
const apiToken = "V4kcMLcYowMO22QSVMyxawdttZQAuEvLzGTG0TTj";

async function fetch25(domain) {
  try {
      const response = await axios.get(domain, {
          headers: {
              'Authorization': 'Basic ' + Buffer.from(email + '/token:' + apiToken).toString('base64')
          }
      });
      return response.data;
  }
  catch (error) {
      console.log(error);
      console.log("\n ***LOG SERVICES CURRENTLY UNAVAILABLE***\n")
      return false;
  }
}

async function getById(id){
  try {
    const response = await axios.get("https://zccticketmachine.zendesk.com/api/v2/tickets/" + id.toString(), {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(email + '/token:' + apiToken).toString('base64')
      }
    });
    return response.data;
  }
  catch (error){
    console.log(error);
    console.log("\n ***LOG SERVICES CURRENTLY UNAVAILABLE***\n") 
    return false;         
  }  
}

exports.fetch25 = fetch25;
exports.getById = getById;