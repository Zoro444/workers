import { Worker } from "worker_threads";
import fs from "fs";
import path from "path";

class WorkerThreads {
  constructor() {
    this.csvFiles = [];
    this.totalInfo = [];
    this.activeWorkers = 0;
  }

  async getCsvFiles(dirPath) {
    try {
      await fs.promises.stat(dirPath);
      const files = await fs.promises.readdir(dirPath);
      this.csvFiles = files.filter((file) => path.extname(file) === ".csv");
      return this.csvFiles;
    } catch (err) {
      throw new Error("No such directory!");
    }
  }

  async createDirectory(dirPath) {
    try {
      await fs.promises.access(dirPath);
      return "Directory exists!";
    } catch {
      await fs.promises.mkdir(dirPath);
      return "Directory successfully created!";
    }
  }

  createThreads(csvFiles) {
    const filesForThread = Array.from(
      { length: csvFiles.length },
      () => []
    );
    const threads = [];

    for (let i = 0; i < csvFiles.length; i++) {
      filesForThread[i].push(
        path.join(path.resolve(), "csv-files", csvFiles[i])
      );
    }

    for (let i = 0; i < csvFiles.length; i++) {
      const worker = new Worker(path.resolve( "worker.js"));
      threads.push(worker);
    }

    return { threads, filesForThread };
  }

  async sendFilesToThreads(data) {
    for (let i = 0; i < data.threads.length; i++) {
      const worker = data.threads[i]; 
      worker.on("online", () => {
        worker.postMessage(data.filesForThread[i]);
        this.activeWorkers++;   
      });   
    }
  }

  async start(csvFilePath) {
    try {
      const csvFiles = await this.getCsvFiles(csvFilePath);
      await this.createDirectory("csv-files/converted");

      const data = this.createThreads(csvFiles);

      await this.sendFilesToThreads(data);

      return new Promise((resolve, reject) => { 
        for(let i = 0; i < data.threads.length; i++) {
          data.threads[i].on("message", (info) => {
            this.totalInfo.push(info);
            this.activeWorkers--;
            if (this.activeWorkers === 0) {
              resolve(this.totalInfo);
            }
          })
        }
      })
      
    } catch (err) {
      throw err;
    }
  }
}

export default WorkerThreads;


const workerInstance = new WorkerThreads();
workerInstance.start("csv-files")
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  })
