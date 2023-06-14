import worker, { Worker } from "worker_threads";
import fs from "fs";
import path from "path";
import os from "os";

let csvFiles ;
const countCPUs = os.cpus().length;

class WorkerThreads {
    getCsvFiles(dirPath) {
      return new Promise((resolve, reject) => {
        fs.promises.stat(dirPath)
          .then(() => {
             fs.promises.readdir(dirPath)
               .then((data) => {                
                  resolve(data.filter((file => path.extname(file) === '.csv')));
               })
               .catch((err) => {
                  reject(err)
                })
             })
        .catch((err) => {
            reject('No such directory!');
        });
      });
    };

    createDirectory(dirPath) {
      return new Promise((resolve, reject) => {
        fs.promises.access(dirPath)
          .then((data) => {
            resolve('Directory is exists!')
          })
          .catch(() => {
            fs.promises.mkdir(dirPath)
              .then(() => {
                resolve('Directory successfully created!')
              })
              .catch((err) => {
                reject(err)
              })
          })
      })
    }

    createThreads(csvFiles) {
      return new Promise((resolve, reject) => {
        try {
          let filesForThread = Array.from({length: countCPUs}, () => []);
          let threads = [];
          for(let i = 0, j = 0; i < csvFiles.length; i++, j++){
            if (j >= countCPUs) {
              j = -1;
              j++;
            }
            filesForThread[j].push(path.join(path.resolve(),'csv-files', csvFiles[i]));         
          }
            
          for (let i = 0; i < countCPUs; i++) {
            const worker = new Worker(path.resolve('worker.js'));
            threads.push(worker);
          }

          resolve({threads, filesForThread});
        } catch(err) {
            reject(err);
        } 
      })
    }

    sendFilesToThreads(data) {
      return new Promise((resolve, reject) => {
       try{
         for (let i = 0; i < data.threads.length; i++) {
           const worker = data.threads[i];

           worker.on('online', () => {
             worker.postMessage(data.filesForThread[i])
           })
         }

         resolve();
        } catch(err) {
            reject(err);
        }
      })
    }
}

const workerInstance = new WorkerThreads();

const csvFilesName = workerInstance.getCsvFiles('./csv-files');

csvFilesName
  .then((data) => {
     csvFiles = data;
     workerInstance.createDirectory('csv-files/converted');
     workerInstance.createThreads(csvFiles)
       .then((data) => {
         workerInstance.sendFilesToThreads(data);
         console.log(data.threads.length);
       })
       .catch((err) => {
          console.log(err);
        })
  })
  .catch((err) => {
     console.log(err);
   })
