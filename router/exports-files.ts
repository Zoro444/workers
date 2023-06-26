import CsvConverter from "../csv-converter/csv-convertor";
import { IncomingMessage, ServerResponse } from "http";

export default function (req: IncomingMessage, res: ServerResponse) {
  const method: string | undefined = req.method;

  switch (method) {
    case "POST":   
      csvConverter(req, res);
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("404");
      res.end();
  }
}

function csvConverter(req: IncomingMessage, res: ServerResponse) {
  let body: { directoryPath: string }[] = [];
  const csvConvert = new CsvConverter();

  req.on("data", (data) => {
    body.push(JSON.parse(data.toString()));
  });

  req.on("end", () => {
    csvConvert
      .start(body[0].directoryPath)
      .then((data: { fileName: string }[]) => {
  
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(
          `csv files successfully converted!`
        );
        res.end();
      })
      .catch((err: Error) => {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("no such directory!");
        res.end();
      });
  });
}
