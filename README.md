# InceptionU Project 1 &ndash; Mentor/Protégé Connection System

**Status:**  Suspended<br />
*Active development is temporarily on hold.*

## About This Project

This was my submission for Project 1 in the [Full Stack Developer](https://www.inceptionu.com/full-stack-developer-program/) program at [InceptionU](https://www.inceptionu.com/) (we were given three projects altogether).

### The Assignment

The goal of Project 1 was to for each learner to make their thinking visible and build a functional API through iteration &amp; feedback cycles &ndash; in particular, to create a text-based interactive application with JavaScript and [Express.js](https://expressjs.com/) using *only* HTTP API's.

We were given additional features to strive for, such as:

- use additional HTTP methods (like PUT and POST)
- maintain state between HTTP requests
- implement persistent storage
- document the API

### The Result

Many years ago (long before there was any social media), I attended a break-out session on the subject of mentorship.  I then started thinking about a system where people with a need to learn could meet up with people who had the desire to teach.

This project is a proof-of-concept of how mentors and protégés can connect.  Users can make requests for help and offers of help.  Full [CRUD functionality](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) is implemented and data is stored locally in [JSON](https://www.json.org/json-en.html) files.  Finally, the API is completely specified in an [OpenAPI](https://www.openapis.org/) ([YAML](https://yaml.org/)) file.

## How to Install

### Prerequisites

You will need:

- [npm](https://www.npmjs.com/package/npm)
- a program like [Postman](https://www.postman.com/downloads/) or [cURL](https://curl.se/) to send the different kinds of HTTP requests and receive the different kinds of responses

### Installation

Use the green `<> Code` button to either clone this repository or download the zip file.

Next, open a command shell and change to the `code` directory.  Create a text file called `.env` with the following content:

```
DB=JSON
```

Next, install the necessary JavaScript packages by executing this command:

```
npm install
```

## How to Use

To start the back end, open a command shell and change to the `code` directory, then enter the following command:

`node server.js`

Note the port number that's displayed (5002 is pre-set, but it can be changed).  You can now use [Postman](https://www.postman.com/downloads/) or [cURL](https://curl.se/) to send HTTP requests to `localhost:5002` and receive responses.

To stop the server, type `Ctrl-C` or send a SIGINT signal to it.

## Documentation

See the [openapi.yaml](openapi.yaml) file for the complete API specification.  **TIP:**  open this file in an [OpenAPI Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/kwoodman1970/InceptionU-Project1/main/openapi.yaml) for easier viewing.

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [fs.js](https://www.npmjs.com/package/fs-js)
- [HTTP requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [OpenAPI](https://www.openapis.org/) ([YAML](https://yaml.org/))

## TODO

This system currently uses [JSON](https://www.json.org/json-en.html) files stored locally, but is capable of connecting to other data sources.  Support for [MongoDB](https://www.mongodb.com/) is currently being developed.

## How to Contribute

I'm not accepting contributions to this project.

## Copyright Notice

The files in this repository are made available under the [GitHub Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#5-license-grant-to-other-users).  Beyond that, I [reserve all other rights](https://choosealicense.com/no-permission/).

Copyright &copy; 2023 Kevin Woodman
