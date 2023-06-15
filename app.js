import workers, { Worker } from "worker_threads";
import fs from "fs";
import path from "path";
import os from "os";

let csvFiles ;
let countCPUs = os.cpus().length;
const totalInfo = [];
let activeWorkers = 0;

//To use the code, import the "WorkerThreads" class into your code, create an instance,
// and call the start(<csv directory path>) method.
export default class WorkerThreads {
   
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
          let workersCount = 0;
          if (countCPUs > csvFiles.length) {
            countCPUs = csvFiles.length;
          }
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
             worker.postMessage(data.filesForThread[i]);
             activeWorkers++;
           })

         }

         resolve();
        } catch(err) {
            reject(err);
        }
      })

    }

    start(csvFilePath) {
        return new Promise((resolve, reject) => {
            const workerInstance = new WorkerThreads();
            const csvFilesName = workerInstance.getCsvFiles(csvFilePath);
            
            csvFilesName
              .then((data) => {
                 csvFiles = data;
                 workerInstance.createDirectory('csv-files/converted');
                 workerInstance.createThreads(csvFiles)
                   .then((data) => {
                     workerInstance.sendFilesToThreads(data);
                     data.threads.forEach((thread) => {
                      thread.on('message', (info) => {
                        totalInfo.push(info);
                        activeWorkers--;
                        if (activeWorkers === 0) {
                          totalInfo.forEach((item) => {
                            console.table(item)
                            resolve(totalInfo);
                          })
                        }
                      })
                     })
                   })
                   .catch((err) => {
                    reject(err)
                    })
              })
              .catch((err) => {
                reject(err)
               })
        })
       
    }
}

//test
const workerInstance = new WorkerThreads();
workerInstance.start('csv-files')
