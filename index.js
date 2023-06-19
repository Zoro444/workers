import http  from "http";
import dotenv from "dotenv";
import router from "./router/index.js";

dotenv.config();
const port = 3000;

const server = http.createServer(function (req, res) {
  router(req, res);
});

server.listen(port, () => {
  console.log(`server started on port ${port}`);
})
