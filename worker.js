import { parentPort } from "worker_threads";
import path from "path";
import fs from "fs";
import csv from "csv-parser";


export default class ReadAndWriteFile{
  readFile(file) {
    return new Promise((resolve, reject) => {
      try {
        const readablyStream = fs.createReadStream(file);

        let duration;
        let start;
        let records = 0;
        readablyStream
        .on('open', () => {
            start = new Date();
        })
        .pipe(csv())
        .on('data', (data) => {
            records++;
        })
        .on('error', (err) => {
            reject(err);
        })
        .on('end', () => {
            duration = new Date - start;
            console.log(duration);
        })
        .on('close', () => process.exit())

      }catch(err) {
        reject(err);
      }

    })
  }
}



parentPort.on('message', (message) => {
    const worker = new ReadAndWriteFile();
    worker.readFile(message[0])
})



