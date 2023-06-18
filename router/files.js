export default function(req, res) {
  const method = req.method;
  console.log(method);
        
  switch (method) {
    case "/get":
        console.log("get");
       break
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('no converted csv files!');
      res.end();
    }
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World from files!');
  res.end();
}

