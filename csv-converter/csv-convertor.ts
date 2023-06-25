import { Worker } from "worker_threads";
import fs from "fs";
import path from "path";

class WorkerThreads {
  private csvFiles: string[];
  private totalInfo: any[];
  private activeWorkers: number;

  constructor() {
    this.csvFiles = [];
    this.totalInfo = [];
    this.activeWorkers = 0;
  }

  async getCsvFiles(dirPath: string): Promise<string[]> {
    try {
      await fs.promises.stat(dirPath);
      const files = await fs.promises.readdir(dirPath);
      this.csvFiles = files.filter((file) => path.extname(file) === ".csv");
      return this.csvFiles;
    } catch (err) {
      throw new Error("No such directory!");
    }
  }

  async createDirectory(dirPath: string): Promise<string> {
    try {
      await fs.promises.access(dirPath);
      return "Directory exists!";
    } catch {
      await fs.promises.mkdir(dirPath);
      return "Directory successfully created!";
    }
  }

  createThreads(csvFiles: string[], filePath: string): { threads: Worker[]; filesForThread: string[][] } {
    const filesForThread: string[][] = Array.from({ length: csvFiles.length }, () => []);
    const threads: Worker[] = [];

    for (let i = 0; i < csvFiles.length; i++) {
      filesForThread[i].push(path.join(filePath, csvFiles[i]));
    }

    for (let i = 0; i < csvFiles.length; i++) {
      const worker = new Worker(path.join(path.resolve(), "csv-converter", "worker.mjs"));
      threads.push(worker);
    }

    return { threads, filesForThread };
  }

  async sendFilesToThreads(data: { threads: Worker[]; filesForThread: string[][] }) {
    for (let i = 0; i < data.threads.length; i++) {
      const worker = data.threads[i];
      worker.on("online", () => {
        worker.postMessage(data.filesForThread[i]);
        this.activeWorkers++;
      });
    }
  }

  async start(csvFilePath: string): Promise<any[]> {
    try {
      const csvFiles = await this.getCsvFiles(csvFilePath);
      await this.createDirectory(path.resolve("converted"));

      const data = this.createThreads(csvFiles, csvFilePath);

      await this.sendFilesToThreads(data);

      return new Promise((resolve, reject) => {
        for (let i = 0; i < data.threads.length; i++) {
          data.threads[i].on("message", (info) => {
            this.totalInfo.push(info);
            this.activeWorkers--;
            if (this.activeWorkers === 0) {
              resolve(this.totalInfo);
            }
          });
        }
      });
    } catch (err) {
      throw err;
    }
  }
}

export default WorkerThreads;
