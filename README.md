# CSV to JSON Converter

This project is a multi-process CSV to JSON converter implemented in Node.js. It utilizes the `worker-threads` module to distribute the processing of CSV files across multiple worker processes.

## Features

- Parses CSV files and converts them to JSON format
- Distributes processing across multiple worker threads for improved performance
- Supports conversion of multiple CSV files in parallel
- Writes the converted JSON files to the `converted` directory

## Prerequisites

- Node.js (version 18.16.0 or higher)


## Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/your-username/csv-to-json-converter.git


##
To use the code, import the "WorkerThreads" class into your code, create an instance,
 and call the start(<csv directory path>) method.
