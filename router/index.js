import exports from "./exports.js";
import files from "./files.js";

export default function(req, res) {
  const url = req.url.split('/');

  switch (url[1]) {
    case 'exports': 
      exports(req, res, url.slice(2))
      break;
    case "files":
      files(req, res, url.slice(2))
      break
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('page not found!');
      res.end();
    }
}
