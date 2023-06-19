import fs from "fs";
import path from "path";

export default  function(req, res, url) {
  const method = req.method;

  switch (method) {
    case "GET":
      if (!url.length) {
      getConvertedJSONFiles()
        .then((data) => {
          res.writeHead(201, {'Content-Type': 'text/plain'});
          res.write(`${JSON.stringify(data)}`);
          res.end();        
        })
        .catch((err) => {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.write(`no converted files!`);
          res.end(); 
        })
      }
      else if (url[0]) {
        getSpecificData(url[0])
        .then((data) => {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.write(`${JSON.stringify(data)}`);
          res.end();        
        })
        .catch((err) => {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.write(`no such file!`);
          res.end();   
        })
      }
      break;
      case "DELETE": 
         deleteJsonFile(url[0])
          .then((data) => {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(`${JSON.stringify(data)}`);
            res.end();        
          })
          .catch((err) => {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write(`no such file!`);
            res.end();   
          })
      break;
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('no converted csv files!');
      res.end();
      break;
    }
}

async function getConvertedJSONFiles(filename) {
  return new Promise(async (resolve, reject) => {
    try {
      const jsonFiles = await fs.promises.readdir(path.resolve('./converted'));
      resolve(jsonFiles);
    }
    catch(err) {
      reject(err);
    }
  })
}

function getSpecificData(fileName) {
  return new Promise(async (resolve, reject) => {
    try {
      const jsonFile = await fs.promises.readFile(path.join('converted', fileName));
      resolve(jsonFile.toString());
    }
    catch(err) {
      console.log(err);
      reject(err);
    }
  })
}

function deleteJsonFile(jsonFile) {
  return new Promise(async (resolve, reject) => {
    try {
      await fs.promises.unlink(path.join('converted', jsonFile))
      resolve(`${jsonFile} File was deleted!`)
    }
    catch(err) {
      reject(err);
    }
  })
}
