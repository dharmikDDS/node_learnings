const { log } = require("console");
const http = require("http");

const port = 8000;
const host = "127.0.0.1";

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.statusCode = 200;
    res.end("Hello, hope you are doing well.");
  } else if (req.url === "/name" && req.method === "GET") {
    res.statusCode = 200;
    res.end("My name is dharmik rokad.");
  } else if (req.url === "/greetings" && req.method === "GET") {
    res.statusCode = 200;

    const hour = new Date().getHours();

    res.end(_getGreet());

    function _getGreet() {
      if (hour < 5) {
        return "It's time to sleep.";
      }

      return `Good ${
        hour >= 5 && hour < 11
          ? "morning"
          : hour >= 11 && hour < 12
          ? "noon"
          : hour >= 12 && hour < 16
          ? "afternoon"
          : hour >= 16 && hour < 20
          ? "evening"
          : "night"
      }, Man!`;
    }
  } else {
    res.statusCode = 404;
    res.end("route not found.");
  }
});

server.listen(port, host, () => {
  console.log(`listening to ${host}:${port}`);
});
