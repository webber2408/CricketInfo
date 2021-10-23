# Cricket Information System

![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)

This repository contains:

- A client folder.
- Server files.
- 3 Publisher folders. 
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
- Middleware : RabbitMQ

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
- [socket.io](https://socket.io/)
- [RabbitMQ](https://www.rabbitmq.com/)

## CurrentStatus 
**3rd October,2021:** We have created a full architecture of 3 publishers and n number of subscribers that intercat with each other in our pub sub model. Our middleware is RabbitMQ which serves as queue to transfer messages from the broker node to the client. The client can subscribe to three subscriptions and the data will be displayed in his dashboard. Also there are advertisements that pop up in the middle in each topic that lets user know what other data is being displayed in other topics. The user is given the flexibility to turn of the adds and turn on the adds as he deems fit. The data transferred by the publisher to the broker is also being transferred to the database. The data is transferred into the database only when there is a change in the data, thus preventing replications. We have also provisioned that advertisements are not pushed in the database.

**26th September,2021:** We have created a simple CRUD (Create,Read,Update,Delete) app that fetches the data from the database and gives us the relevant values.
We have created a UI where a person is able to see the win percentage of a particular team by clicking on the respective cards. Five API's have been created to create this version.

 ### Client-Server Interaction 
 ![](screenshots/clientServerInteraction.png)

 ### Backend Status: ###
   #### Ports ####
   - Backend: 5000
   - MongoDb: 27017
   - RabbitMq: 5672,15672,61613,15674
   - Publisher1: 5001
   - Publisher2: 5002
   - Publisher3: 5003
   - Websocket: 3004
   
   #### API's: ####
     [SportMonks](https://docs.sportmonks.com/cricket/) : An external cricketing API was used to fetch relevant data for the subscriber.

   #### Subscriptions: ####
   - Number of teams in a country: It displays the number of teams in a country.(Uses two api's)
   - Statistics of Team: Displays the win loss percentage of a team.(Uses two api's)
   - Umpires per Country: Displays the number of umpires and count per country.(Uses two api's)
      
   #### Database Schema: ####
    
   ```
   const userSchema = new mongoose.Schema({
     name: String,
     email: String,
     password: String,
     status: Number,
     subscribedTopicIds: Array,
     receiveAdvertisements: Boolean,
   });
   
   ```
   ```
     const topicSchema = new mongoose.Schema({
      topicName: String,
      topicDescription: String,
      topicId: String,
      topicData: Array,
      topicStatus: Number,
    });
   ```
    

 ### Frontend Status: ###
  #### Ports ####
   - Frontend: 3000
  #### Features ####
   - A subscriber can create his profile on the page using email address.
   - A user can login and check the subscriptions available.
   - The user can subscribe or unsubscribe to the subscriptions.
   - On clicking the subscribed topics the data will be visible along with advertisements. 
   - User can opt out to recieve advertisements or opt in.

  #### Screenshots ####
   - UI Landing Page
 
     ![](client/screenshots/UI-1.png)
   
   - UI add match form that uses the "Add match details api."

     ![](client/screenshots/UI-2.png)
     
   - UI add match form with sample values.
   
     ![](client/screenshots/UI-3.png)
     
   - UI add match success.

     ![](client/screenshots/UI-4.png)
     
   - UI match present check that prevents the user from adding the match if some constraints are satisfied.
     
     ![](client/screenshots/UI-5.png)
   
   - UI display of match statistics with the help of a pie chart.
     
     ![](client/screenshots/UI-6.png)
     
 
## Installation
The following commands are executed from the root directory.
 ```sh
  cd client
  docker build -t cricket-client .
  cd ..
  docker build -t cricket-api .
  cd Publisher1
  docker build -t cricket-api-publisher-1 .
  cd ../Publisher2
  docker build -t cricket-api-publisher-2 .
  cd ../Publisher3
  docker build -t cricket-api-publisher-3 .
  cd ..
  docker-compose up --remove-orphans
 ```

## Contributors

[@RahulSharma](https://github.com/webber2408). 
[@AruvanshNigam](https://github.com/Aruvansh1997).


