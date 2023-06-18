import CsvConverter from "../csv-converter/csv-convertor.js";

export default function(req, res) {

    const method = req.method;

        
    switch (method) {
      case 'POST': 
        csvConverter(req, res);
         break;
      case "GET":
          console.log("get");
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.write("GET");
          res.end();
         break
      default:
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404');
        res.end();
      }
}

function csvConverter(req, res) {
    let body = [];
    const csvConvert = new CsvConverter();

    req.on('data', (data) => {
      body.push(JSON.parse(data.toString()))
    });
    
    req.on('end', () => {
      csvConvert.start(body[0].directoryPath)
      .then((data) => {
        res.writeHead(201, {'Content-Type': 'text/plain'});
        res.write(`${data.length} csv files successfully converted!`);
        res.end();
      })
      .catch((err) => {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('no such directory!');
        res.end();
      })
    });
}
