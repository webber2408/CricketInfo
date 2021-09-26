# Cricket Information System

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

This repository contains:

1. A shell script for executing the app.
2. A client folder.
3. A server folder.
4. Docker file.
5. Docker compose file for dockerizing all the three parts.


## Table of Contents

- [Background](#background)
- [Technologies Used](#technology)
- [Prerequisites](#prerequisites)
- [Steps to Run](#install)
- [Contributing](#contributing)

## Background

We aim to create a distributed system that notifes the user about various cricketing stats presently going on. The user will have the flexibilty to choose the type of notifications it desires and the system will only send the relevant information to it.
We will be publishing the app on Docker so that the app is platform independant and can be used ubiquitously. 

## Technologies Used
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


## Steps to Run

A shell script has been created to compile and run the app on docker. Please ensure that the docker is runnning before executing the script.

```sh
$ sh start_application.sh
```


## Contributors

[@RahulSharma](https://github.com/webber2408).
[@AruvanshNigam](https://github.com/Aruvansh1997).


