const line = require("@line/bot-sdk");
const express = require("express");
const app = express();
const config = require("./config.json");
const query = require("./query");
const request = require("request")
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const port = config.port;
app.listen(port, () => {
  console.log(`start server on port: ${port}`);
});

// create LINE SDK client
const client = new line.Client(config);

// reply message
// app.post("/webhook", line.middleware(config), (req, res) => {
app.post("/webhook", (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(
    req.body.events.map((event) => {
      console.log("event", event);
      // check verify webhook event
      if (
        event.replyToken === "00000000000000000000000000000000" ||
        event.replyToken === "ffffffffffffffffffffffffffffffff"
      ) {
        return;
      }
      return handleEvent(event);
    })
  )
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: "text", text }))

  );
};

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case "message":
      const message = event.message;
      switch (message.type) {
        case "text":
          return handleText(message, event.replyToken);
        case "image":
          return handleImage(message, event.replyToken);
        case "video":
          return handleVideo(message, event.replyToken);
        case "audio":
          return handleAudio(message, event.replyToken);
        case "location":
          return handleLocation(message, event.replyToken);
        case "sticker":
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case "follow":
      return replyText(event.replyToken, "Got followed event");

    case "unfollow":
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case "join":
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case "leave":
      return console.log(`Left: ${JSON.stringify(event)}`);

    case "postback":
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case "beacon":
      const dm = `${Buffer.from(event.beacon.dm || "", "hex").toString(
        "utf8"
      )}`;
      return replyText(
        event.replyToken,
        `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`
      );

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken) {
  return replyText(replyToken, message.text);
}

function handleImage(message, replyToken) {
  return replyText(replyToken, "Got Image");
}

function handleVideo(message, replyToken) {
  return replyText(replyToken, "Got Video");
}

function handleAudio(message, replyToken) {
  return replyText(replyToken, "Got Audio");
}

function handleLocation(message, replyToken) {
  return replyText(replyToken, "Got Location");
}

function handleSticker(message, replyToken) {
  return replyText(replyToken, "Got Sticker");
}

//-----------------------------------------------------------------
// multicast message

app.post('/multicast', (req, res) => {
  const data = {
    to: ["U0b10221de4570a2d715c43f4e8e960e1"],
    messages: [
      {
        type: "text",
        text: "Test najaaa"
      }
    ]
  }
  request.post({
    url: 'https://api.line.me/v2/bot/message/multicast',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 9Jb69gSIdFeOazpvXp57Dp+ynWYVTlKwKS/oKPyb+7jSOK9EJVCdCz2myje8N+6tTmIKG1JeVjZ36iYnSWRHyZQKw8cNZVowwZWRyiwCgigbR9l71TWs53QTFxLLA+iDxF5wqVfLiiK+Sx6Cbhtf4gdB04t89/1O/w1cDnyilFU="
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