import exportsFiles from "./exports-files";
import files from "./files";
import { IncomingMessage, ServerResponse } from "http";

export default function(req: IncomingMessage, res: ServerResponse) {
  const url: string[] | undefined = req.url?.split('/');
  if (url) {
   switch (url[1]) {
     case 'exports': 
       exportsFiles(req, res);
       break;
     case "files":
       files(req, res, url?.slice(2))
       break
     default:
       res.writeHead(404, {'Content-Type': 'text/plain'});
       res.write('page not found!');
       res.end();
    }
  }
}
