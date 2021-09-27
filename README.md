# Cricket Information System

![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)

This repository contains:

- A shell script for executing the app.
- A client folder.
- Server files .
- Docker file.
- Docker compose file for dockerizing all the three parts.


## Table of Contents

- [Background](#background)
- [TechnologiesUsed](#technologiesused)
- [Prerequisites](#prerequisites)
- [CurrentStatus](#currentstatus)
- [Installation](#installation)
- [Working](#working)
- [Contributing](#contributors)

## Background

We aim to create a distributed system that notifes the user about various cricketing statistics presently going on. The user will have the flexibilty to choose the type of notifications it desires and the system will only send the relevant information to it.
We will be publishing the app on Docker so that the app is platform independant and can be used ubiquitously. 

## TechnologiesUsed

- Front-End Development: React JS
- Back-End Development : Node JS
- Database: MongoDB
- Deployment : Docker

## Prerequisites:

- [node](http://nodejs.org) 
- [npm](https://npmjs.com)
- [fastify](https://www.fastify.io/)
- [fastify-cors](https://www.npmjs.com/package/fastify-cors)
- [mongoose](https://mongoosejs.com/docs/)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [uuid](https://www.npmjs.com/package/uuid)
- [react](https://reactjs.org/)
- [redux](https://redux.js.org/)
- [axios](https://axios-http.com/docs/intro)
- [highcharts](https://www.highcharts.com/)
- [react-dom](https://reactjs.org/docs/react-dom.html)
- [react-redux](https://react-redux.js.org/)
- [react-scripts](https://www.npmjs.com/package/react-scripts)
- [redux-thunk](https://github.com/reduxjs/redux-thunk)
- [docker](https://www.docker.com/)

## CurrentStatus 
[26th September,2021]: We have created a simple CRUD (Create,Read,Update,Delete) app that fetches the data from the database and gives us the relevant values.
We have created a UI where a person is able to see the win percentage of a particular team by clicking on the respective cards. Five API's have been created to create this version.

 ### Backend Status: ###
   #### Ports ####
   - Backend: 5000
   - MongoDb: 27017
   
   #### API's: ####
   - **Add Match Details API:** (localhost:5000/api/cricket) This helps the user to add the details of a match. Also variious conditions have been put in place to                                  prevent addition of duplicate test cases.
   - **Delete Match Details API:** (localhost:5000/api/cricket/945c2669-ef58-436b-bd41-2ae9c71d8a82) It deletes the match details for a particular key. Here key 
                               is "945c2669-ef58-436b-bd41-2ae9c71d8a82". Since it is not a good practice to use a primary key as a key for API's we have created a                                unique match id key that is generate by the uuid library.
   - **Update Match Details API:** (localhost:5000/api/cricket/e31cb520-c0d6-4827-b96c-81cc629b181e) It updates the match details for a particular key.The key                                       concept is same as above.
   - **Get Match Details API:** (localhost:5000/api/cricket/all) It fetched the entire data from the database and shows that to user.
   - **Get Team Statistics API:** (localhost:5000/api/cricket/teamStatistics) It fetched the entire data from the database. Then it calculates the win-lossratio                                of each team and sends the summary of this data to the UI where it is displayed in the form of a pie-chart.
    
   #### Database Schema: ####
    ```
    const cricketSchema = new mongoose.Schema({
          city: String,
          date: String,
          player_of_match: String,
          team1: String,
          team2: String,
          winner: String,
          matchId: String
      });
     ```
 ### Frontend Status: ###
  #### Ports ####
   - Frontend: 3000
  #### Features ####
   - Creation of Add form to add match details.
   - Display of team statistics from the Get Team Statistics API.
  #### Screenshots ####
  
  
  
## Installation

A shell script has been created to compile and run the app on docker. Please ensure that the docker is runnning before executing the script.

 ### Shell script working:###
     - The shell script calls the docker function to build the images for both the client and server.
     - After this the docker-compose is called that builds the images of the mongoDb and fetches the images made in the above step. Then it creates a docker contaioner    and sequentially compiles the images and connects them so that data can flow between the three components.

```sh
$ sh start_application.sh
```

## Contributors

[@RahulSharma](https://github.com/webber2408). 
[@AruvanshNigam](https://github.com/Aruvansh1997).


