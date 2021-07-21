const express = require("express");
const app = express();
const request = require("request")


app.post('/multicast', (req, res) => {
  const data = {
    to: ["${userId_1}", "${userId_2}"],
    messages: [
      {
        type: "text",
        text: "${your message}"
      }
    ]
  }
  request.post({
    url: 'https://api.line.me/v2/bot/message/multicast',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${CHANNAL ACCESS TOKEN}"
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.status(200).send([{ msg: 'success' }])
      console.log(data)
    } else {
      res.status(400).send([{ msg: 'error' }])
      console.log(error)
    }
  });
});
