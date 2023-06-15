import { parentPort } from "worker_threads";
import path from "path";
import fs from "fs";
import csv from "csv-parser";


export default class ReadAndWriteFile{
  readFile(file) {
    return new Promise((resolve, reject) => {
      try {
        const jsonFile = path.basename(file, path.extname(file)) + ".json";
        const fileName = path.join(path.dirname(file), 'converted', jsonFile);

        const readablyStream = fs.createReadStream(file);
        const writableStream = fs.createWriteStream(fileName);
 
        let duration;
        let start;
        let records = 0;
        let firstData = true;

        readablyStream
        .on('open', () => {
            start = new Date();
        })
        .pipe(csv())
        .on('data', (data) => {
            records++;
            writableStream.write(firstData 
              ? `[${JSON.stringify(data)}`
              : `,${JSON.stringify(data)}`
          );
          firstData = false;
        })
        .on('error', (err) => {
            reject(err);
        })
        .on('end', () => {
            duration = new Date - start;
            writableStream.write(']')
        })

        readablyStream.on('close', () => {
          resolve({
            fileName: path.basename(file),
            duration,
            records
          })
        })
    
      }catch(err) {
        reject(err);
      }
    })
  }
}

parentPort.on('message', (message) => {
  let totalFiles = 0;
  message.forEach((item) => {
    totalFiles++;
    const worker = new ReadAndWriteFile()

    worker.readFile(item)
      .then((data) => {
        totalFiles--;
        console.log(data);
        if (totalFiles === 0) {
          setTimeout(process.exit, 200)
        }
      })
      .catch((err) => {
        console.log(err);
      })
   });
})



