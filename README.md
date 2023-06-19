# CSV to JSON Converter

The CSV to JSON Converter is a program that allows you to convert CSV files to JSON format. It provides an HTTP API that supports POST, DELETE and GET methods to handle file conversion and retrieval.

## Installation

To use the CSV to JSON Converter, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the dependencies by running the command `npm install`.

## Usage

### Starting the Server

To start the server and make the API endpoints available, run the following command:

npm start

Converting CSV Files to JSON
To convert a CSV file to JSON, make a POST request to localhost:3000/exports. The request body should include the following JSON object:

{
  "directory path": "<YOUR FILE PATH>"
}

To retrieve the names of all converted files, make a GET request to localhost:3000/files. The server will respond with a JSON array containing the names of the converted files.

To retrieve the specific data from a converted JSON file, make a GET request to localhost:3000/files/filename, replacing filename with the actual name of the file  The server will respond with the JSON data from the specified file.

Deleting Converted Files
To delete a converted JSON file, make a DELETE request to localhost:3000/files/filename, replacing filename with the name of the file you want to delete 

