import http from "http";
import dotenv from "dotenv";
import router from "./router/index";

dotenv.config();
const port = process?.env.PORT ?? "3000";

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  router(req, res);
});

server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
