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
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Background

We aim to create a distributed system that notifes the user about various cricketing stats presently going on. The user will have the flexibilty to choose the type of notifications it desires and the system will only send the relevant information to it.
We will be publishing the app on Docker so that the app is platform independant and can be used ubiquitously. 

## Technologies Used
- Front-End Development: React JS
- Back-End Development : Node JS
- Database: MongoDB
- Deployment : Docker

## Prerequisites:
1. [node](http://nodejs.org) 
2. [npm](https://npmjs.com)
3. [fastify](https://www.fastify.io/)
4. [fastify-cors](https://www.npmjs.com/package/fastify-cors)
5. [mongoose](https://mongoosejs.com/docs/)
6. [nodemon](https://www.npmjs.com/package/nodemon)
7. [uuid](https://www.npmjs.com/package/uuid)
8. [react](https://reactjs.org/)
9. [redux](https://redux.js.org/)
10. [axios](https://axios-http.com/docs/intro)
11. [highcharts](https://www.highcharts.com/)
12. [react-dom](https://reactjs.org/docs/react-dom.html)
13. [react-redux](https://react-redux.js.org/)
14. [react-scripts](https://www.npmjs.com/package/react-scripts)
15. [redux-thunk](https://github.com/reduxjs/redux-thunk)
16. [docker](https://www.docker.com/)


## Steps to Run

A shell script has been created to compile and run the app on docker. Please ensure that the docker is runnning before executing the script.

```sh
$ sh start_application.sh
```

## Usage

This is only a documentation package. You can print out [spec.md](spec.md) to your console:

```sh
$ standard-readme-spec
# Prints out the standard-readme spec
```

## Maintainers

[@RichardLitt](https://github.com/RichardLitt).


### Contributors

This project exists thanks to all the people who contribute. 
<a href="https://github.com/webber2408/CricketInfo/contributors"><img src="https://opencollective.com/standard-readme/contributors.svg?width=890&button=false" /></a>


