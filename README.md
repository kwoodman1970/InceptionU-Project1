# InceptionU Project 1 &ndash; Mentor/Protégé Connection System

Many years ago (long before there was any social media), I attended a break-out session on the subject of mentorship.  I then started thinking about a system where people with a need to learn could meet up with people who had the desire to teach.

This project is a proof-of-concept of how mentors and protégés can connect.  It implements a back-end for a web-based system and uses [Node.js](https://nodejs.org/).

## Getting Started

To prepare, start by cloning this repository and installing the node packages.  Next, create a text file in the `code` directory called `.env` and put the following line in:

`DB=JSON`

## Starting the Server

To start the server, change to the `code` directory and issue the following command:

`node server.js`

## Future Tasks

This system currently uses JSON files stored locally, but is capable of connecting to other data sources.  I'd like to add the ability to connect to MongoDB in particular.  I'd like to do this before Cohort 10 at InceptionU draws to a close.
