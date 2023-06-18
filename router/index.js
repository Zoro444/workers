import exports from "./exports.js";
import files from "./files.js";

export default function(req, res) {

  const url = req.url;

  switch (url) {
    case '/exports': 
      exports(req, res)
      break;
    case "/files":
      files(req, res)
      break
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('404');
  
      res.end();
    }
}
