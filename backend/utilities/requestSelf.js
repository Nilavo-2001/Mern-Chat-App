const axios = require('axios');

function RequestSelf() {
    console.log("calling Self");
    axios.get('https://anonychat-gxrf.onrender.com/').then((response) => {
        console.log(response.status);
    })
}

module.exports = RequestSelf;



